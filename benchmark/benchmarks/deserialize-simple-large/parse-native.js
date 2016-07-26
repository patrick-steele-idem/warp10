var data = require('./data');
var json = JSON.stringify(data);

module.exports = function(data, helpers) {
    return JSON.parse(json);
};