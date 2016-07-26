module.exports = function(helpers) {
    var child = {
        name: 'Henry'
    };

    var mother = {
        name: 'Jane',
        child: child
    };

    var father = {
        name: 'Frank',
        child: child
    };

    helpers.browserVerify({
        mother: mother,
        father: father
    });
};