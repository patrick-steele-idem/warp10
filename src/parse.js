var finalize = require('./finalize');

module.exports = function parse(json) {
    if (json === undefined) {
        return undefined;
    }

    var outer = JSON.parse(json);
    return finalize(outer);
};