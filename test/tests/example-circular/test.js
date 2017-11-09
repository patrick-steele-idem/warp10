exports.data = function() {
    var parent = {
        name: 'parent'
    };

    var child = {
        parent: parent
    };

    parent.child = child;

    return parent;
};
