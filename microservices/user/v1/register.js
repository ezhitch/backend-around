let express = require('express');
let router = express.Router();
let logger = require('log4js').getLogger(__filename);
let Redis = require('../../../dbaccessor/redis');
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

    let authcode = req.body.authcode;
    if (!authcode) {
        logger.debug('Request body parameter authcode is not found');
        sender.sendBadRequest(res);
        return;
    }

    let password = req.body.password;
    if (!password) {
        logger.debug('Request body parameter password is not found');
        sender.sendBadRequest(res);
        return;
    }

	User.retrieveRecord(registration_phone_number).then(function (record) {
		if (record === null) {
			logger.debug('New user register, verify authcode which user inputs');
			Redis.client.get(registration_phone_number, function (err, authcode) {
				if (err) {
					logger.debug('Redis error, err = ', err);
					sender.sendInternalServerError(res);
					return;
				}

				if (authcode === null) {
					logger.debug('Authcode of registration phone number: ',
						registration_phone_number, ' is not found in redis');
					sender.sendAuthcodeIsNotFound(res);
					return;
				}

				logger.debug('Authcode is found in redis: {registration_phone_number : authcode} = {',
					registration_phone_number, ' : ', authcode, '}');
				logger.debug('Comparing req.body.authcode with redis.authcode');
				if (req.body.authcode !== authcode) {
					logger.debug('Invalid request body parameter authcode: req.body.',
						req.body.authcode, ' !== redis.', authcode);
					sender.sendInvalidAuthcode(res);
					return;
				} else {
					logger.debug('Request body parameter authcode is valid');
					logger.debug('Handling user register');
				}

				User.createRecord(req.body).then(function (isSuccess) {
					if (isSuccess) {
						sender.sendUserRegisterSuccess(res);
					} else {
						sender.sendUserRegisterFailed(res);
					}
				});
			});
		} else {
			logger.debug('User has registered');
			sender.sendUserHasRegistered(res);
		}
	}).catch(function (err) {
		logger.debug('Exception occur, err = ', err);
		sender.sendInternalServerError(res);
	});
});

module.exports = router;
