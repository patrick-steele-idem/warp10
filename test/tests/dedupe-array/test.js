var expect = require('chai').expect;

exports.data = function() {
    var mother = {
        name: 'Jane'
    };

    var father = {
        name: 'Frank'
    };

    var child1 = {
        name: 'Sue'
    };

    var child2 = {
        name: 'Henry'
    };

    mother.children = [child1, child2];
    father.children = [child1, child2];

    return {
        mother: mother,
        father: father
    };
};

exports.verify = function(deserialized) {
    expect(deserialized.mother.children[0]).to.equal(deserialized.father.children[0]);
    expect(deserialized.mother.children[1]).to.equal(deserialized.father.children[1]);
};
