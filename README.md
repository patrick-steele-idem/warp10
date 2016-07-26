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
- 100% test coverage
- [Benchmarks](#is-it-fast)

# Installation

```bash
npm install warp10 --save
```

# Usage

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
  hello: 'world'
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

# Examples

## Simple

```javascript
warp10.serialize({ name: 'Frank' });
```

Output (formatted for readability):

```javascript
({
  "name": "Frank"
})
```

## Simple types

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

## Global variable

```javascript
warp10.serialize({ name: 'Frank' }, { var: 'person' });
```

Output (formatted for readability):

```javascript
window.person = {
  "name": "Frank"
}
```

## Global variable with additive

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

## Circular dependency

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

## De-duping

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

## Circular dependency plus de-duping

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

# Is it fast?

Yes, this library is optimized for both fast serialization and deserialization. This library was built on top of the native `JSON.stringify` method for optimal performance. This library includes [benchmarks](./benchmarks) that you can run locally:

```
cd warp10/
npm run benchmark
```

Below is the output for one run of the benchmarks:

```text
                      circular
         300,922 op/s » circular-json
             546 op/s » lave
         669,566 op/s » refify
         838,022 op/s » warp10

                      circular-dedupe
          50,796 op/s » circular-json
             524 op/s » lave
          47,521 op/s » refify
         198,100 op/s » warp10

                      dedupe
         112,793 op/s » circular-json
             579 op/s » lave
         313,136 op/s » refify
         499,719 op/s » warp10

                      deserialize-circular-dedupe
          31,543 op/s » circular-json
          26,875 op/s » refify
       1,081,134 op/s » warp10

                      deserialize-simple-large
           2,568 op/s » circular-json
          24,597 op/s » parse-native
           1,990 op/s » refify
         151,658 op/s » warp10

                      simple-large
           3,214 op/s » circular-json
           2,053 op/s » json3
             285 op/s » lave
           2,592 op/s » refify
          31,773 op/s » stringify-native
          11,217 op/s » warp10

                      simple-large-b
             124 op/s » circular-json
             123 op/s » json3
              28 op/s » lave
             160 op/s » refify
           2,251 op/s » stringify-native
           1,483 op/s » warp10

                      simple-small
         171,852 op/s » circular-json
         108,224 op/s » json3
             653 op/s » lave
         276,234 op/s » refify
       1,160,510 op/s » stringify-native
         709,009 op/s » warp10

                      test-a
         198,462 op/s » circular-json
             590 op/s » lave
          97,183 op/s » refify
         414,673 op/s » warp10
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

This library was originally created to support serializing potentially complex UI component state down to the browser for the [Marko Widgets](https://github.com/marko-js/marko-widgets) UI components library. This allows the web browser to pickup exactly where the server left off when utilizing server-side rendering of a web page. Marko Widgets is optimized for speed and it is important to minimize the CPU usage of both the server and the web browser to reduce page load times. This library can be used to transport a complex JavaScript graph from one JavaScript runtime to another JavaScript runtime.

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
