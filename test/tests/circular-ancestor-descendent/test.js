exports.data = function() {
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

    return {
        grandParent: grandParent
    };
};
