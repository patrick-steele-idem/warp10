module.exports = function(helpers) {
    var grandParent = {
        name: 'grand parent'
    };


    var parent = {
        name: 'parent'
    };

    var child = {
        grandParent: grandParent
    };

    grandParent.child = parent;
    parent.child = child;

    helpers.browserVerify({
        grandParent: grandParent
    }, 'family');
};