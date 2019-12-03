let logger = require('log4js').getLogger(__filename);
let MySQL = require('../../../dbaccessor/mysql');

class UserOrder {
	static async isOrderFound(registration_phone_number, order_number) {
		let isFound = false;
		await UserOrder.retrieveOrder(registration_phone_number, order_number).then(function (order) {
			isFound = order !== null;
		}).catch(function (err) {
			throw err;
		});
		return isFound;
	}

	static async retrieveOrder(registration_phone_number, order_number) {
		let order = null;
		let connection = null;
		await MySQL.pool.getConnection().then(function (conn) {
			connection = conn;
			let sql = 'SELECT DISTINCT order_number ' +
				'FROM user_order ' +
				'WHERE registration_phone_number = ? ' +
				'AND order_number = ?';
			let params = [
				registration_phone_number,
				order_number
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
				logger.debug('Order is not found: {', registration_phone_number, ', ', order_number, '}');
				order = null;
			} else {
				logger.debug('Order is found: {', registration_phone_number, ', ', order_number, '}');
				order = arr[0];
			}
		}).catch(function (err) {
			if (connection) {
				MySQL.pool.releaseConnection(connection);
				connection = null;
			}
			throw err;
		});
		return order;
	}

	static async retrieveOrders(registration_phone_number) {
		let orders = [];
		let connection = null;
		await MySQL.pool.getConnection().then(function (conn) {
			connection = conn;
			let sql = 'SELECT * ' +
				'FROM user_order ' +
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
			orders = JSON.parse(JSON.stringify(result));
			logger.debug('Orders retrieve success');
		}).catch(function (err) {
			if (connection) {
				MySQL.pool.releaseConnection(connection);
				connection = null;
			}
			throw err;
		});
		return orders;
	}

	static async deleteOrders(registration_phone_number, order_number) {
		let isSuccess = false;
		let connection = null;
		await MySQL.pool.getConnection().then(function (conn) {
			connection = conn;
			let sql = 'DELETE FROM user_order ' +
				'WHERE registration_phone_number = ? ' +
				'AND order_number = ?';
			let params = [
				registration_phone_number,
				order_number
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
}

module.exports = UserOrder;
