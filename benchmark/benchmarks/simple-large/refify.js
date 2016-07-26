
var refify = require('refify');

module.exports = function(data, helpers) {
    return refify.stringify(data);
};