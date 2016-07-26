var expect = require('chai').expect;

module.exports = function(helpers) {
    var browserObj = helpers.browserVerify(true, {var: 'foo'});
    expect(browserObj).to.equal(true);
};