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

module.exports = {
    mother: mother,
    father: father
};