warp10
======

Transport complex JavaScript objects from the server to the web browser at lightning fast speeds. Circular dependencies are correctly handled and de-duping is done automatically. Deserialization is done completely via generated JavaScript code for optimal performance (no library code is required to deserialize an object).

[![Build Status](https://travis-ci.org/patrick-steele-idem/warp10.svg?branch=master)](https://travis-ci.org/patrick-steele-idem/warp10)
[![Coverage Status](https://coveralls.io/repos/github/patrick-steele-idem/warp10/badge.svg?branch=master)](https://coveralls.io/github/patrick-steele-idem/warp10?branch=master)
[![NPM](https://img.shields.io/npm/v/warp10.svg)](https://www.npmjs.com/package/warp10)

# Features

- Circular references are correctly serialized and deserialized
- Duplicate objects/arrays found during serialization are only serialized once
- `Date` values are correctly serialized and deserialized
- Output is the code for a JavaScript expression that, when evaluated, will return the deserialized object
- Extremely fast serialization and deserialization
- [100% test coverage](https://coveralls.io/github/patrick-steele-idem/warp10?branch=master)
- [Benchmarks](#is-it-fast)

# Installation

```bash
npm install warp10 --save
```

# Usage

With `warp10` you can choose to serialize an object to either a JSON string or JavaScript deserialization code. Generating JavaScript deserialization code is typically faster than producing JSON code and the JavaScript deserialization code will typically allow the object to parse much more quickly. In addition, no library code is needed to parse an object when outputting JavaScript deserialization code since only the JavaScript code needs to be evaluated by the JavaScript runtime.

## Outputting JavaScript code

```javascript
var warp10 = require('warp10');

var deserializationCode = warp10.serialize(object[, options]); // Returns a String
```

For example:

```javascript
warp10.serialize({
        hello: 'world'
    },
    {
        var: 'foo'
    });
```

This will produce code similar to the following:

```javascript
window.foo = {
  "hello": "world"
}
```

Supported options:

- `safe` - If `true` then the ending `</script>` tags will be escaped. (optional, default: `true`)
- `var` - A global variable name to assign the output expression to. If not specified then no global variable will be created (optional, default: `undefined`)
- `additive` - If `true` then objects will be merged into the existing object referenced by the global variable (i.e. the `var` option) (optional, default: `false`)

Evaluating the output deserialization code as a JavaScript expression will produce a clone of the original object graph.

You could transport the object graph to the browser by placing the code in a `<script>` tag as shown below:

```html
<script>
var deserializedObject = <%= deserializationCode %>;
console.log('DESERIALIZED:', deserializedObject);
</script>
```

You can also `eval` the `deserializationCode`:

```javascript
console.log('DESERIALIZED:', eval(deserializationCode));
```

## JSON stringify/parse

If outputting JavaScript code is not an option or not desired then you can use the `stringify` and `parse` methods provided by `warp10`.

```javascript
var warp10 = require('warp10');

var json = warp10.stringify(object[, options]); // Returns a String
```

Supported options:

- `safe` - If `true` then the ending `</script>` tags will be escaped. (optional, default: `false`)

The JSON can then be parsed using code similar to the following:

```javascript
var parse = require('warp10/parse');

var object = parse(json);
```

## JSON stringifyPrepare/finalize

The `stringifyPrepare` function can be used to produce a JavaScript object that is safe to serialize using the native `JSON.stringify` method. The `finalize` method should be called on the parsed object to produce the final object with duplicate objects and circular dependencies intact.

_On the server:_

```javascript
var warp10 = require('warp10').stringifyPrepare;
var object = stringifyPrepare(object); // Returns an Object
var json = JSON.stringify(object);
```

_In the browser:_

```javascript
var finalize = require('warp10/finalize');
var clone = finalize(JSON.parse(json));
```

# Examples

## Serialize examples

### Simple

```javascript
warp10.serialize({ name: 'Frank' });
```

Output (formatted for readability):

```javascript
({
  "name": "Frank"
})
```

### Simple types

```javascript
warp10.serialize({
    object: {
        foo: 'bar'
    },
    array: ['a', 'b', 'c'],
    boolean: true,
    string: 'Hello World',
    number: 123,
    date: new Date(1776, 6, 4)
});
```

Output (formatted for readability):

```javascript
(function() {
  var $ = {
    "object": {
      "foo": "bar"
    },
    "array": ["a", "b", "c"],
    "boolean": true,
    "string": "Hello World",
    "number": 123
  }
  $.date = new Date(-6106039200000)
  return $
}())
```

### Global variable

```javascript
warp10.serialize({ name: 'Frank' }, { var: 'person' });
```

Output (formatted for readability):

```javascript
window.person = {
  "name": "Frank"
}
```

### Global variable with additive

```javascript
var deserializationCodeA = warp10.serialize({
        foo: 'foo',
        bar: 'bar'
    },
    {
        var: 'myStore',
        additive: true
    });

var deserializationCodeB = warp10.serialize({
        baz: 'baz'
    },
    {
        var: 'myStore',
        additive: true
    });
```

Output (formatted for readability):

```javascript
// deserializationCodeA
(function() {
    var t = window.myStore || (window.myStore = {})
    var $ = {
        "foo": "foo",
        "bar": "bar"
    }
    t.foo = $.foo
    t.bar = $.bar
}());

// deserializationCodeB
(function() {
    var t = window.myStore || (window.myStore = {})
    var $ = {
        "baz": "baz"
    }
    t.baz = $.baz
}())
```

Final value of the `window.myStore` global:

```javascript
{
    foo: 'foo',
    bar: 'bar',
    baz: 'baz'
}
```

### Circular dependency

```javascript
var parent = {
    name: 'parent'
};

var child = {
    parent: parent
};

parent.child = child;

warp10.serialize(parent);
```

Output (formatted for readability):

```javascript
(function() {
  var $ = {
    "name": "parent",
    "child": {}
  }
  $.child.parent = $
  return $
}())
```

### De-duping

```javascript
var child = {
    name: 'Henry'
};

var mother = {
    name: 'Jane',
    child: child
};

var father = {
    name: 'Frank',
    child: child
};

warp10.serialize({
    mother: mother,
    father: father
});
```

Output (formatted for readability):

```javascript
(function() {
  var $ = {
    "mother": {
      "name": "Jane",
      "child": {
        "name": "Henry"
      }
    },
    "father": {
      "name": "Frank"
    }
  }
  $.father.child = $.mother.child
  return $
}())
```

### Circular dependency plus de-duping

```javascript
var warp10 = require('warp10');

var mother = {
    name: 'Jane',
    age: 30
};

var father = {
    name: 'Frank',
    age: 32
};

var child1 = {
    name: 'Sue',
    age: 5,
    mother: mother, // circular
    father: father // circular
};

var child2 = {
    name: 'Henry',
    age: 10,
    mother: mother, // circular
    father: father // circular
};

mother.children = [child1, child2];
father.children = [child1 /* duplicate */, child2 /* duplicate */];

warp10.serialize({
    mother: mother,
    father: father
});
```

The value of `deserializationCode` will be similar to the following (formatted for readability):

```javascript
(function() {
  var $ = {
    "mother": {
      "name": "Jane",
      "age": 30,
      "children": [{
        "name": "Sue",
        "age": 5,
        "father": {
          "name": "Frank",
          "age": 32,
          "children": [null, {
            "name": "Henry",
            "age": 10
          }]
        }
      }, null]
    }
  }
  $.mother.children[0].mother = $.mother
  $.mother.children[0].father.children[0] = $.mother.children[0]
  $.mother.children[0].father.children[1].mother = $.mother
  $.mother.children[0].father.children[1].father = $.mother.children[0].father
  $.mother.children[1] = $.mother.children[0].father.children[1]
  $.father = $.mother.children[0].father
  return $
}())
```

## Stringify examples

### Simple

```javascript
warp10.stringify({ name: 'Frank' });
```

Output (formatted for readability):

```javascript
{
  "object": {
    "name": "Frank"
  }
}
```

### Circular dependency

```javascript
var parent = {
    name: 'parent'
};

var child = {
    parent: parent
};

parent.child = child;

warp10.serialize(parent);
```

Output (formatted for readability):

```javascript
{
  "object": {
    "mother": {
      "name": "Jane",
      "age": 30,
      "children": [{
        "name": "Sue",
        "age": 5,
        "father": {
          "name": "Frank",
          "age": 32
        }
      }, {
        "name": "Henry",
        "age": 10
      }]
    }
  },
  "assignments": [{
    "l": ["mother", "children", 0, "mother"],
    "r": ["mother"]
  }, {
    "l": ["mother", "children", 0, "father", "children"],
    "r": ["mother", "children"]
  }, {
    "l": ["mother", "children", 1, "mother"],
    "r": ["mother"]
  }, {
    "l": ["mother", "children", 1, "father"],
    "r": ["mother", "children", 0, "father"]
  }, {
    "l": ["father"],
    "r": ["mother", "children", 0, "father"]
  }]
}
```

# Is it fast?

Yes, this library is optimized for both fast serialization and deserialization. This library was built on top of the native `JSON.stringify` method for optimal performance. This library includes [benchmarks](./benchmarks) that you can run locally:

```
cd warp10/
npm run benchmark
```

Below is the output for one run of the benchmarks:

```text
                      circular
         284,357 op/s » circular-json
             521 op/s » lave
         654,493 op/s » refify
         519,239 op/s » warp10-stringify
         820,863 op/s » warp10

                      circular-dedupe
          49,070 op/s » circular-json
             505 op/s » lave
          46,396 op/s » refify
         113,071 op/s » warp10-stringify
         177,930 op/s » warp10

                      dedupe
         104,117 op/s » circular-json
             558 op/s » lave
         334,314 op/s » refify
         343,625 op/s » warp10-stringify
         478,872 op/s » warp10

                      deserialize-circular-dedupe
          32,124 op/s » circular-json
          25,247 op/s » refify
          82,770 op/s » warp10-parse
       1,052,371 op/s » warp10

                      deserialize-simple-large
           2,551 op/s » circular-json
          24,051 op/s » parse-native
           1,918 op/s » refify
          24,497 op/s » warp10-parse
         149,809 op/s » warp10

                      simple-large
           3,150 op/s » circular-json
           2,076 op/s » json3
             283 op/s » lave
           2,504 op/s » refify
          31,057 op/s » stringify-native
          11,174 op/s » warp10-stringify
          11,161 op/s » warp10

                      simple-large-b
             124 op/s » circular-json
             117 op/s » json3
              26 op/s » lave
             156 op/s » refify
           2,263 op/s » stringify-native
           1,505 op/s » warp10-stringify
           1,461 op/s » warp10

                      simple-small
         164,080 op/s » circular-json
         105,782 op/s » json3
             635 op/s » lave
         259,742 op/s » refify
       1,121,181 op/s » stringify-native
         555,886 op/s » warp10-stringify
         686,304 op/s » warp10

                      test-a
         190,557 op/s » circular-json
             554 op/s » lave
          90,753 op/s » refify
         219,099 op/s » warp10-stringify
         381,360 op/s » warp10
```

Test setup:

- Node.js v6.3.1
- OSX 10.11.5
- 2.8 GHz Intel Core i7
- 16 GB 1600 MHz DDR3

# How does it work?

Internally, this library utilizes the native [`JSON.stringify`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) method to serialize an object to JSON. However, before calling `JSON.stringify`, the object is pruned by removing duplicate objects. If an already serialized object is encountered then the current property is skipped and the skipped property is tracked so that it can be fixed up later using generated JavaScript code.

`warp10` detects circular dependencies and duplicate objects by marking each object with a non-enumerable [Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) property using code similar to the following:

```javascript
var markerKey = Symbol();
var marker = {}
obj[markerKey] = marker;
```

This special property is largely private and only discoverable at runtime via `Object.getOwnPropertySymbols` or proxies.

# Why?

This library can be used to transport a complex JavaScript graph from one JavaScript runtime to another JavaScript runtime. This library was originally created to support serializing potentially complex UI component state down to the browser for the [Marko Widgets](https://github.com/marko-js/marko-widgets) UI components library. This allows the web browser to pickup exactly where the server left off when utilizing server-side rendering of a web page. Marko Widgets is optimized for speed and it is important to minimize the CPU usage of both the server and the web browser to reduce page load times (accompanied by a reduced payload size through de-duping of data).

# Similar projects

- [circular-json](https://github.com/WebReflection/circular-json)
- [JSON-js](https://github.com/douglascrockford/JSON-js)
- [jsonr](https://github.com/graniteds/jsonr)
- [refify](https://github.com/grncdr/refify)
- [serialize-javascript](https://github.com/yahoo/serialize-javascript)

# Maintainers

* [Patrick Steele-Idem](https://github.com/patrick-steele-idem) (Twitter: [@psteeleidem](http://twitter.com/psteeleidem))

# Contributing

Pull Requests welcome. Please submit Github issues for any feature enhancements, bugs or documentation problems. Please make sure all tests pass:

```
npm test
```

# License

MIT
