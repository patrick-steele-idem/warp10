module.exports = function(helpers) {
    helpers.browserVerify(['a', null, undefined, { hello: 'world' }]);
};