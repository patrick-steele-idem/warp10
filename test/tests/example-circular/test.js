module.exports = function(helpers) {
    var parent = {
        name: 'parent'
    };

    var child = {
        parent: parent
    };

    parent.child = child;

    helpers.browserVerify(parent);
};