let express = require('express');
let router = express.Router();
let logger = require('log4js').getLogger(__filename);
let Sender = require('../../../utils/sender');
let User = require('../../../utils/db/dao/user');
let sender = new Sender();

router.post('/', function(req, res) {
	let registration_phone_number = req.body.registration_phone_number;
    if (!registration_phone_number) {
        logger.debug('Request body parameter registration_phone_number is not found');
        sender.sendBadRequest(res);
        return;
    }

	User.disableLogin(registration_phone_number).then(function (isSuccess) {
		if (isSuccess) {
			sender.sendUserLogoutSuccess(res);
		} else {
			sender.sendUserLogoutFailed(res);
		}
	}).catch(function (err) {
		logger.debug('Exception occur, err = ', err);
		sender.sendInternalServerError(res);
	});
});

module.exports = router;
