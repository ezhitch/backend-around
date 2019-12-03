let express = require('express');
let router = express.Router();
let logger = require('log4js').getLogger(__filename);
let Sender = require('../../../utils/sender');
let User = require('../../../utils/db/dao/user');
let DeliveryAddress = require('../../../utils/db/dao/delivery_address');
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

		logger.debug('Handling delivery address delete');
		let address_number = req.query.address_number;
		if (!address_number) {
			logger.debug('Request query parameter address_number is not found');
			sender.sendBadRequest(res);
			return;
		}

		DeliveryAddress.isRecordFound(registration_phone_number, address_number).then(function (isFound) {
			if (!isFound) {
				logger.debug('Record [', registration_phone_number, ', ', address_number, '] is not found');
				sender.sendDeliveryAddressRecordDeleteSuccess(res);
				return;
			}

			logger.debug('Record [', registration_phone_number, ', ', address_number, '] is found, delete from database');
			DeliveryAddress.deleteRecord(registration_phone_number, address_number).then(function (isSuccess) {
				if (isSuccess) {
					sender.sendDeliveryAddressRecordDeleteSuccess(res);
				} else {
					sender.sendDeliveryAddressRecordDeleteFailed(res);
				}
			});
		});
	}).catch(function (err) {
		logger.debug('Exception occur, err = ', err);
		sender.sendInternalServerError(res);
	});
});

module.exports = router;
