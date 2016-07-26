'use strict';

var COMMA = ',';
var NULL = 'null';

function stringify(o) {
    var buffer = '';

    var symbol = Symbol('warp10_test');


    function append(str) {
        buffer += str;
    }

    var nextId = 0;

    function assignId(obj) {
        let value = nextId++;
        value = value.toString();
        while (value.length < 3) {
            value = '0' + value;
        }
        value = 'id_' + value;

        obj[symbol] = value;

        return value;
    }


    function getId(obj) {
        return obj[symbol];
    }

    function serialize(o, indent) {
        if (o == null) {
            append(NULL);
            return;
        }

        var id;

        if (o != null && typeof o === 'object') {

            if (o.constructor === Date) {
                append('[[Date:' + o + ']]');
                return;
            }

            id = getId(o);
            if (id == null) {
                id = assignId(o);
            } else {
                append('"[[' + id + ']]"');
                return;
            }
        }

        var constr = o.constructor;

        if (o === true || o === false || constr === Boolean) {
            append(o.toString());
        } else if (Array.isArray(o)) {

            append('[');
            append('/* ' + id + '*/');
            append('\n');

            let len = o.length;
            for (let i=0; i<len; i++) {
                append(indent + '  ');

                serialize(o[i], indent + '   ');

                if (i < len-1) {
                    append(COMMA);
                }

                append('\n');
            }

            append(indent);
            append(']');
        } else if (constr === Date) {
            append(o.getTime());
        } else {
            var type = typeof o;
            switch(type) {
                case 'function':
                    append('[FUNCTION]');
                    break;
                case 'string':
                    append(JSON.stringify(o));
                    break;
                case 'number':
                    append(isFinite(o) ? o + '' : NULL);
                    break;
                case 'object':
                    append('{');
                    append('/* ' + id + '*/');
                    append('\n');

                    var keys = Object.keys(o).filter((key) => {
                        var value = o[key];
                        return value != null;
                    });

                    keys.sort();

                    let len = keys.length;

                    keys.forEach((k, i) => {
                        var v = o[k];
                        append(indent + '  ');
                        append(JSON.stringify(k));
                        append(":");
                        serialize(v, indent + '  ');

                        if (i < len-1) {
                            append(COMMA);
                        }

                        append('\n');
                    });


                    append(indent);
                    append('}');

                    break;
                default:
                    append(NULL);
            }
        }
    }

    serialize(o, '');

    return buffer.toString();
}

module.exports = stringify;