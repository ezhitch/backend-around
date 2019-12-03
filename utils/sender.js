class Sender {
	// user register & login: [100001, 100040]
	sendUnknownRegistrationPhoneNumber(res) {
		res.end(JSON.stringify({
			status: '100001',
			message: 'Unknown Registration Phone Number'
		}));
	}

	sendGenerateAuthcodeSuccess(res, authcode) {
		res.end(JSON.stringify({
			status: '100002',
			message: 'Generate Authcode Success',
			authcode: authcode
		}));
	}

	sendAuthcodeIsNotFound(res) {
		res.end(JSON.stringify({
			status: '100004',
			message: 'Authcode Is Not Found'
		}));
	}

	sendInvalidAuthcode(res) {
		res.end(JSON.stringify({
			status: '100005',
			message: 'Invalid Authcode'
		}));
	}

	sendUserHasRegistered(res) {
		res.end(JSON.stringify({
			status: '100007',
			message: 'User Has Registered'
		}));
	}

	sendUserRegisterSuccess(res) {
		res.end(JSON.stringify({
			status: '100008',
			message: 'User Register Success'
		}));
	}

	sendUserRegisterFailed(res) {
		res.end(JSON.stringify({
			status: '100009',
			message: 'User Register Failed'
		}));
	}

	sendUserLoginSuccess(res) {
		res.end(JSON.stringify({
			status: '100012',
			message: 'User Login Success'
		}));
	}

	sendUserLoginFailed(res) {
		res.end(JSON.stringify({
			status: '100013',
			message: 'User Login Failed'
		}));
	}

	sendUserHasLogout(res) {
		res.end(JSON.stringify({
			status: '100014',
			message: 'User Has Logout'
		}));
	}

	sendUserLogoutSuccess(res) {
		res.end(JSON.stringify({
			status: '100015',
			message: 'User Logout Success'
		}));
	}

	sendUserLogoutFailed(res) {
		res.end(JSON.stringify({
			status: '100016',
			message: 'User Logout Failed'
		}));
	}

	sendUserResetPasswordSuccess(res) {
		res.end(JSON.stringify({
			status: '100017',
			message: 'User Reset Password Success'
		}));
	}

	sendUserResetPasswordFailed(res) {
		res.end(JSON.stringify({
			status: '100018',
			message: 'User Reset Password Failed'
		}));
	}


	// token generation: [100041, 100050]
	sendInvalidToken(res) {
		res.end(JSON.stringify({
			status: '100042',
			message: 'Invalid Token'
		}));
	}


	// delivery address
	sendDeliveryAddressRecordIsFound(res) {
		res.end(JSON.stringify({
			status: '100051',
			message: 'Delivery Address Record Is Found'
		}));
	}

	sendDeliveryAddressRecordIsNotFound(res) {
		res.end(JSON.stringify({
			status: '100052',
			message: 'Delivery Address Record Is Not Found'
		}));
	}

	sendDeliveryAddressRecordInsertSuccess(res) {
		res.end(JSON.stringify({
			status: '100053',
			message: 'Delivery Address Record Insert Success'
		}));
	}

	sendDeliveryAddressRecordInsertFailed(res) {
		res.end(JSON.stringify({
			status: '100054',
			message: 'Delivery Address Record Insert Failed'
		}));
	}

	sendDeliveryAddressRecordDeleteSuccess(res) {
		res.end(JSON.stringify({
			status: '100055',
			message: 'Delivery Address Record Delete Success'
		}));
	}

	sendDeliveryAddressRecordDeleteFailed(res) {
		res.end(JSON.stringify({
			status: '100056',
			message: 'Delivery Address Record Delete Failed'
		}));
	}

	sendDeliveryAddressRecordUpdateSuccess(res) {
		res.end(JSON.stringify({
			status: '100057',
			message: 'Delivery Address Record Update Success'
		}));
	}

	sendDeliveryAddressRecordUpdateFailed(res) {
		res.end(JSON.stringify({
			status: '100058',
			message: 'Delivery Address Record Update Failed'
		}));
	}

	sendDeliveryAddressRecordsRetrieveSuccess(res, arr) {
		res.end(JSON.stringify({
			status: '100059',
			message: 'Delivery Address Records Retrieve Success',
			records: arr
		}));
	}

	sendDeliveryAddressRecordsRetrieveFailed(res) {
		res.end(JSON.stringify({
			status: '100060',
			message: 'Delivery Address Records Retrieve Failed'
		}));
	}

	sendDeliveryAddressRecordSetDefaultAddressSuccess(res) {
		res.end(JSON.stringify({
			status: '100061',
			message: 'Delivery Address Record Set Default Address Success'
		}));
	}

	sendDeliveryAddressRecordSetDefaultAddressFailed(res) {
		res.end(JSON.stringify({
			status: '100062',
			message: 'Delivery Address Record Set Default Address Failed'
		}));
	}


	// commodity details
	sendCommodityDetailsRecord(res, record) {
		res.end(JSON.stringify({
			status: '100071',
			message: 'Commodity Details Record',
			record: record
		}));
	}

	sendCommodityDetailsRecordIsNotFound(res) {
		res.end(JSON.stringify({
			status: '100072',
			message: 'Commodity Details Record Is Not Found'
		}));
	}


	// shopping cart
	sendShoppingCartRecordIsFound(res, quantity) {
		res.end(JSON.stringify({
			status: '100091',
			message: 'Shopping Cart Record Is Found',
			quantity: quantity
		}));
	}

	sendShoppingCartRecordIsNotFound(res) {
		res.end(JSON.stringify({
			status: '100092',
			message: 'Shopping Cart Record Is Not Found'
		}));
	}

	sendShoppingCartRecordInsertSuccess(res) {
		res.end(JSON.stringify({
			status: '100063',
			message: 'Shopping Cart Record Insert Success'
		}));
	}

	sendShoppingCartRecordInsertFailed(res) {
		res.end(JSON.stringify({
			status: '100064',
			message: 'Shopping Cart Record Insert Failed'
		}));
	}

	sendShoppingCartRecordDeleteSuccess(res) {
		res.end(JSON.stringify({
			status: '100065',
			message: 'Shopping Cart Record Delete Success'
		}));
	}

	sendShoppingCartRecordDeleteFailed(res) {
		res.end(JSON.stringify({
			status: '100066',
			message: 'Shopping Cart Record Delete Failed'
		}));
	}

	sendShoppingCartRecordUpdateSuccess(res) {
		res.end(JSON.stringify({
			status: '100067',
			message: 'Shopping Cart Record Update Success'
		}));
	}

	sendShoppingCartRecordUpdateFailed(res) {
		res.end(JSON.stringify({
			status: '100068',
			message: 'Shopping Cart Record Update Failed'
		}));
	}

	sendShoppingCartRecordsRetrieveSuccess(res, arr) {
		res.end(JSON.stringify({
			status: '100069',
			message: 'Shopping Cart Records Retrieve Success',
			records: arr
		}));
	}

	sendShoppingCartRecordsRetrieveFailed(res) {
		res.end(JSON.stringify({
			status: '100070',
			message: 'Shopping Cart Records Retrieve Failed'
		}));
	}


	// user order
	sendInventoryIsNotEnough(res, list) {
		res.end(JSON.stringify({
			status: '100201',
			message: 'Inventory Is Not Enough',
			list: list
		}));
	}

	sendWXPayProfile(res, profile) {
		res.end(JSON.stringify({
			status: '100202',
			message: 'WXPay Profile',
			profile: profile
		}));
	}

	sendWXPayFailed(res) {
		res.end(JSON.stringify({
			status: '100203',
			message: 'WXPay Failed'
		}));
	}

	sendUpdateCommodityDetailsFailed(res) {
		res.end(JSON.stringify({
			status: '100204',
			message: 'Update Commodity Details Failed'
		}));
	}

	sendTransferRecordsFailed(res) {
		res.end(JSON.stringify({
			status: '100205',
			message: 'Transfer Records Failed'
		}));
	}

	sendShoppingCartDeleteRecordsFailed(res) {
		res.end(JSON.stringify({
			status: '100206',
			message: 'Shopping Cart Delete Records Failed'
		}));
	}

	sendUserOrderOrdersRetrieveSuccess(res, arr) {
		res.end(JSON.stringify({
			status: '100207',
			message: 'User Order Orders Retrieve Success',
			orders: arr
		}));
	}

	sendUserOrderOrderDeleteSuccess(res) {
		res.end(JSON.stringify({
			status: '100208',
			message: 'User Order Order Delete Success'
		}));
	}

	sendUserOrderOrderDeleteFalied(res) {
		res.end(JSON.stringify({
			status: '100209',
			message: 'User Order Order Delete Failed'
		}));
	}


	// http error
	sendBadRequest(res) {
        res.status(400).end('Bad Request');
	}

	sendNotFound(res) {
		res.status(404).end('Not Found');
	}

	sendInternalServerError(res) {
		res.status(500).end('Internal Server Error');
	}
}

module.exports = Sender;
