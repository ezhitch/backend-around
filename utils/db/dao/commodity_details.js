let logger = require('log4js').getLogger(__filename);
let MySQL = require('../../../dbaccessor/mysql');

class CommodityDetails {
	static async retrieveRecord(serial_number) {
		let record = null;
		let connection = null;
		await MySQL.pool.getConnection().then(function (conn) {
			connection = conn;
			let sql = 'SELECT * ' +
				'FROM commodity_details ' +
				'WHERE serial_number = ?';
			let params = [serial_number];
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
				logger.debug('Record is not found: ', serial_number);
				record = null;
			} else {
				logger.debug('Record is found: ', serial_number);
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

	static async updateRecord(serial_number, quantity) {
		let isSuccess = false;
		let connection = null;
		await MySQL.pool.getConnection().then(function (conn) {
			connection = conn;
			let sql = 'UPDATE commodity_details ' +
				'SET inventory = inventory - ?, ' +
				'sales_volume = sales_volume + ? ' +
				'WHERE serial_number = ?';
			let params = [
				quantity,
				quantity,
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

	static async updateRecords(commodityList) {
		let isSuccess = true;
		for (let idx = 0; idx < commodityList.length; ++idx) {
			await CommodityDetails.updateRecord(commodityList[idx].serial_number,
				commodityList[idx].quantity).then(function (result) {
				if (!result) {
					return isSuccess = result;
				}
			}).catch(function (err) {
				throw err;
			});
		}
		return isSuccess;
	}

	static async checkInventory(commodityList) {
		for (let idx = 0; idx < commodityList.length; ++idx) {
			await CommodityDetails.retrieveRecord(commodityList[idx].serial_number).then(function (record) {
				if (record === null) {
					commodityList[idx].inventory = null;
					commodityList[idx].is_enough = false;
				} else {
					commodityList[idx].inventory = record.inventory;
					if (record.inventory < commodityList[idx].quantity) {
						logger.debug('Inventory is not enough: {db.inventory: ',
							record.inventory, ' < req.quantity: ', commodityList[idx].quantity);
						commodityList[idx].inventory = record.inventory;
						commodityList[idx].is_enough = false;
					} else {
						logger.debug('Inventory is enough: {db.inventory: ',
							record.inventory, ' >= req.quantity: ', commodityList[idx].quantity);
						commodityList[idx].is_enough = true;
					}
				}
			}).catch(function (err) {
				throw err;
			});
		}
		return commodityList;
	}
}

module.exports = CommodityDetails;
