let express = require('express');
let router = express.Router();
let logger = require('log4js').getLogger(__filename);
let Sender = require('../../../utils/sender');
let sender = new Sender();

router.post('/', function(req, res) {
	logger.debug('wx callback: req = ', req);
	sender.sendInventoryIsNotEnough(res);
});

module.exports = router;
