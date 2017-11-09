'use strict';
const stringifyPrepare = require('./stringifyPrepare');

var safeJSONRegExp = /<\/|\u2028|\u2029/g;


function safeJSONReplacer(match) {
    if (match === '<\/') {
        return '\\u003C/';
    } else {
        return '\\u' + match.charCodeAt(0).toString(16);
    }
}

function safeJSON(json) {
    return json.replace(safeJSONRegExp, safeJSONReplacer);
}

module.exports = function stringify(obj, options) {
    return stringifyPrepare(obj)
        .then(function(final) {
            let json = JSON.stringify(final);
            if (!options || options.safe === true) {
                json = safeJSON(json);
            }
            return json;
        });
};
