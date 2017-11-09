let expect = require('chai').expect;

exports.data = function() {
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

    return {
        mother: mother,
        father: father
    };
};


exports.verify = function(deserialized) {
    expect(deserialized.mother.child).to.equal(deserialized.father.child);
};
