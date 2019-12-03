let express = require('express');
let app = express();
let path = require('path');
let log4js = require('log4js');
let bodyParser = require('body-parser');
let MySQL = require('./dbaccessor/mysql');
let Redis = require('./dbaccessor/redis');
let TokenHandler = require('./utils/token_handler');
let Sender = require('./utils/sender');

new MySQL(); // global resource
new Redis(); // global resource
let tokenHandler = new TokenHandler();
let sender = new Sender();

let logger = log4js.getLogger(__filename);
app.use(log4js.connectLogger(logger, {level: 'debug'}));

// verify request header mandatory parameters
app.use(function (req, res, next) {
	// it is not necessary to verify Content-Type for GET and DELETE methods as there is no entity body of them
	if (req.method !== 'GET'
		&& req.method !== 'DELETE') {
		// for other methods, need to verify Content-Type
		if (req.get('Content-Type') !== 'application/json') {
			logger.debug('Request header parameter Content-Type is invalid. Expect application/json');
			sender.sendBadRequest(res);
			return;
		}
	}

	if (req.get('Accept') !== 'image/*'
		&& req.get('Accept') !== 'application/json') {
		logger.debug('Request header parameter Accept is invalid. Expect image/* or application/json');
		sender.sendBadRequest(res);
		return;
	}

	if (!req.get('uuid')) {
		logger.debug('Request header parameter uuid is not found');
		sender.sendBadRequest(res);
		return;
	}

	next();
});

// serve static assets
app.use(express.static(path.join(__dirname, 'public')));

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

// user authentication
app.use(function (req, res, next) {
	// it is not necessary to do user authentication as there is no token (for new users) for below requests
	if (req.path !== '/user/v1/get_registration_authcode'
		&& req.path !== '/user/v1/register'
		&& req.path !== '/user/v1/login'
		&& req.path !== '/commodity_details/v1/retrieve'
		// or for registered users for below requests
		&& req.path !== '/user/v1/get_reset_password_authcode'
		&& req.path !== '/user/v1/reset_password'
	) {
		// for other requests, need to verify token
		let token = req.get('token');
		if (!token) {
			logger.debug('Request header parameter token is not found');
			sender.sendBadRequest(res);
			return;
		}

		logger.debug('Verify request header parameter token: ', token);
		if (!tokenHandler.verify(req.get('uuid'), token)) {
			sender.sendInvalidToken(res);
			return;
		}
	}

	next();
});

// BUSINESS HANDLING BEGIN
let user_v1_index = require('./microservices/user/v1/index');
app.use('/user/v1',
	function(req, res, next) {
		logger.debug('Received: /user/v1');
		next();
	},
	user_v1_index
);

let delivery_address_v1_index = require('./microservices/delivery_address/v1/index');
app.use('/delivery_address/v1',
	function(req, res, next) {
		logger.debug('Received: /delivery_address/v1');
		next();
	},
	delivery_address_v1_index
);

let commodity_details_v1_index = require('./microservices/commodity_details/v1/index');
app.use('/commodity_details/v1',
	function(req, res, next) {
		logger.debug('Received: /commodity_details/v1');
		next();
	},
	commodity_details_v1_index
);

let shopping_cart_v1_index = require('./microservices/shopping_cart/v1/index');
app.use('/shopping_cart/v1',
	function(req, res, next) {
		logger.debug('Received: /shopping_cart/v1');
		next();
	},
	shopping_cart_v1_index
);

let user_order_v1_index = require('./microservices/user_order/v1/index');
app.use('/user_order/v1',
	function(req, res, next) {
		logger.debug('Received: /user_order/v1');
		next();
	},
	user_order_v1_index
);
// BUSINESS HANDLING END

// default url handler
app.use(function(req, res, next) {
	logger.debug('Request url is not found: ', req.path);
    sender.sendNotFound(res);
    next();
});

module.exports = app;
