let express = require('express');
let router = express.Router();
let logger = require('log4js').getLogger(__filename);
let Sender = require('../../../utils/sender');
let User = require('../../../utils/db/dao/user');
let DeliveryAddress = require('../../../utils/db/dao/delivery_address');
let sender = new Sender();

router.get('/', function(req, res) {
	let registration_phone_number = req.query.registration_phone_number;
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

		logger.debug('Handling delivery address retrieve');
		DeliveryAddress.retrieveRecords(registration_phone_number).then(function (records) {
			sender.sendDeliveryAddressRecordsRetrieveSuccess(res, records); // could be EMPTY array []
		});
	}).catch(function (err) {
		logger.debug('Exception occur, err = ', err);
		sender.sendInternalServerError(res);
	});
});

module.exports = router;
