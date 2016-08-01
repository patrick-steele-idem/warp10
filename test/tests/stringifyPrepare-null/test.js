var expect = require('chai').expect;
module.exports = function(helpers) {
    var obj = helpers.warp10.stringifyPrepare(null);
    var json = JSON.stringify(obj);

    var clone = helpers.warp10.finalize(JSON.parse(json));
    expect(clone).to.equal(null);
};