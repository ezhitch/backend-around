let crypto = require('crypto');
let fs = require('fs');
let path = require('path');
let logger = require('log4js').getLogger(__filename);
let RandomString = require('./random_string');

class PasswordHandler {
	constructor() {
		this.config = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'sysconfigs', 'password.json')));
		logger.debug('Password config = ', this.config);
	}

	encrypt(oriPassword) {
		logger.debug('Before encrypt, original password = ', oriPassword);
		let rdmStr = RandomString.generate(Math.floor(Math.random() * 10), 36);
		let password = oriPassword + rdmStr + rdmStr.length;
		let cipher = crypto.createCipher(this.config.algorithm, this.config.key);
		let encPassword = cipher.update(password, 'utf8', 'hex');
		encPassword += cipher.final('hex');
		logger.debug('After encrypt, encrypted password = ', encPassword);
		return encPassword;
	}

	decrypt(encPassword) {
		logger.debug('Before decrypt, encrypted password = ', encPassword);
		let decipher = crypto.createDecipher(this.config.algorithm, this.config.key);
		let decPassword = decipher.update(encPassword, 'hex', 'utf8');
		decPassword += decipher.final('utf8'); // decPassword is string

		// get the length of random string
		let rdmStrLen = decPassword.substr(decPassword.length - 1);

		// retrieve original password
		let oriPassword = decPassword.substr(0, decPassword.length - 1 - rdmStrLen);
		logger.debug('After decrypted, original password = ', oriPassword);
		return oriPassword;
	}
}

module.exports = PasswordHandler;
