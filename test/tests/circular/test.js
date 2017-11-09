var expect = require('chai').expect;

exports.data = function() {
    var mother = {
        name: 'Jane',
        age: 30
    };

    var father = {
        name: 'Frank',
        age: 32
    };

    var child1 = {
        name: 'Sue',
        age: 5,
        mother: mother,
        father: father
    };

    var child2 = {
        name: 'Henry',
        age: 10,
        mother: mother,
        father: father
    };

    var children = [child1, child2];

    mother.children = children;
    father.children = children;

    return {
        mother: mother,
        father: father
    };
};

exports.verify = function(deserialized) {
    expect(deserialized.mother.name).to.equal('Jane');
    expect(deserialized.father.name).to.equal('Frank');

    expect(deserialized.mother.children).to.equal(deserialized.father.children);

    expect(deserialized.mother.children.length).to.equal(2);
    expect(deserialized.father.children.length).to.equal(2);
};
