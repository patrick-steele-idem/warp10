var warp10 = require('../../../');

var options = { safe: false };

module.exports = function(data, helpers) {
    return warp10.stringify(data, options);
};