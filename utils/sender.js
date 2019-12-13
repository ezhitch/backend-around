class Sender {
	sendDeliveryAddressRecordUpdateFailed(res) {
		res.end(JSON.stringify({
			status: '100058',
			message: 'Delivery Address Record Update Failed'
		}));
	}

    sendCategory(res, record) {
        res.end(JSON.stringify({
            status: '100000',
            message: 'Category Record',
            record: record
        }));
    }

    sendItem(res, record) {
        res.end(JSON.stringify({
            status: '100001',
            message: 'Item Record',
            record: record
        }));
    }

    sendInfoDetail(res, record) {
        res.end(JSON.stringify({
            status: '100002',
            message: 'Info Detail Record',
            record: record
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
