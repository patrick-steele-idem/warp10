var expect = require('chai').expect;


module.exports = function(helpers) {
    var warp10 = require('../../../');
    expect(require('../../../finalize')).to.equal(warp10.finalize);
    expect(require('../../../parse')).to.equal(warp10.parse);
    expect(require('../../../serialize')).to.equal(warp10.serialize);
    expect(require('../../../stringify')).to.equal(warp10.stringify);
    expect(require('../../../finalize')).to.equal(warp10.finalize);
};