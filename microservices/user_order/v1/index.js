let express = require('express');
let app = express();
let logger = require('log4js').getLogger(__filename);
let submit = require('./submit');
let retrieve = require('./retrieve');
let _delete = require('./delete');
let wxpay_async_callback = require('./wxpay_async_callback');

app.use('/submit',
	function(req, res, next) {
		logger.debug('Received: /submit');
		next();
	},
	submit
);

app.use('/retrieve',
	function(req, res, next) {
		logger.debug('Received: /retrieve');
		next();
	},
	retrieve
);

app.use('/delete',
	function(req, res, next) {
		logger.debug('Received: /delete');
		next();
	},
	_delete
);

app.use('/wxpay_async_callback',
	function(req, res, next) {
		logger.debug('Received: /wxpay_async_callback');
		next();
	},
	wxpay_async_callback
);

module.exports = app;