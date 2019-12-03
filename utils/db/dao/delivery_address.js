let logger = require('log4js').getLogger(__filename);
let MySQL = require('../../../dbaccessor/mysql');

class DeliveryAddress {
	static async isRecordFound(registration_phone_number, address_number) {
		let isFound = false;
		await DeliveryAddress._retrieveRecord(registration_phone_number, address_number).then(function (record) {
			isFound = record !== null;
		}).catch(function (err) {
			throw err;
		});
		return isFound;
	}

	static async createRecord(reqBody) {
		let isSuccess = false;
		let connection = null;
		await MySQL.pool.getConnection().then(function (conn) {
			connection = conn;
			let sql = 'INSERT INTO delivery_address(registration_phone_number, address_number, receiver_name, ' +
				'receiver_phone_number, province, city, district, street, detailed_address, postcode) ' +
				'VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
			let params = [
				reqBody.registration_phone_number,
				reqBody.address_number,
				reqBody.receiver_name,
				reqBody.receiver_phone_number,
				reqBody.province,
				reqBody.city,
				reqBody.district,
				reqBody.street,
				reqBody.detailed_address,
				reqBody.postcode
			];
			logger.debug('SQL = ', sql);
			logger.debug('Params = ', params);
			return connection.query(sql, params);
		}).then(function (result) {
			if (connection) {
				MySQL.pool.releaseConnection(connection);
				connection = null;
			}

			logger.debug('Result = ', result);
			let obj = JSON.parse(JSON.stringify(result));
			if (obj.affectedRows === 1) {
				logger.debug('Record insert success');
				isSuccess = true;
			} else {
				logger.debug('Record insert failed');
				isSuccess = false;
			}
		}).catch(function (err) {
			if (connection) {
				MySQL.pool.releaseConnection(connection);
				connection = null;
			}
			throw err;
		});
		return isSuccess;
	}

	static async deleteRecord(registration_phone_number, address_number) {
		let isSuccess = false;
		let connection = null;
		await MySQL.pool.getConnection().then(function (conn) {
			connection = conn;
			let sql = 'DELETE FROM delivery_address ' +
				'WHERE registration_phone_number = ? ' +
				'AND address_number = ?';
			let params = [
				registration_phone_number,
				address_number
			];
			logger.debug('SQL = ', sql);
			logger.debug('Params = ', params);
			return connection.query(sql, params);
		}).then(function (result) {
			if (connection) {
				MySQL.pool.releaseConnection(connection);
				connection = null;
			}

			logger.debug('Result = ', result);
			let obj = JSON.parse(JSON.stringify(result));
			if (obj.affectedRows === 1) {
				logger.debug('Record delete success');
				isSuccess = true;
			} else {
				logger.debug('Record delete failed');
				isSuccess = false;
			}
		}).catch(function (err) {
			if (connection) {
				MySQL.pool.releaseConnection(connection);
				connection = null;
			}
			throw err;
		});
		return isSuccess;
	}

	static async updateRecord(reqBody) {
		let isSuccess = false;
		let connection = null;
		await MySQL.pool.getConnection().then(function (conn) {
			connection = conn;
			let sql = 'UPDATE delivery_address ' +
				'SET receiver_name = ?, ' +
				'receiver_phone_number = ?, ' +
				'province = ?, ' +
				'city = ?, ' +
				'district = ?, ' +
				'street = ?, ' +
				'detailed_address = ?, ' +
				'postcode = ? ' +
				'WHERE registration_phone_number = ? ' +
				'AND address_number = ?';
			let params = [
				reqBody.receiver_name,
				reqBody.receiver_phone_number,
				reqBody.province,
				reqBody.city,
				reqBody.district,
				reqBody.street,
				reqBody.detailed_address,
				reqBody.postcode,
				reqBody.registration_phone_number,
				reqBody.address_number
			];
			logger.debug('SQL = ', sql);
			logger.debug('Params = ', params);
			return connection.query(sql, params);
		}).then(function (result) {
			if (connection) {
				MySQL.pool.releaseConnection(connection);
				connection = null;
			}

			logger.debug('Result = ', result);
			let obj = JSON.parse(JSON.stringify(result));
			if (obj.affectedRows === 1) {
				logger.debug('Record update success');
				isSuccess = true;
			} else {
				logger.debug('Record update failed');
				isSuccess = false;
			}
		}).catch(function (err) {
			if (connection) {
				MySQL.pool.releaseConnection(connection);
				connection = null;
			}
			throw err;
		});
		return isSuccess;
	}

