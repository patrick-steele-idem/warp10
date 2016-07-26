'use strict';

const vm = require('vm');

module.exports = function(code) {
    var sandbox = {
    };

    sandbox.window = sandbox;

    var context = vm.createContext(sandbox);

    var script = new vm.Script(code, {
        filename: 'warp10',
        displayErrors: true
    });

    script.runInContext(context);

    return sandbox;
};