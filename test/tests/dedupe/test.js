module.exports = function(helpers) {
    var frank = {
        name: 'Henry'
    };

    var mother = {
        name: 'Jane',
        child: frank
    };

    var father = {
        name: 'Frank',
        child: frank
    };

    helpers.browserVerify({
        mother: mother,
        father: father
    }, {var: 'family'});
};