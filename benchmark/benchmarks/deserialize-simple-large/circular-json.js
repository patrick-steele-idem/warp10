var data = require('./data');
var CircularJSON = require('circular-json');

var json = CircularJSON.stringify(data);

module.exports = function(data, helpers) {
    return CircularJSON.parse(json);
};