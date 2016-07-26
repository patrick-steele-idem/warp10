var expect = require('chai').expect;
var fs = require('fs');
var path = require('path');

module.exports = function(helpers) {
    var a = {
        'w-0': 'foo',
        'w-1': 'bar'
    };

    var codeA = helpers.warp10.serialize(a, { var: 'myStore', additive: true });

    var b = {
        'w-2': 'baz'
    };

    var codeB = helpers.warp10.serialize(b, { var: 'myStore', additive: true });

    var code = codeA + ';\n' + codeB;

    fs.writeFileSync(path.join(__dirname, 'actual-code.js'), code, { encoding: 'utf8' });

    var window = helpers.browserLoad(code);

    expect(window.myStore['w-0']).to.equal('foo');
    expect(window.myStore['w-1']).to.equal('bar');
    expect(window.myStore['w-2']).to.equal('baz');
};