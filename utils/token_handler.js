let crypto = require('crypto');
let fs = require('fs');
let path = require('path');
let logger = require('log4js').getLogger(__filename);
let PasswordHandler = require('../utils/password_handler');
let User = require('../utils/db/dao/user');
let passwordHandler = new PasswordHandler();

class TokenHandler {
	constructor() {
		this.config = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'sysconfigs', 'token.json')));
		logger.debug('Token config = ', this.config);
	}

	generate(uuid, registration_phone_number, password) {
		let curTime = new Date().getTime();
		let tokenSchema = {
			'salt': this.config.salt,
			'expired_time': curTime + this.config.expirationPeriod,
			'uuid': uuid,
			'registration_phone_number': registration_phone_number,
			'password': password
		};
		let cipher = crypto.createCipher(this.config.algorithm, this.config.key);
		let encToken = cipher.update(JSON.stringify(tokenSchema), 'utf8', 'hex');
		encToken += cipher.final('hex');
		logger.debug('After encrypted, token = ', encToken);
		return encToken;
	}

	async verify(uuid, token) {
		let decipher = crypto.createDecipher(this.config.algorithm, this.config.key);
		let decToken = decipher.update(token, 'hex', 'utf8');
		decToken += decipher.final('utf8'); // decToken is string
		let tokenSchema = JSON.parse(decToken);
		logger.debug('After decrypt, token schema = ', tokenSchema);

		// compare uuid
		if (tokenSchema.uuid !== uuid) {
			logger.debug('Invalid uuid: token.', tokenSchema.uuid, ' !== req.header.', uuid);
			return false;
		}

		// compare salt
		if (tokenSchema.salt !== this.config.salt) {
			logger.debug('Invalid salt: token.', tokenSchema.salt, ' !== config.', this.config.salt);
			return false;
		}

		// verify token expired_time
		let curTime = new Date().getTime();
		if (tokenSchema.expired_time < curTime) {
			logger.debug('Token is expired: token.expired_time = ', tokenSchema.expired_time, ', curTime = ', curTime);
			return false;
		}

		// verify user
		let result = false;
		await User.isValid(tokenSchema.registration_phone_number, passwordHandler.decrypt(tokenSchema.password)).then(function (isValid) {
			result = isValid;
		}).catch(function (err) {
			logger.debug('Exception occur, err = ', err);
			result = false;
		});

		return result;
	}
}

module.exports = TokenHandler;
