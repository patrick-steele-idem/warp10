var mother = {
    name: 'Jane',
    age: 30
}

var father = {
    name: 'Frank',
    age: 32
}

var child1 = {
    name: 'Sue',
    age: 5,
    mother: mother, // circular
    father: father // circular
};

var child2 = {
    name: 'Henry',
    age: 10,
    mother: mother, // circular
    father: father // circular
};

mother.children = [child1, child2];
father.children = [child1 /* duplicate */, child2 /* duplicate */];

module.exports = {
    mother: mother,
    father: father
};