import fs from 'fs';
import path from 'path';
import * as babel from 'babel-core';
import commander from 'commander';

import pkg from './../package.json';
import Markplus, { use } from './core';
import PluginStyleDefault from './plugin/style-default';

const babelrc = JSON.parse(fs.readFileSync(path.join(__dirname, './../.babelrc'), 'utf-8'));
const launch = name => `<div id="markplus" class="Markplus"></div><script>${name}.default(document.querySelector('#markplus'));</script>`;
use(PluginStyleDefault);

const transform = (code, name) => babel.transform(code, { ...babelrc, plugins: ['transform-es2015-modules-umd'], filename: name });

const compile = () => {
    const input = commander.args[0]; // eslint-disable-line no-console
    if (!input) {
        throw new Error('missing input file.');
    }
    Markplus.from(fs.readFileSync(input, 'utf-8'))
        .then(mp => ({ ...mp, code: mp.code() }))
        .then(mp => commander.transform ? ({ ...mp, ...transform(mp.code, mp.name) }) : mp)
        .then(({ code, name, plugin }) => commander.js ? code : [
            ...plugin('head'),
            `<script>\n${code}\n</script>`,
            launch(name),
            '',
        ].join('\n'))
        .then(output => {
            commander.out ?
                fs.writeFileSync(commander.out, output, 'utf-8')
                : console.log(output); // eslint-disable-line no-console
        }).catch(console.error); // eslint-disable-line no-console
};

commander.version(pkg.version).usage('[options] <file ...>');
[
    ['--html', 'Compile to html'],
    ['--js', 'Compile to javascript'],
    ['-o, --out [file]', 'Write the output into the file.'],
    ['--no-transform', 'With out babel transform.'],
].forEach(([...args]) => commander.option(...args));
commander.parse(process.argv);

compile();
