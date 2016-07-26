var expect = require('chai').expect;
var fs = require('fs');
var path = require('path');

module.exports = function(helpers) {
    var a = {
        foo: 'foo',
        bar: 'bar'
    };

    var codeA = helpers.warp10.serialize(a, { var: 'myStore', additive: true });

    var b = {
        baz: 'baz'
    };

    b.parent = b;

    var codeB = helpers.warp10.serialize(b, { var: 'myStore', additive: true});

    var code = codeA + ';\n' + codeB;

    fs.writeFileSync(path.join(__dirname, 'actual-code.js'), code, { encoding: 'utf8' });

    var window = helpers.browserLoad(code);

    expect(window.myStore.foo).to.equal('foo');
    expect(window.myStore.bar).to.equal('bar');
    expect(window.myStore.baz).to.equal('baz');
};