var expect = require('chai').expect;

module.exports = function(helpers) {
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

    var browserObj = helpers.browserVerify({
        mother: mother,
        father: father
    }, {var: 'family'});

    expect(browserObj.mother.children[0]).to.equal(browserObj.father.children[0]);
    expect(browserObj.mother.children[1]).to.equal(browserObj.father.children[1]);
};