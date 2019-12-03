let RandomString = require('./random_string');

class AuthcodeGenerator {
	static generate(cb) {
		cb(RandomString.generate(4, 10));
	}
}

module.exports = AuthcodeGenerator;
