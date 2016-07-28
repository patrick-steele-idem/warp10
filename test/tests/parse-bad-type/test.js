var expect = require('chai').expect;
module.exports = function(helpers) {
    var json = '{"object":null,"assignments":[{"l":[],"r":{"type":"Bad","value":1469512800000}}]}';
    var parse = require('../../../parse');

    expect(function() {
        parse(json);
    }).to.throw(/Bad type/);
};