let express = require('express');
let app = express();
let logger = require('log4js').getLogger(__filename);
let create = require('./create');
let _delete = require('./delete');
let update = require('./update');
let retrieve = require('./retrieve');

app.use('/create',
	function(req, res, next) {
		logger.debug('Received: /create');
		next();
	},
	create
);

app.use('/delete',
	function(req, res, next) {
		logger.debug('Received: /delete');
		next();
	},
	_delete
);

app.use('/update',
	function(req, res, next) {
		logger.debug('Received: /update');
		next();
	},
	update
);

app.use('/retrieve',
	function(req, res, next) {
		logger.debug('Received: /retrieve');
		next();
	},
	retrieve
);

module.exports = app;