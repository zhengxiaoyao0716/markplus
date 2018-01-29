'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _require = require('./../lib/Parser'),
    Parser = _require.default,
    withEscape = _require.withEscape,
    Table = _require.Table;

console.log('check Parser.Function:');
[['IDENT(...) /N ...', 'IDENT(...) /N', 'IDENT /N ...', 'IDENT /N'].map(function (expr) {
    return expr.replace(/\.\.\./g, 'a, b, /* (comments) */...c');
}).map(function (expr) {
    return expr + ' // (comments)';
}),
/** @param {[string]} exprs */function (exprs) {
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
},
/** @param {[string]} exprs */function (exprs) {
    return [].concat(_toConsumableArray(exprs.map(function (expr) {
        return expr.replace('IDENT', '$_ident.name');
    })), _toConsumableArray(exprs.map(function (expr) {
        return expr.replace('IDENT', '#_ident.name');
    })));
}].reduce(function (v, f) {
    return f(v);
}).forEach(function (expr, index) {
    var ele = Parser.Function.pipe(expr, index);
    if (ele) {
        console.log(ele);
        return;
    }
    throw new Error(expr);
});
console.log();

console.log('check Parser.HTMLElement:');
['# Header01', '###### Header06'].forEach(function (line, index) {
    var ele = Parser.HTMLElement.pipe(line, index);
    if (ele) {
        console.log(ele);
        return;
    }
    throw new Error(line);
});
console.log();

console.log(withEscape(function (text) {
    return function (reg, rep) {
        return text.replace(/&/g, ' AND ').replace(reg, rep);
    };
})('a&b&c\\&d\\\\&e'));
console.log(Table.split('- |a#b| c # d\\|e\\#f|#\\${\\\\}').map(function (t) {
    return '"' + t + '"';
}).join(', '));
//# sourceMappingURL=test.js.map