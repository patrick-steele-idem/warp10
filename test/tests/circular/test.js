var expect = require('chai').expect;

module.exports = function(helpers) {
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

    var browserObj = helpers.browserVerify({
        mother: mother,
        father: father
    }, {var: 'family'});

    expect(browserObj.mother.name).to.equal('Jane');
    expect(browserObj.father.name).to.equal('Frank');

    expect(browserObj.mother.children).to.equal(browserObj.father.children);

    expect(browserObj.mother.children.length).to.equal(2);
    expect(browserObj.father.children.length).to.equal(2);
};