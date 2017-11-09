'use strict';

var fs = require('fs');
var enabledTest = process.env.TEST;
var path = require('path');

exports.scanDir = function(autoTestDir, run, options) {
    describe('autotest', function() {
        fs.readdirSync(autoTestDir)
            .forEach(function(name) {
                if (name.charAt(0) === '.') {
                    return;
                }

                var itFunc = it;

                if (enabledTest && name === enabledTest) {
                    itFunc = it.only;
                }

                var dir = path.join(autoTestDir, name);

                itFunc(`[${name}] `, function() {
                    return run({
                        dir: dir
                    });
                });
            });
    });
};
