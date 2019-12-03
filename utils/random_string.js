class RandomString {
	static generate(length, seed) {
		let str = '';
		for (; str.length < length;) {
			str += Math.random().toString(seed).substr(2);
		}
		return str.substr(0, length);
	}
}

module.exports = RandomString;
