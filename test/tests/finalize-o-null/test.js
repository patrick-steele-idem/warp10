var expect = require('chai').expect;

module.exports = function(helpers) {
    var parsed = {
        "$$": []
    };

    var finalized = helpers.warp10.finalize(parsed);

    parsed = {
        o: null,
        "$$": []
    };

    finalized = helpers.warp10.finalize(parsed);
    expect(finalized).to.equal(null);
};
