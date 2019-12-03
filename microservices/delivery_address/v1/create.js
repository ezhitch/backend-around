let express = require('express');
let router = express.Router();
let logger = require('log4js').getLogger(__filename);
let Sender = require('../../../utils/sender');
let User = require('../../../utils/db/dao/user');
let DeliveryAddress = require('../../../utils/db/dao/delivery_address');
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

		logger.debug('Handling delivery address create');
		let address_number = req.body.address_number;
		if (!address_number) {
			logger.debug('Request body parameter address_number is not found');
			sender.sendBadRequest(res);
			return;
		}

		DeliveryAddress.isRecordFound(registration_phone_number, address_number).then(function (isFound) {
			if (isFound) {
				logger.debug('Record [', registration_phone_number, ', ', address_number, '] is found');
				sender.sendDeliveryAddressRecordIsFound(res);
				return;
			}

			logger.debug('New record, insert into database');
			DeliveryAddress.createRecord(req.body).then(function (isSuccess) {
				if (isSuccess) {
					sender.sendDeliveryAddressRecordInsertSuccess(res);
				} else {
					sender.sendDeliveryAddressRecordInsertFailed(res);
				}
			});
		});
	}).catch(function (err) {
		logger.debug('Exception occur, err = ', err);
		sender.sendInternalServerError(res);
	});
});

module.exports = router;
