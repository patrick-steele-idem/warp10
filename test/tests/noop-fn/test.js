const NOOP = require("../../../constants").NOOP;
module.exports = function(helpers) {
    helpers.browserVerify({
        fn: NOOP
    });
};