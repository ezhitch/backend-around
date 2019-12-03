let express = require('express');
let router = express.Router();
let logger = require('log4js').getLogger(__filename);
let xml2js = require('xml2js');
let moment = require('moment');
let Sender = require('../../../utils/sender');
let User = require('../../../utils/db/dao/user');
let CommodityDetails = require('../../../utils/db/dao/commodity_details');
let DeliveryAddress = require('../../../utils/db/dao/delivery_address');
let ShoppingCart = require('../../../utils/db/dao/shopping_cart');
let WXPay = require('../../../pay/wxpay');
let sender = new Sender();
let wxPay = new WXPay();

router.post('/', function(req, res) {
	let registration_phone_number = req.body.registration_phone_number;
	if (!registration_phone_number) {
		logger.debug('Request body parameter registration_phone_number is not found');
		sender.sendBadRequest(res);
		return;
	}

	User.isLogin(registration_phone_number).then(function (isLogin) {
		if (!isLogin) {
			sender.sendUserHasLogout(res);
			return;
		}

		let address_number = req.body.address_number;
		if (!address_number) {
			logger.debug('Request body parameter address_number is not found');
			sender.sendBadRequest(res);
			return;
		}

		DeliveryAddress.isRecordFound(registration_phone_number, address_number).then(function (isFound) {
			if (!isFound) {
				logger.debug('Record [', registration_phone_number, ', ', address_number, '] is not found');
				sender.sendDeliveryAddressRecordIsNotFound(res);
				return;
			}

			let list = req.body.list;
			if (!list) {
				logger.debug('Request body parameter list is not found');
				sender.sendBadRequest(res);
				return;
			}

			logger.debug('Handling user order submit');
			CommodityDetails.checkInventory(list).then(function (commodityList) {
				let allEnough = true;
				for (let idx = 0; idx < commodityList.length; ++idx) {
					allEnough = allEnough && commodityList[idx].is_enough;
				}

				if (!allEnough) {
					sender.sendInventoryIsNotEnough(res, commodityList);
					return;
				}

				let order_number = moment().format('YYYYMMDDHHmmssSSSx');
				wxPay.callUnifiedOrder(order_number).then(function (response) {
					xml2js.parseString(response.body, {explicitArray: false, ignoreAttrs: true}, function(err, jsonBody) {
						if (err) {
							logger.debug('WXPay unified order error, err = ', err);
							sender.sendWXPayFailed(res);
							return;
						}
						logger.debug('WXPay unified order success, result = ', jsonBody);

						CommodityDetails.updateRecords(commodityList).then(function (isSuccess) {
							if (!isSuccess) {
								sender.sendUpdateCommodityDetailsFailed(res);
								return;
							}

							ShoppingCart.transferRecords(registration_phone_number, order_number, address_number).then(function (isSuccess) {
								if (!isSuccess) {
									sender.sendTransferRecordsFailed(res);
									return;
								}

								ShoppingCart.deleteRecords(registration_phone_number).then(function (isSuccess) {
									if (!isSuccess) {
										sender.sendShoppingCartDeleteRecordsFailed(res);
										return;
									}

									logger.debug('Submit order success');
									sender.sendWXPayProfile(res, jsonBody.xml);
								});
							});
						});
					});
				});
			});
		});
	}).catch(function (err) {
		logger.debug('Exception occur, err = ', err);
		sender.sendInternalServerError(res);
	});
});

module.exports = router;
