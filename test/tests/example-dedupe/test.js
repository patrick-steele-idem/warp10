exports.data = function() {
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

    return {
        mother: mother,
        father: father
    };
};
