var data = require('./data');
var warp10 = require('../../../');

var options = { safe: false };

var json = warp10.stringify(data, options);

module.exports = function(data, helpers) {
    return warp10.parse(json);
};