let logger = require('log4js').getLogger(__filename);
let MySQL = require('../../../dbaccessor/mysql');

class ShoppingCart {
	static async isRecordFound(registration_phone_number, serial_number) {
		let isFound = false;
		await ShoppingCart.retrieveRecord(registration_phone_number, serial_number).then(function (record) {
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
			let sql = 'INSERT INTO shopping_cart(registration_phone_number, serial_number, quantity) ' +
				'VALUES(?, ?, ?)';
			let params = [
				reqBody.registration_phone_number,
				reqBody.serial_number,
				reqBody.quantity
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

	static async deleteRecord(registration_phone_number, serial_number) {
		let isSuccess = false;
		let connection = null;
		await MySQL.pool.getConnection().then(function (conn) {
			connection = conn;
			let sql = 'DELETE FROM shopping_cart ' +
				'WHERE registration_phone_number = ? ' +
				'AND serial_number = ?';
			let params = [
				registration_phone_number,
				serial_number
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

	static async deleteRecords(registration_phone_number) {
		let isSuccess = false;
		let connection = null;
		await MySQL.pool.getConnection().then(function (conn) {
			connection = conn;
			let sql = 'DELETE FROM shopping_cart ' +
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
			let obj = JSON.parse(JSON.stringify(result));
			if (obj.affectedRows >= 1) {
				logger.debug('Records delete success');
				isSuccess = true;
			} else {
				logger.debug('Records delete failed');
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
			let sql = 'UPDATE shopping_cart ' +
				'SET quantity = ? ' +
				'WHERE registration_phone_number = ? ' +
				'AND serial_number = ?';
			let params = [
				reqBody.quantity,
				reqBody.registration_phone_number,
				reqBody.serial_number
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

	static async retrieveRecord(registration_phone_number, serial_number) {
		let record = null;
		let connection = null;
		await MySQL.pool.getConnection().then(function (conn) {
			connection = conn;
			let sql = 'SELECT * ' +
				'FROM shopping_cart ' +
				'WHERE registration_phone_number = ? ' +
				'AND serial_number = ?';
			let params = [
				registration_phone_number,
				serial_number
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
				logger.debug('Record is not found: {', registration_phone_number, ', ', serial_number, '}');
				record = null;
			} else {
				logger.debug('Record is found: {', registration_phone_number, ', ', serial_number, '}');
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

	static async retrieveRecords(registration_phone_number) {
		let records = [];
		let connection = null;
		await MySQL.pool.getConnection().then(function (conn) {
			connection = conn;
			let sql = 'SELECT * ' +
				'FROM shopping_cart a, commodity_details b ' +
				'WHERE registration_phone_number = ? ' +
				'AND a.serial_number = b.serial_number';
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

	static async transferRecords(registration_phone_number, order_number, address_number) {
		let isSuccess = false;
		let connection = null;
		await MySQL.pool.getConnection().then(function (conn) {
			connection = conn;
			let sql = 'INSERT INTO user_order(registration_phone_number, order_number, serial_number, quantity, address_number) ' +
				'SELECT registration_phone_number, ' + order_number + ', serial_number, quantity, ' + address_number + ' ' +
				'FROM shopping_cart ' +
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
			let obj = JSON.parse(JSON.stringify(result));
			if (obj.affectedRows >= 1) {
				logger.debug('Records transfer success');
				isSuccess = true;
			} else {
				logger.debug('Records transfer failed');
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
}

module.exports = ShoppingCart;
