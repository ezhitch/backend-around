const express = require('express');
const app = express();
const logger = require('log4js').getLogger(__filename);
const get_category = require('./get_category');
const get_item = require('./get_item');
const get_info_detail = require('./get_info_detail');

app.use('/get_category',
	function(req, res, next) {
		logger.debug('Received: /get_category');
		next();
	},
    get_category
);

app.use('/get_item',
    function(req, res, next) {
        logger.debug('Received: /get_item');
        next();
    },
    get_item
);

app.use('/get_info_detail',
    function(req, res, next) {
        logger.debug('Received: /get_info_detail');
        next();
    },
    get_info_detail
);
module.exports = app;