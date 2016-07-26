var object = {};
object.arr = [
  object, object
];
object.arr.push(object.arr);
object.obj = object;

module.exports = [object];