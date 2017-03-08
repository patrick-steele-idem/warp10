var expect = require('chai').expect;
module.exports = function(helpers) {

    var input = {
        foo: 'bar',
        toJSON: function() {
            return 'baz';
        }
    };

    var obj = helpers.warp10.stringifyPrepare(input);
    var json = JSON.stringify(obj);

    var clone = helpers.warp10.finalize(JSON.parse(json));
    expect(clone).to.equal('baz');
};