let express = require('express');
let router = express.Router();
let logger = require('log4js').getLogger(__filename);
let Sender = require('../../../utils/sender');
let CommodityDetails = require('../../../utils/db/dao/commodity_details');
let sender = new Sender();

router.get('/', function(req, res) {
	let serial_number = req.query.serial_number;
    if (!serial_number) {
        logger.debug('Request query parameter serial_number is not found');
        sender.sendBadRequest(res);
        return;
    }

	CommodityDetails.retrieveRecord(serial_number).then(function (record) {
	    sender.sendCommodityDetailsRecord(res, record);
    }).catch(function (err) {
	    logger.debug('Exception occur, err = ', err);
	    sender.sendInternalServerError(res);
    });
});

module.exports = router;
