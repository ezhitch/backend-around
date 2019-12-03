const fs = require('fs');
const path = require('path');
const redis = require('redis');

class Redis {
	constructor() {
		if (Redis.client === null) {
			Redis.client = redis.createClient(JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'sysconfigs', 'redis.json'))));
		}
	}
}

// class static attribute
Redis.client = null;

// module export declaration
module.exports = Redis;
