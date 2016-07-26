var json3 = require('../../third-party/json3');

module.exports = function(data, helpers) {
    return json3.stringify(data);
};