'use strict';
var path = require('path');
var fs = require('fs');
require('chai').config.includeStack = true;
var beautify = require('js-beautify').js_beautify;
var assert = require('assert');
var browserLoad = require('./util/browser-load');
var safeStringify = require('./util/safeStringify');

class Helpers {
    constructor(dir) {
        this.dir = dir;
    }

    get warp10() {
        return require('../');
    }

    prettyPrint(code) {
        return beautify(code, {
            indent_size: 2
        });
    }

    compare(actual, suffix) {
        var dir = this.dir;

        if (suffix.charAt(0) !== '-') {
            suffix = '-' + suffix;
        }

        var actualPath = path.join(dir, 'actual' + suffix);
        var expectedPath = path.join(dir, 'expected' + suffix);

        var isObject = typeof actual === 'string' ? false : true;
        var actualString = isObject ? JSON.stringify(actual, null, 4) : actual;
        fs.writeFileSync(actualPath, actualString, {
            encoding: 'utf8'
        });

        var expectedString;

        try {
            expectedString = fs.readFileSync(expectedPath, {
                encoding: 'utf8'
            });
        } catch (e) {
            expectedString = isObject ? '"TBD"' : 'TBD';
            fs.writeFileSync(expectedPath, expectedString, {
                encoding: 'utf8'
            });
        }

        var expected = isObject ? JSON.parse(expectedString) : expectedString;
        assert.deepEqual(actual, expected);
    }

    browserLoad(code) {
        var window = browserLoad(code);
        return window;
    }

    browserVerify(obj, options) {

        var varName = options ? options.var : undefined;

        var suffix = varName ? '-generated-' + varName + '.js' : '-generated.js';

        var expectedFile = path.join(this.dir, 'expected' + suffix);

        var expected = safeStringify(obj);
        fs.writeFileSync(expectedFile, expected, {
            encoding: 'utf8'
        });

        var deserializationCode = this.warp10.serialize(obj, options);
        deserializationCode = this.prettyPrint(deserializationCode);

        var codeFile = path.join(this.dir, 'actual-code' + suffix);
        //    var storeSerializedFile = path.join(this.dir, 'store_' + varName + '.js');

        fs.writeFileSync(codeFile, deserializationCode, {
            encoding: 'utf8'
        });

        var browserObj;

        if (varName) {
            var window = browserLoad(deserializationCode);
            browserObj = window[varName];
        } else {
            browserObj = eval(deserializationCode);
        }

        var actual = safeStringify(browserObj);
        this.compare(actual, suffix);
        //    fs.writeFileSync(storeSerializedFile, actual, { encoding: 'utf8' });

        return browserObj;
    }
}

describe('lasso-babel-transform', function() {
    require('./util/autotest').scanDir(
        path.join(__dirname, 'tests'),
        function(info, done) {
            var testFile = path.join(info.dir, 'test.js');
            if (fs.existsSync(testFile)) {
                var testFunc = require(testFile);
                var helpers = new Helpers(info.dir);

                testFunc(helpers);
                done();
            }
        }
    );
});