const fs = require('fs');
const path = require('path');
const pMySQL = require('promise-mysql');

class MySQL {
	constructor() {
		if (MySQL.pool === null) {
			MySQL.pool = pMySQL.createPool(JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'sysconfigs', 'mysql.json'))));
		}
	}
}

// class static attribute
MySQL.pool = null;

// module export declaration
module.exports = MySQL;
