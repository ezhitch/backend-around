let express = require('express');
let router = express.Router();
let logger = require('log4js').getLogger(__filename);
let Sender = require('../../../utils/sender');
let Ask = require('../../../dao/ask');
let sender = new Sender();

router.get('/', function(req, res) {
    // let registration_phone_number = req.query.registration_phone_number;
    // if (!registration_phone_number) {
    //     logger.debug('Request query parameter registration_phone_number is not found');
    //     sender.sendBadRequest(res);
    //     return;
    // }

    Ask.retrieveCategory().then(function (record) {
	    if (record === null) {
		    logger.debug('No recored found');
		    // AuthcodeGenerator.generate(function (authcode) {
			 //    logger.debug('Generate registration authcode success, store {',
				//     registration_phone_number, ' : ', authcode, '} pair into redis');
		    // });
	    } else {
		    logger.debug('record: ', record);
		    sender.sendCategory(res, record);
	    }
    }).catch(function (err) {
	    logger.debug('Exception occur, err = ', err);
	    sender.sendInternalServerError(res);
    });
});

module.exports = router;
