var parent = {
    name: 'parent'
};

var child = {
    parent: parent
};

parent.child = child;

module.exports = parent;