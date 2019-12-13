let express = require('express');
let app = express();
let path = require('path');
let logger = require('log4js').getLogger(__filename);
let bodyParser = require('body-parser');
let MySQL = require('../dao/accessor/mysql');
new MySQL(); // global resource
let Sender = require('../utils/sender');
let sender = new Sender();
let ask_v1_index = require('../business/ask/v1/index');

// authentication
app.use(function (req, res, next) {
    next();
});

// verify request header parameters
app.use(function (req, res, next) {
    if (req.get('Content-Type') !== 'application/json') {
        logger.debug('Request header parameter Content-Type is invalid. Expect application/json.');
        sender.sendBadRequest(res);
        return;
    }

	if (req.get('Accept') !== 'image/*'
        && req.get('Accept') !== 'application/json') {
		logger.debug('Request header parameter Accept is invalid. Expect image/* or application/json.');
		sender.sendBadRequest(res);
		return;
	}

	next();
});

// static assets
app.use('/static', express.static(path.join(__dirname, 'public')));

// parse body to json format
app.use(bodyParser.json());

// logging incoming request
app.use(function (req, res, next) {
    logger.debug('Incoming request:\n',
	    'httpVersion: ', req.httpVersion, '\n',
	    'headers: ', req.headers, '\n',
	    'url: ', req.url, '\n',
	    'method: ', req.method, '\n',
	    'query: ', req.query, '\n',
	    'body: ', req.body
    );
    next();
});

// BUSINESS HANDLING BEGIN
app.use('/ask/v1',
	function(req, res, next) {
		logger.debug('Received: /ask/v1');
		next();
	},
	ask_v1_index
);
// BUSINESS HANDLING END

// default url handler
app.use(function(req, res, next) {
	logger.debug('Request url is not found: ', req.path);
    sender.sendNotFound(res);
    next();
});

module.exports = app;
