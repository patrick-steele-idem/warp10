var data = require('./data');
var refify = require('refify');

var json = refify.stringify(data);

module.exports = function(data, helpers) {
    return refify.parse(json);
};