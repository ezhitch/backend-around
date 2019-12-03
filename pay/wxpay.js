let fs = require('fs');
let path = require('path');
let logger = require('log4js').getLogger(__filename);
let MD5 = require('MD5');
let xml2js = require('xml2js');
let request = require("request-promise-native");
let RandomString = require('../utils/random_string');

class WXPay {
	constructor() {
		this.config = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'sysconfigs', 'wxpay.json')));
		logger.debug('WXPay config = ', this.config);
	}

	callUnifiedOrder(order_number) {
		let body = {};
		body.appid = this.config.appid;
		body.attach = '微信支付测试';
		body.body = '微信支付测试';
		body.mch_id = this.config.mch_id;
		body.nonce_str = RandomString.generate(32, 36);
		body.notify_url = this.config.notify_url;
		body.out_trade_no = order_number;
		body.spbill_create_ip = this.config.host;
		body.total_fee = 1;
		body.trade_type = this.config.trade_type;

		let sortedBody = {};
		Object.keys(body).sort().forEach(function(k) {
			sortedBody[k] = body[k];
		});
		logger.debug('Sorted body = ', sortedBody);

		let befSignStr = sortedBody + '&key=' + this.config.key;
		body.sign = MD5(befSignStr).toUpperCase();

		let builder = new xml2js.Builder({rootName: 'xml', headless: true});
		let xmlBody = builder.buildObject(body);
		logger.debug('Xml body = ', xmlBody);

		return request({
			uri: 'http://localhost:9000/pay/unifiedorder',
			method: 'POST',
			headers: {
				'Accept': 'application/xml',
				'Content-Type': 'text/xml'
			},
			body: xmlBody,
			resolveWithFullResponse: true
		});
	}
}

module.exports = WXPay;
