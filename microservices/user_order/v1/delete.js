let express = require('express');
let router = express.Router();
let logger = require('log4js').getLogger(__filename);
let Sender = require('../../../utils/sender');
let User = require('../../../utils/db/dao/user');
let UserOrder = require('../../../utils/db/dao/user_order');
let sender = new Sender();

router.delete('/', function(req, res) {
	let registration_phone_number = req.query.registration_phone_number;
	if (!registration_phone_number) {
		logger.debug('Request query parameter registration_phone_number is not found');
		sender.sendBadRequest(res);
		return;
	}

	User.isLogin(registration_phone_number).then(function (isLogin) {
		if (!isLogin) {
			sender.sendUserHasLogout(res);
			return;
		}

		logger.debug('Handling user order delete');
		let order_number = req.query.order_number;
		if (!order_number) {
			logger.debug('Request query parameter order_number is not found');
			sender.sendBadRequest(res);
			return;
		}

		UserOrder.isOrderFound(registration_phone_number, order_number).then(function (isFound) {
			if (!isFound) {
				logger.debug('Record [', registration_phone_number, ', ', order_number, '] is not found');
				sender.sendUserOrderOrderDeleteSuccess(res);
				return;
			}

			logger.debug('Record [', registration_phone_number, ', ', order_number, '] is found, delete from database');
			UserOrder.deleteOrders(registration_phone_number, order_number).then(function (isSuccess) {
				if (isSuccess) {
					sender.sendUserOrderOrderDeleteSuccess(res);
				} else {
					sender.sendUserOrderOrderDeleteFalied(res);
				}
			});
		});
	}).catch(function (err) {
		logger.debug('Exception occur, err = ', err);
		sender.sendInternalServerError(res);
	});
});

module.exports = router;
