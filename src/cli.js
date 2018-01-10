import fs from 'fs';
import path from 'path';
import * as babel from 'babel-core';

import Markplus from './core';

const babelrc = JSON.parse(fs.readFileSync(path.join(__dirname, './../.babelrc'), 'utf-8'));
const style = '<style>.Markplus { }</style>';
const launch = name => `<div id="markplus"></div><script>${name}.default(document.querySelector('#markplus'));</script>`;

const transform = (code, name) => babel.transform(code, { ...babelrc, plugins: ['transform-es2015-modules-umd'], filename: name })

const compile = () => {
    const input = fs.readFileSync('ReadMe.mp', 'utf-8');
    Markplus.from(input)
        .then(mp => ({ ...mp, code: mp.code() }))
        .then(mp => ({ ...mp, ...transform(mp.code, mp.name) }))
        .then(({ code, name }) => (`<!-- markplus -->${style}\n<script>\n${code}\n</script>\n${launch(name)}\n`))
        .then(output => {
            fs.writeFileSync(path.join(__dirname, './../index.html'), output, 'utf-8');
            console.log(output); // eslint-disable-line no-console
        }).catch(console.error); // eslint-disable-line no-console
};

compile();
