let express = require('express');
let app = express();
let logger = require('log4js').getLogger(__filename);
let get_registration_authcode = require('./get_registration_authcode');
let register = require('./register');
let login = require('./login');
let logout = require('./logout');
let get_reset_password_authcode = require('./get_reset_password_authcode');
let reset_password = require('./reset_password');

app.use('/get_registration_authcode',
	function(req, res, next) {
		logger.debug('Received: /get_registration_authcode');
		next();
	},
	get_registration_authcode
);

app.use('/register',
	function(req, res, next) {
		logger.debug('Received: /register');
		next();
	},
	register
);

app.use('/login',
	function(req, res, next) {
		logger.debug('Received: /login');
		next();
	},
	login
);

app.use('/logout',
	function(req, res, next) {
		logger.debug('Received: /logout');
		next();
	},
	logout
);

app.use('/get_reset_password_authcode',
	function(req, res, next) {
		logger.debug('Received: /get_reset_password_authcode');
		next();
	},
	get_reset_password_authcode
);

app.use('/reset_password',
	function(req, res, next) {
		logger.debug('Received: /reset_password');
		next();
	},
	reset_password
);

module.exports = app;