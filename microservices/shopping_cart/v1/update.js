let express = require('express');
let router = express.Router();
let logger = require('log4js').getLogger(__filename);
let Sender = require('../../../utils/sender');
let User = require('../../../utils/db/dao/user');
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

		logger.debug('Handling shopping cart update');
		let serial_number = req.body.serial_number;
		if (!serial_number) {
			logger.debug('Request body parameter serial_number is not found');
			sender.sendBadRequest(res);
			return;
		}

		ShoppingCart.isRecordFound(registration_phone_number, serial_number).then(function (isFound) {
			if (!isFound) {
				logger.debug('Record [', registration_phone_number, ', ', serial_number, '] is not found');
				sender.sendShoppingCartRecordIsNotFound(res);
				return;
			}

			logger.debug('Record [', registration_phone_number, ', ', serial_number, '] is found, update towards database');
			ShoppingCart.updateRecord(req.body).then(function (isSuccess) {
				if (isSuccess) {
					sender.sendShoppingCartRecordUpdateSuccess(res);
				} else {
					sender.sendShoppingCartRecordUpdateFailed(res);
				}
			});
		});
	}).catch(function (err) {
		logger.debug('Exception occur, err = ', err);
		sender.sendInternalServerError(res);
	});
});

module.exports = router;
