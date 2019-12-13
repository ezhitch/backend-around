let fs = require('fs');
let path = require('path');
let pMySQL = require('promise-mysql');
let logger = require('log4js').getLogger(__filename);

class MySQL {
	constructor() {
		if (MySQL.pool === null) {
			MySQL.pool = pMySQL.createPool(
			    JSON.parse(fs.readFileSync(path.join(__dirname, '../..', 'configs', 'mysql.json')))
            );
            if (MySQL.pool) {
                logger.debug('Create MySQL pool success.');
            }
		}
	}
}

// class static attribute
MySQL.pool = null;

// module export declaration
module.exports = MySQL;
