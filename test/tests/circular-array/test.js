module.exports = function(helpers) {
    var parent = [];
    parent[0] = parent;

    helpers.browserVerify({
        parent: parent
    }, {var: 'family'});
};