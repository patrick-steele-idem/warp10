var expect = require('chai').expect;
module.exports = function(helpers) {
    var frank = {
        evil: '<script>alert("Hello World")</script>'
    };

    var json = helpers.warp10.stringify(frank, { safe: true });
    expect(json).to.not.contain('</script>');

    json = helpers.warp10.stringify(frank, { safe: false });
    expect(json).to.contain('</script>');
};