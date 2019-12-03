let express = require('express');
let router = express.Router();
let logger = require('log4js').getLogger(__filename);
let TokenHandler = require('../../../utils/token_handler');
let PasswordHandler = require('../../../utils/password_handler');
let Sender = require('../../../utils/sender');
let User = require('../../../utils/db/dao/user');
let tokenHandler = new TokenHandler();
let passwordHandler = new PasswordHandler();
let sender = new Sender();

router.post('/', function(req, res) {
	let registration_phone_number = req.body.registration_phone_number;
    if (!registration_phone_number) {
        logger.debug('Request body parameter registration_phone_number is not found');
        sender.sendBadRequest(res);
        return;
    }

    let password = req.body.password;
    if (!password) {
        logger.debug('Request body parameter password is not found');
        sender.sendBadRequest(res);
        return;
    }

    User.isValid(registration_phone_number, password).then(function (isValid) {
	    if (isValid) {
		    logger.debug('Handling user login');
		    User.enableLogin(registration_phone_number).then(function (isSuccess) {
			    if (isSuccess) {
				    logger.debug('Login success. Generate token');
				    let token = tokenHandler.generate(req.get('uuid'), registration_phone_number, passwordHandler.encrypt(password));
				    res.set('token', token); // assign to res header and store in app
				    sender.sendUserLoginSuccess(res);
			    } else {
				    sender.sendUserLoginFailed(res);
			    }
		    });
	    } else {
	    	sender.sendUserLoginFailed(res);
	    }
    }).catch(function (err) {
	    logger.debug('Exception occur, err = ', err);
	    sender.sendInternalServerError(res);
    });
});

module.exports = router;
