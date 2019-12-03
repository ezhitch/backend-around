let express = require('express');
let router = express.Router();
let logger = require('log4js').getLogger(__filename);
let Sender = require('../../../utils/sender');
let User = require('../../../utils/db/dao/user');
let UserOrder = require('../../../utils/db/dao/user_order');
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

		logger.debug('Handling user orders retrieve');
		UserOrder.retrieveOrders(registration_phone_number).then(function (records) {
			sender.sendUserOrderOrdersRetrieveSuccess(res, records);
		});
	}).catch(function (err) {
		logger.debug('Exception occur, err = ', err);
		sender.sendInternalServerError(res);
	});
});

module.exports = router;
