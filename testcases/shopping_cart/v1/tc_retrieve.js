"use strict";
exports.__esModule = true;
let request = require("request-promise-native");

request({
    uri: 'http://localhost:443/shopping_cart/v1/retrieve?registration_phone_number=13800138000',
    method: 'GET',
    headers: {
	    'Accept': 'application/json',
	    'uuid': '1E2DFA89-496A-47FD-9941-DF1FC4E6484A',
	    'token': 'ff5f512636ae01cc67b3265acd29a8fe9fa863bb86a69f9f8a70e74f228b98aabd0b26068c5d58df1880c8bbac3bab941910ee01b4476cb5b7e206695b880b536082ae14f63fe7fd70ae536c5f18dbbdd4952fd461bfce6772bd92443950e219cff0127a9587ffb0bd8c53e155dc40da766515cb46997058cc7636b21d4d1118ca9cfa8150b1e4b60bec624b71d9ebca62458e660cd678dd8c02cb3e778a8af38827d6fd19798b1c688bb150129062a6b558777b9638c17657f68b0429f019c45aba6762640a09ce4d82867bbc363105f959a1019fbabd321fd1b41e391f0c18'
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
