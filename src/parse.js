var finalize = require('./finalize');

module.exports = function parse(json) {
    var outer = JSON.parse(json);
    return finalize(outer);
};