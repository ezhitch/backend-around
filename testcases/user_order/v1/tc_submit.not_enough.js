"use strict";
exports.__esModule = true;
let request = require("request-promise-native");

request({
    uri: 'http://localhost:443/user_order/v1/submit',
    method: 'POST',
    headers: {
	    'Accept': 'application/json',
	    'Content-Type': 'application/json',
	    'uuid': '1E2DFA89-496A-47FD-9941-DF1FC4E6484A',
	    'token': 'ff5f512636ae01cc67b3265acd29a8fe9fa863bb86a69f9f8a70e74f228b98aa00aa46b21dc71b3b0383d0b63b2bcd4ff277ff6694eee649f359d37063bc9f59a46587c5823d76b5b9bb254b48ab1f6a10a38ba3d322a0b787de65b7eba90de470c0082b5a4a0ddad6a92c4a68be2ebc87d4073748d04cde7461cb78a8cb57f3c288707d174e9d7113fbfcad1e666a8f9027385e65bdf0a4cd0428e1f6611bc2b73aca2037d270c373037d2c512e35a3534a2250e9edf59efafbe0f34441ab2d'
    },
    body: {
        registration_phone_number: '13800138000',
	    address_number: 1,
        list: [
	        {
		        serial_number: '5243d720-4863-11e8-a6c9-2f79185b3ec0',
		        quantity: 1
	        },
	        {
		        serial_number: '5243d720-4863-11e8-a6c9-2f79185b3ec1',
		        quantity: 500
	        }
        ]
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
