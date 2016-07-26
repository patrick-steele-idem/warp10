
var CircularJSON = require('circular-json');

module.exports = function(data, helpers) {
    return CircularJSON.stringify(data);
};