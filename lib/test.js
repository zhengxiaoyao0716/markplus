'use strict';

var _Parser = require('./Parser');

var _Parser2 = _interopRequireDefault(_Parser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

console.log('check Parser.Function:');
[['IDENT(...) /N ...', 'IDENT(...) /N', 'IDENT /N ...', 'IDENT /N'].map(function (expr) {
    return expr.replace(/\.\.\./g, 'a, b, /* (comments) */...c');
}).map(function (expr) {
    return expr + ' // (comments)';
}), function (exprs) {
    return [].concat(_toConsumableArray(exprs.map(function (expr) {
        return expr.replace(' /N', ' /3');
    })), _toConsumableArray(exprs.map(function (expr) {
        return expr.replace(' /N', ' /:30');
    })), _toConsumableArray(exprs.map(function (expr) {
        return expr.replace(' /N', '/3');
    })), _toConsumableArray(exprs.map(function (expr) {
        return expr.replace(' /N', '/:30');
    })), _toConsumableArray(exprs.map(function (expr) {
        return expr.replace(' /N', '');
    })), [exprs[2].replace(' /N', '/')]);
}, function (exprs) {
    return [].concat(_toConsumableArray(exprs.map(function (expr) {
        return expr.replace('IDENT', '$_ident.name');
    })), _toConsumableArray(exprs.map(function (expr) {
        return expr.replace('IDENT', '#_ident.name');
    })));
}].reduce(function (v, f) {
    return f(v);
}).forEach(function (expr, index) {
    var ele = _Parser2.default.Function.pipe(expr, index);
    if (ele) {
        console.log(ele);
        return;
    }
    throw new Error(expr);
});
console.log();

console.log('check Parser.HTMLElement:');
['# Header01', '###### Header06'].forEach(function (line, index) {
    var ele = _Parser2.default.HTMLElement.pipe(line, index);
    if (ele) {
        console.log(ele);
        return;
    }
    throw new Error(line);
});
console.log();
//# sourceMappingURL=test.js.map