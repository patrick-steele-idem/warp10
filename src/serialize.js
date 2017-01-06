'use strict';

const markerKey = Symbol('warp10');
const safePropName = /^[$A-Z_][0-9A-Z_$]*$/i;
const escapeEndingScriptTagRegExp = /<\//g;
const isArray = Array.isArray;

class Marker {
    constructor(path, symbol) {
        this.path = path;
        this.symbol = symbol;
    }
}

function handleProperty(clone, key, value, valuePath, serializationSymbol, assignments) {
    if (value.constructor === Date) {
        assignments.push(valuePath + '=new Date(' + value.getTime() + ')');
    } else if (isArray(value)) {
        const marker = value[markerKey];

        if (marker && marker.symbol === serializationSymbol) {
            assignments.push(valuePath + '=' + marker.path);
        } else {
            value[markerKey] = new Marker(valuePath, serializationSymbol);
            clone[key] = pruneArray(value, valuePath, serializationSymbol, assignments);
        }
    } else {
        const marker = value[markerKey];
        if (marker && marker.symbol === serializationSymbol) {
            assignments.push(valuePath + '=' + marker.path);
        } else {
            value[markerKey] = new Marker(valuePath, serializationSymbol);
            clone[key] = pruneObject(value, valuePath, serializationSymbol, assignments);
        }
    }
}

function pruneArray(array, path, serializationSymbol, assignments) {
    let len = array.length;

    var clone = new Array(len);

    for (let i=0; i<len; i++) {
        var value = array[i];
        if (value == null) {
            continue;
        }

        if (value && typeof value === 'object') {
            let valuePath = path + '[' + i + ']';
            handleProperty(clone, i, value, valuePath, serializationSymbol, assignments);
        } else {
            clone[i] = value;
        }
    }

    return clone;
}

function pruneObject(obj, path, serializationSymbol, assignments) {
    var clone = {};

    for (var key in obj) {
        var value = obj[key];
        if (value === undefined) {
            continue;
        }

        if (value && typeof value === 'object') {
            let valuePath = path + (safePropName.test(key) ? '.' + key : '[' + JSON.stringify(key) + ']');
            handleProperty(clone, key, value, valuePath, serializationSymbol, assignments);
        } else {
            clone[key] = value;
        }
    }

    return clone;
}

function serializeHelper(obj, safe, varName, additive) {
    /**
     * Performance notes:
     *
     * - It is faster to use native JSON.stringify instead of a custom stringify
     * - It is faster to first prune and then call JSON.stringify with _no_ replacer
     */
    var pruned;

    const assignments = []; // Used to keep track of code that needs to run to fix up the stringified object

    if (typeof obj === 'object') {
        const serializationSymbol = Symbol(); // Used to detect if the marker is associated with _this_ serialization
        const path = '$';

        obj[markerKey] = new Marker(path, serializationSymbol);

        if (obj.constructor === Date) {
            return '(new Date(' + obj.getTime() + '))';
        } else if (isArray(obj)) {
            pruned = pruneArray(obj, path, serializationSymbol, assignments);
        } else {
            pruned = pruneObject(obj, path, serializationSymbol, assignments);
        }
    } else {
        pruned = obj;
    }

    let json = JSON.stringify(pruned);
    if (safe) {
        json = json.replace(escapeEndingScriptTagRegExp, '\\u003C/');
    }

    if (varName) {
        if (additive) {
            let innerCode = 'var $=' + json + '\n';

            if (assignments.length) {
                innerCode += assignments.join('\n') + '\n';
            }

            let code = '(function() {var t=window.' + varName + '||(window.' + varName + '={})\n' + innerCode;

            for (let key in obj) {
                var prop;

                if (safePropName.test(key)) {
                    prop = '.' + key;
                } else {
                    prop = '[' + JSON.stringify(key) + ']';
                }
                code += 't' + prop + '=$' + prop + '\n';
            }

            return code + '}())';
        } else {
            if (assignments.length) {
                return '(function() {var $=' +
                    json + '\n' +
                    assignments.join('\n') +
                    '\nwindow.' + varName + '=$}())';
            } else {
                return 'window.' + varName + '=' + json;
            }
        }
    } else {
        if (assignments.length) {
            return '(function() {var $=' +
                json + '\n' +
                assignments.join('\n') +
                '\nreturn $}())';
        } else {
            return '(' + json + ')';
        }

    }
}

module.exports = function serialize(obj, options) {
    if (obj == null) {
        return 'null';
    }

    var safe;
    var varName;
    var additive;

    if (options) {
        safe = options.safe !== false;
        varName = options.var;
        additive = options.additive === true;
    } else {
        safe = true;
        additive = false;
    }

    return serializeHelper(obj, safe, varName, additive);
};