var expect = require('chai').expect;

module.exports = function (helpers) {
    var input = Object.create(null);
    input.foo = 'bar';

    var obj = helpers.warp10.stringifyPrepare(input);
    var json = JSON.stringify(obj);

    var clone = helpers.warp10.finalize(JSON.parse(json));
    expect(clone).to.deep.equal({
        foo: 'bar'
    });
};
