let express = require('express');
let router = express.Router();
let logger = require('log4js').getLogger(__filename);
let Sender = require('../../../utils/sender');
let User = require('../../../utils/db/dao/user');
let CommodityDetails = require('../../../utils/db/dao/commodity_details');
let ShoppingCart = require('../../../utils/db/dao/shopping_cart');
let sender = new Sender();

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

		logger.debug('Handling shopping cart create');
		let serial_number = req.body.serial_number;
		if (!serial_number) {
			logger.debug('Request body parameter serial_number is not found');
			sender.sendBadRequest(res);
			return;
		}

		let quantity = req.body.quantity;
		if (!quantity) {
			logger.debug('Request body parameter quantity is not found');
			sender.sendBadRequest(res);
			return;
		}

		CommodityDetails.retrieveRecord(serial_number).then(function (record) {
			if (record === null) {
				sender.sendCommodityDetailsRecordIsNotFound(res);
				return;
			}

			ShoppingCart.retrieveRecord(registration_phone_number, serial_number).then(function (record) {
				if (record !== null) {
					sender.sendShoppingCartRecordIsFound(res, record.quantity);
					return;
				}

				logger.debug('New record, insert into database');
				ShoppingCart.createRecord(req.body).then(function (isSuccess) {
					if (isSuccess) {
						sender.sendShoppingCartRecordInsertSuccess(res);
					} else {
						sender.sendShoppingCartRecordInsertFailed(res);
					}
				});
			});
		});
	}).catch(function (err) {
		logger.debug('Exception occur, err = ', err);
		sender.sendInternalServerError(res);
	});
});

module.exports = router;
