let express = require('express');
let router = express.Router();
let logger = require('log4js').getLogger(__filename);
let Sender = require('../../../utils/sender');
let User = require('../../../utils/db/dao/user');
let ShoppingCart = require('../../../utils/db/dao/shopping_cart');
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

		logger.debug('Handling shopping cart delete');
		let serial_number = req.query.serial_number;
		if (!serial_number) {
			logger.debug('Request query parameter serial_number is not found');
			sender.sendBadRequest(res);
			return;
		}

		ShoppingCart.isRecordFound(registration_phone_number, serial_number).then(function (isFound) {
			if (!isFound) {
				logger.debug('Record [', registration_phone_number, ', ', serial_number, '] is not found');
				sender.sendShoppingCartRecordDeleteSuccess(res);
				return;
			}

			logger.debug('Record [', registration_phone_number, ', ', serial_number, '] is found, delete from database');
			ShoppingCart.deleteRecord(registration_phone_number, serial_number).then(function (isSuccess) {
				if (isSuccess) {
					sender.sendShoppingCartRecordDeleteSuccess(res);
				} else {
					sender.sendShoppingCartRecordDeleteFailed(res);
				}
			});
		});
	}).catch(function (err) {
		logger.debug('Exception occur, err = ', err);
		sender.sendInternalServerError(res);
	});
});

module.exports = router;
