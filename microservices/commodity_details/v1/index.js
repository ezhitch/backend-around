let express = require('express');
let app = express();
let logger = require('log4js').getLogger(__filename);
let retrieve = require('./retrieve');

app.use('/retrieve',
	function(req, res, next) {
		logger.debug('Received: /retrieve');
		next();
	},
	retrieve
);

module.exports = app;
