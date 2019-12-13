let logger = require('log4js').getLogger(__filename);
let MySQL = require('./accessor/mysql');

class Ask {
	static async createRecord(reqBody) {
		let isSuccess = false;
		let connection = null;
		await MySQL.pool.getConnection().then(function (conn) {
			connection = conn;
			let sql = 'INSERT INTO user(registration_phone_number, password) ' +
				'VALUES(?, ?)';
			let params = [
				reqBody.registration_phone_number,
				//passwordHandler.encrypt(reqBody.password)
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

	static async retrieveCategory() {
		let record = null;
		let connection = null;
		await MySQL.pool.getConnection().then(function (conn) {
			connection = conn;
			let sql = 'SELECT * ' +
				'FROM category ' +
				'WHERE start_time <= now() ' +
                'AND end_time >= now()';
			//let params = [registration_phone_number];
			logger.debug('SQL = ', sql);
			//logger.debug('Params = ', params);
			return connection.query(sql);
		}).then(function (result) {
			if (connection) {
				MySQL.pool.releaseConnection(connection);
				connection = null;
			}

			logger.debug('Result = ', result);
			let arr = JSON.parse(JSON.stringify(result));
			if (arr.length === 0) {
				logger.debug('Record is not found: ');
				record = null;
			} else {
				logger.debug('Record is found: ');
				record = arr;
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

    static async retrieveItem(categoryId) {
        let record = null;
        let connection = null;
        await MySQL.pool.getConnection().then(function (conn) {
            connection = conn;
            let sql = 'SELECT * ' +
                'FROM item ' +
                'WHERE category_id = ? ' +
                'AND start_time <= now() ' +
                'AND end_time >= now()';
            let params = [categoryId];
            logger.debug('SQL = ', sql);
            logger.debug('Params = ', params);
            return connection.query(sql);
        }).then(function (result) {
            if (connection) {
                MySQL.pool.releaseConnection(connection);
                connection = null;
            }

            logger.debug('Result = ', result);
            let arr = JSON.parse(JSON.stringify(result));
            if (arr.length === 0) {
                logger.debug('Record is not found: ');
                record = null;
            } else {
                logger.debug('Record is found: ');
                record = arr;
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

    static async retrieveInfoDetail(itemId) {
        let record = null;
        let connection = null;
        await MySQL.pool.getConnection().then(function (conn) {
            connection = conn;
            let sql = 'SELECT * ' +
                'FROM info_detail ' +
                'WHERE item_id = ? ' +
                'AND start_time <= now() ' +
                'AND end_time >= now()';
            let params = [itemId];
            logger.debug('SQL = ', sql);
            logger.debug('Params = ', params);
            return connection.query(sql);
        }).then(function (result) {
            if (connection) {
                MySQL.pool.releaseConnection(connection);
                connection = null;
            }

            logger.debug('Result = ', result);
            let arr = JSON.parse(JSON.stringify(result));
            if (arr.length === 0) {
                logger.debug('Record is not found: ');
                record = null;
            } else {
                logger.debug('Record is found: ');
                record = arr;
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

	/*static async isLogin(registration_phone_number) {
		let isLogin = false;
		await User.retrieveRecord(registration_phone_number).then(function (record) {
			if (record === null) {
				isLogin = false;
			} else {
				if (record.is_login === 0) {
					logger.debug('User is logout');
					isLogin = false;
				} else {
					logger.debug('User is login');
					isLogin = true;
				}
			}
		}).catch(function (err) {
			throw err;
		});
		return isLogin;
	}

	static async isValid(registration_phone_number, user_password) {
		let isValid = false;
		await User.retrieveRecord(registration_phone_number).then(function (record) {
			if (record === null) {
				isValid = false;
			} else {
				// if (passwordHandler.decrypt(record.password) !== user_password) {
				// 	logger.debug('Invalid user password: ', user_password);
				// 	isValid = false;
				// } else {
				// 	logger.debug('User is valid');
				// 	isValid = true;
				// }
			}
		}).catch(function (err) {
			throw err;
		});
		return isValid;
	}

	static async enableLogin(registration_phone_number) {
		let isSuccess = false;
		// set is_login to 1 directly to support multiple devices login at the same time
		await User._updateLogin(registration_phone_number, 1).then(function (result) {
			if (result) {
				logger.debug('Enable login success');
			} else {
				logger.debug('Enable login failed');
			}
			isSuccess = result;
		}).catch(function (err) {
			throw err;
		});
		return isSuccess;
	}

	static async disableLogin(registration_phone_number) {
		let isSuccess = false;
		// set is_login to 0 directly to avoid logout failed in multiple devices case
		await User._updateLogin(registration_phone_number, 0).then(function (result) {
			if (result) {
				logger.debug('Disable login success');
			} else {
				logger.debug('Disable login failed');
			}
			isSuccess = result;
		}).catch(function (err) {
			throw err;
		});
		return isSuccess;
	}

	static async resetPassword(reqBody) {
		let isSuccess = false;
		let connection = null;
		await MySQL.pool.getConnection().then(function (conn) {
			connection = conn;
			let sql = 'UPDATE user ' +
				'SET password = ?, is_login = 0 ' + // it's MANDATORY to re-login after reset password, APP MUST to redirect user to login page
				'WHERE registration_phone_number = ?';
			let params = [
				//passwordHandler.encrypt(reqBody.password),
				reqBody.registration_phone_number
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
				logger.debug('Reset password success');
				isSuccess = true;
			} else {
				logger.debug('Reset password failed');
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
	static async _updateLogin(registration_phone_number, is_login) {
		let isSuccess = false;
		let connection = null;
		await MySQL.pool.getConnection().then(function (conn) {
			connection = conn;
			let sql = 'UPDATE user ' +
				'SET is_login = ? ' +
				'WHERE registration_phone_number = ?';
			let params = [
				is_login,
				registration_phone_number
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
			isSuccess = obj.affectedRows === 1;
		}).catch(function (err) {
			if (connection) {
				MySQL.pool.releaseConnection(connection);
				connection = null;
			}
			throw err;
		});
		return isSuccess;
	}*/
}

module.exports = Ask;
