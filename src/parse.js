var isArray = Array.isArray;

function resolve(object, path, len) {
    var current = object;
    for (var i=0; i<len; i++) {
        current = current[path[i]];
    }

    return current;
}

function resolveType(info) {
    if (info.type === 'Date') {
        return new Date(info.value);
    } else {
        throw new Error('Bad type');
    }
}

module.exports = function parse(json) {
    var outer = JSON.parse(json);

    var object = outer.object;

    var assignments = outer.assignments;
    if (assignments) {
        for (var i=0, len=assignments.length; i<len; i++) {
            var assignment = assignments[i];

            var rhs = assignment.r;
            var rhsValue;

            if (isArray(rhs)) {
                rhsValue = resolve(object, rhs, rhs.length);
            } else {
                rhsValue = resolveType(rhs);
            }

            var lhs = assignment.l;
            var lhsLast = lhs.length-1;

            if (lhsLast === -1) {
                return rhsValue;
            } else {
                var lhsParent = resolve(object, lhs, lhsLast);
                lhsParent[lhs[lhsLast]] = rhsValue;
            }
        }
    }

    return object == null ? null : object;
};