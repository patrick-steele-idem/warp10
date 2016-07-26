var expect = require('chai').expect;
var fs = require('fs');
var path = require('path');

module.exports = function(helpers) {
    var duplicate = {
        'name': 'duplicate'
    };

    var a = {
        duplicateA: duplicate
    };

    var codeA = helpers.warp10.serialize(a, { var: 'myStore', additive: true });

    var b = {
        duplicateB: duplicate
    };

    var codeB = helpers.warp10.serialize(b, { var: 'myStore', additive: true });

    var code = codeA + ';\n' + codeB;

    fs.writeFileSync(path.join(__dirname, 'actual-code.js'), code, { encoding: 'utf8' });

    var window = helpers.browserLoad(code);

    expect(window.myStore.duplicateA.name).to.equal('duplicate');
    expect(window.myStore.duplicateB.name).to.equal('duplicate');
};