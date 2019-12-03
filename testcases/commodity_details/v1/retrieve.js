"use strict";
exports.__esModule = true;
let request = require('request-promise-native');

request({
	uri: 'http://localhost:443/commodity_details/v1/retrieve?serial_number=5243d720-4863-11e8-a6c9-2f79185b3ec0',
	method: 'GET',
	headers: {
		'Accept': 'application/json',
		'uuid': '1E2DFA89-496A-47FD-9941-DF1FC4E6484A'
	},
	json: true,
	resolveWithFullResponse: true
}).then(function (response) {
	console.log('##########Received Response##########');
	console.log('HEADERS BEGIN: ');
	console.log(response.headers);
	console.log('\n');
	console.log('BODY BEGIN: ');
	console.log(response.body);
})["catch"](function (error) {
	console.log('Error: ' + error.toString());
});