	static async retrieveRecords(registration_phone_number) {
		let records = [];
		let connection = null;
		await MySQL.pool.getConnection().then(function (conn) {
			connection = conn;
			let sql = 'SELECT * ' +
				'FROM delivery_address ' +
				'WHERE registration_phone_number = ?';
			let params = [registration_phone_number];
			logger.debug('SQL = ', sql);
			logger.debug('Params = ', params);
			return connection.query(sql, params);
		}).then(function (result) {
			if (connection) {
				MySQL.pool.releaseConnection(connection);
				connection = null;
			}

			logger.debug('Result = ', result);
			records = JSON.parse(JSON.stringify(result));
			logger.debug('Records retrieve success');
		}).catch(function (err) {
			if (connection) {
				MySQL.pool.releaseConnection(connection);
				connection = null;
			}
			throw err;
		});
		return records;
	}

	static async setDefaultAddress(reqBody) {
		let isSuccess = false;
		let connection = null;
		await MySQL.pool.getConnection().then(function (conn) {
			connection = conn;
			let sql = 'UPDATE delivery_address ' +
				'SET is_default_address = 0 ' + // set all records to 0 at first
				'WHERE registration_phone_number = ?;' +
				'UPDATE delivery_address ' +
				'SET is_default_address = ? ' + // then set the target record to specific value (can be 0 or 1)
				'WHERE registration_phone_number = ? ' +
				'AND address_number = ?';
			let params = [
				reqBody.registration_phone_number,
				reqBody.is_default_address,
				reqBody.registration_phone_number,
				reqBody.address_number
			];
			logger.debug('SQL = ', sql);
			logger.debug('Params = ', params);
			return connection.query(sql, params);
		}).then(function (result) {
			if (connection) {
				MySQL.pool.releaseConnection(connection);
				connection = null;
			}

			logger.debug('Result = ', result);
			let arr = JSON.parse(JSON.stringify(result)); // two statements
			if (arr[1].affectedRows === 1) {
				logger.debug('Record set (unset) default address success');
				isSuccess = true;
			} else {
				logger.debug('Record set (unset) default address failed');
				isSuccess = false;
			}
		}).catch(function (err) {
			if (connection) {
				MySQL.pool.releaseConnection(connection);
				connection = null;
			}
			throw err;
		});
		return isSuccess;
	}

	// private function definition
	static async _retrieveRecord(registration_phone_number, address_number) {
		let record = null;
		let connection = null;
		await MySQL.pool.getConnection().then(function (conn) {
			connection = conn;
			let sql = 'SELECT * ' +
				'FROM delivery_address ' +
				'WHERE registration_phone_number = ? ' +
				'AND address_number = ?';
			let params = [
				registration_phone_number,
				address_number
			];
			logger.debug('SQL = ', sql);
			logger.debug('Params = ', params);
			return connection.query(sql, params);
		}).then(function (result) {
			if (connection) {
				MySQL.pool.releaseConnection(connection);
				connection = null;
			}

			logger.debug('Result = ', result);
			let arr = JSON.parse(JSON.stringify(result));
			if (arr.length === 0) {
				logger.debug('Record is not found: {', registration_phone_number, ', ', address_number, '}');
				record = null;
			} else {
				logger.debug('Record is found: {', registration_phone_number, ', ', address_number, '}');
				record = arr[0];
			}
		}).catch(function (err) {
			if (connection) {
				MySQL.pool.releaseConnection(connection);
				connection = null;
			}
			throw err;
		});
		return record;
	}
}

module.exports = DeliveryAddress;
