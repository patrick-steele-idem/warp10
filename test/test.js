'use strict';
const path = require('path');
const fs = require('fs');
require('chai').config.includeStack = true;
const expect = require('chai').expect;
const assert = require('assert');
const safeStringify = require('./util/safeStringify');

const { stringifyPrepare, finalize, stringify } = require('../');
var updateExpectations = process.env.hasOwnProperty('UPDATE_EXPECTATIONS');

class Helpers {
    constructor(dir) {
        this.dir = dir;
    }

    compare(actual, prefix, suffix) {
        let dir = this.dir;
        var actualPath = path.join(dir, prefix + 'actual' + suffix);
        var expectedPath = path.join(dir, prefix + 'expected' + suffix);

        var isObject = typeof actual === 'string' ? false : true;
        var actualString = isObject ? JSON.stringify(actual, null, 4) : actual;
        fs.writeFileSync(actualPath, actualString, { encoding: 'utf8' });

        var expectedString;

        try {
            expectedString = fs.readFileSync(expectedPath, { encoding: 'utf8' });
        } catch(e) {
            expectedString = isObject ? '"TBD"' : 'TBD';
            fs.writeFileSync(expectedPath, expectedString, {encoding: 'utf8'});
        }

        actual = isObject ? JSON.parse(actualString) : actualString.replace(/\r?\n$/, '');

        var expected = isObject ? JSON.parse(expectedString) : expectedString.replace(/\r?\n$/, '');

        try {
            assert.deepEqual(actual, expected);
        } catch(e) {
            if (updateExpectations) {
                fs.writeFileSync(expectedPath, actualString, { encoding: 'utf8' });
            } else {
                throw e;
            }
        }
    }
}

describe('warp10', function() {
    require('./util/autotest').scanDir(
        path.join(__dirname, 'tests'),
        function(info) {
            let test = require(path.join(info.dir, 'test.js'));
            let data = test.data;
            if (typeof data === 'function') {
                data = data();
            }

            var helpers = new Helpers(info.dir);
            return stringifyPrepare(data)
                .then(function(dataSafe) {
                    helpers.compare(dataSafe, '', '.json');

                    let finalized = finalize(dataSafe);
                    var finalized2 = finalize(finalized);

                    expect(finalized).to.deep.equal(finalized2);

                    helpers.compare(safeStringify(finalized), '', '-finalized.js');

                    if (test.verify) {
                        test.verify(finalized);
                    }

                    return stringify(data);
                })
                .then(function(jsonSafe) {
                    helpers.compare(jsonSafe, '', '-stringify.json');
                });
        }
    );
});
