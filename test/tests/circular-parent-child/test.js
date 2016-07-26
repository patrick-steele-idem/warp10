var expect = require('chai').expect;

module.exports = function(helpers) {
    var parent = {
        name: 'parent'
    };

    var child = {
        parent: parent
    };

    parent.child = child;

    var obj = {
        parent: parent
    };

    helpers.browserVerify(obj);
    helpers.browserVerify(obj);
};