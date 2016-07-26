var expect = require('chai').expect;
module.exports = function(helpers) {
    var frank = {
        evil: '<script>alert("Hello World")</script>'
    };

    var deserializationCode = helpers.warp10.serialize(frank);
    expect(deserializationCode).to.not.contain('</script>');

    deserializationCode = helpers.warp10.serialize(frank, { safe: false });
    expect(deserializationCode).to.contain('</script>');
};