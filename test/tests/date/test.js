module.exports = function(helpers) {
    helpers.browserVerify({
        birthday: new Date(1776, 6, 4),
        array: [new Date(2016, 6, 25)]
    });
};