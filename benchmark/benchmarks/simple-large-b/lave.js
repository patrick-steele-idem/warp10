var generate = require('escodegen').generate;
var lave = require('lave');

var options = {generate};

module.exports = function(data, helpers) {
    return lave(data, options);
};