let express = require('express');
let router = express.Router();
let logger = require('log4js').getLogger(__filename);
let Redis = require('../../../dbaccessor/redis');
let AuthcodeGenerator = require('../../../utils/authcode_generator');
let Sender = require('../../../utils/sender');
let User = require('../../../utils/db/dao/user');
let sender = new Sender();

router.get('/', function(req, res) {
	let registration_phone_number = req.query.registration_phone_number;
    if (!registration_phone_number) {
        logger.debug('Request query parameter registration_phone_number is not found');
        sender.sendBadRequest(res);
        return;
    }

	User.retrieveRecord(registration_phone_number).then(function (record) {
		if (record === null) {
			logger.debug('Unknown registration phone number');
			sender.sendUnknownRegistrationPhoneNumber(res);
		} else {
			logger.debug('Registered user, generate reset password authcode');
			AuthcodeGenerator.generate(function (authcode) {
				logger.debug('Generate reset password authcode success, store {',
					registration_phone_number, ' : ', authcode, '} pair into redis');
				Redis.client.multi()
				.set(registration_phone_number, authcode)
				.expire(registration_phone_number, 10 * 60) // the authcode expiration period is 10 minutes
				.exec(function (err, result) {
					if (err) {
						logger.debug('Redis store error, err = ', err);
						sender.sendInternalServerError(res);
						return;
					}
					logger.debug('Redis store success, result = ', result);
					sender.sendGenerateAuthcodeSuccess(res, authcode);
				});
			});
		}
	}).catch(function (err) {
		logger.debug('Exception occur, err = ', err);
		sender.sendInternalServerError(res);
	});
});

module.exports = router;
