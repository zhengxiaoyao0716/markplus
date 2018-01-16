import fs from 'fs';
import path from 'path';
import * as babel from 'babel-core';
import commander from 'commander';

import pkg from './../package.json';
import Markplus from './core';

const launch = name => `<div id="markplus"></div><script>${name}.default(document.querySelector('#markplus'));</script>`;

const opts = (name: string) => {
    if (!name) {
        name = '.markplusrc';
        if (!fs.existsSync(name)) {
            return {};
        }
    }
    name = path.join(process.cwd(), name);
    if (name.endsWith('rc') || name.endsWith('.json')) {
        return JSON.parse(fs.readFileSync(name));
    }
    return require(name).default;
};

const babelrc = JSON.parse(fs.readFileSync(path.join(__dirname, './../.babelrc'), 'utf-8'));
const transform = (code, name) => babel.transform(code, { ...babelrc, plugins: ['transform-es2015-modules-umd'], filename: name });

const compile = () => {
    const input = commander.args[0]; // eslint-disable-line no-console
    if (!input) {
        throw new Error('missing input file.');
    }
    const name = commander.args[1];
    Markplus.from(fs.readFileSync(input, 'utf-8'), name, opts(commander.config))
        .then(mp => ({ ...mp, code: mp.code() }))
        .then(mp => commander.transform ? ({ ...mp, ...transform(mp.code, mp.name) }) : mp)
        .then(({ code, name, plugin }) => commander.js ? code : [
            ...plugin('head'),
            '<style>body { margin: 0; width: 100%; height: 100%; }</style>',
            `<script>\n${code}\n</script>`,
            launch(name),
            '',
        ].join('\n'))
        .then(output =>
            commander.out ?
                fs.writeFileSync(commander.out, output, 'utf-8')
                : console.log(output) // eslint-disable-line no-console
        ).catch(console.error); // eslint-disable-line no-console
};

commander.version(pkg.version).usage('[options] INPUT <name> ...');
[
    ['--html', 'Compile to html'],
    ['--js', 'Compile to javascript'],
    ['-o, --out [file]', 'Write the output into the file.'],
    ['-c, --config [.markplusrc|json|config.js]', 'Read the config from the file.'],
    ['--no-transform', 'With out babel transform.'],
].forEach(([...args]) => commander.option(...args));
commander.parse(process.argv);

compile();
