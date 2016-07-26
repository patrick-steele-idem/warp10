var data = require('./data');
var warp10 = require('../../../');

var options = { safe: false };

var deserializationCode = warp10.serialize(data, options);

module.exports = function(data, helpers) {
    return eval(deserializationCode);
};