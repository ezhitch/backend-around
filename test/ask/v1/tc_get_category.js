"use strict";
exports.__esModule = true;
let request = require("request-promise-native");

request({
    uri: 'http://localhost/ask/v1/get_category',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
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
