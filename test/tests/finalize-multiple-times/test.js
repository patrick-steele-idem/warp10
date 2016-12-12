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

    var family = {
        mother: mother,
        father: father
    };

    var stringified = helpers.warp10.stringify(family);

    var parsed = JSON.parse(stringified);

    var finalized1 = helpers.warp10.finalize(parsed);
    var finalized2 = helpers.warp10.finalize(parsed);

    expect(finalized1).to.deep.equal(finalized2);
};