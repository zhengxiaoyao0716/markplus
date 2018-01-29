const { default: Parser, withEscape, Table } = require('./../lib/Parser');

console.log('check Parser.Function:');
[
    [
        'IDENT(...) /N ...',
        'IDENT(...) /N',
        'IDENT /N ...',
        'IDENT /N',
    ]
        .map(expr => expr.replace(/\.\.\./g, 'a, b, /* (comments) */...c'))
        .map(expr => `${expr} // (comments)`),
    /** @param {[string]} exprs */exprs => ([
        ...exprs.map(expr => expr.replace(' /N', ' /3')),
        ...exprs.map(expr => expr.replace(' /N', ' /:30')),
        ...exprs.map(expr => expr.replace(' /N', '/3')),
        ...exprs.map(expr => expr.replace(' /N', '/:30')),
        ...exprs.map(expr => expr.replace(' /N', '')),
        exprs[2].replace(' /N', '/'),
    ]),
    /** @param {[string]} exprs */exprs => ([
        ...exprs.map(expr => expr.replace('IDENT', '$_ident.name')),
        ...exprs.map(expr => expr.replace('IDENT', '#_ident.name')),
    ]),
].reduce((v, f) => f(v)).forEach((expr, index) => {
    const ele = Parser.Function.pipe(expr, index);
    if (ele) {
        console.log(ele);
        return;
    }
    throw new Error(expr);
});
console.log();

console.log('check Parser.HTMLElement:');
[
    '# Header01',
    '###### Header06',
].forEach((line, index) => {
    const ele = Parser.HTMLElement.pipe(line, index);
    if (ele) {
        console.log(ele);
        return;
    }
    throw new Error(line);
});
console.log();

console.log(withEscape(text => (reg, rep) => text.replace(/&/g, ' AND ').replace(reg, rep))('a&b&c\\&d\\\\&e'));
console.log(Table.split('- |a#b| c # d\\|e\\#f|#\\${\\\\}').map(t => `"${t}"`).join(', '));
