var expect = require('chai').expect;

module.exports = function(helpers) {
    var browserObj = helpers.browserVerify(true);
    expect(browserObj).to.equal(true);

    browserObj = helpers.browserVerify(1);
    expect(browserObj).to.equal(1);
};