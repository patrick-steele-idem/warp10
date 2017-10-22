var expect = require('chai').expect;
var fs = require('fs');
var path = require('path');

module.exports = function(helpers) {
    var objWithSpecialChar = {
        'foo-0': 'bar\u2028',
        'foo-1': 'bar\u2029',
        'foo-2': '\u2028bar\u2029'
    };

    var code = helpers.warp10.serialize(objWithSpecialChar, { var: 'obj' });

    fs.writeFileSync(path.join(__dirname, 'actual-code.js'), code, { encoding: 'utf8' });

    var window = helpers.browserLoad(code);

    expect(window.obj['foo-0']).to.equal('bar\u2028');
    expect(window.obj['foo-1']).to.equal('bar\u2029');
    expect(window.obj['foo-2']).to.equal('\u2028bar\u2029');
};
