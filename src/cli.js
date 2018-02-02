import fs from 'fs';
import path from 'path';
import * as babel from 'babel-core';
import commander from 'commander';

import pkg from './../package.json';
import Markplus from './core';

const opts = (name: string) => {
    const file = path.join(process.cwd(), name || [
        '.markplusrc',
        'markplusrc.json',
        'markplus.config.js',
    ].find(name => fs.existsSync(path.join(process.cwd(), name))));
    if (!file) {
        return {};
    }
    if (file.endsWith('rc') || file.endsWith('.json')) {
        return JSON.parse(fs.readFileSync(file));
    }
    return require(file).default;
};

const babelrc = JSON.parse(fs.readFileSync(path.join(__dirname, './../.babelrc'), 'utf-8'));
const transform = (code, name) => (
    commander.transform ? babel.transform(code, { ...babelrc, plugins: ['transform-es2015-modules-umd'], filename: name }).code : code
);

const head = ({ head }) => head();
const code = ({ code }) => transform(code(), 'Markplus');
const dump = ({ dump, name }) => transform(dump(), name);
const launch = ({ name }) => transform(`import ${name} from '${name}';\nexport default new ${name}(
    ((container, div) => { container.appendChild(div); return div; })(document.querySelector('#markplus${name}'), document.createElement('div'))
);\n`, `launch${name}`);

const compile = () => {
    const input = commander.args[0]; // eslint-disable-line no-console
    const name = commander.args[1] || (() => path.parse(input).name);
    Markplus.from(input ? fs.readFileSync(input, 'utf-8') : '# Hello Markplus', name, opts(commander.config))
        .then(mp => commander.only ? ({ head, code, dump })[commander.only](mp) : [
            head(mp),
            '<style>body { margin: 0; width: 100%; height: 100%; }</style>\n',
            `<script>\n    ${code(mp).replace(/\r?\n/g, '\n    ').replace(/ {4}\n/g, '\n').trim()}</script>\n`,
            `<div id="markplus${mp.name}">`,
            `    <script>\n        ${dump(mp).replace(/\r?\n/g, '\n        ').replace(/ {8}\n/g, '\n').trim()}    </script>`,
            `    <script>\n        ${launch(mp).replace(/\r?\n/g, '\n        ').replace(/ {8}\n/g, '\n').trim()}    </script>`,
            '</div>\n',
        ].join('\n'))
        .then(output => commander.out ?
            fs.writeFileSync(commander.out, output, 'utf-8')
            : console.log(output) // eslint-disable-line no-console
        ).catch(console.error); // eslint-disable-line no-console
};

commander.version(pkg.version).usage('[options] INPUT <name> ...');
[
    ['--only <head|code|dump>', 'Only output the specific part.'],
    ['-o, --out <file>', 'Write the output into the file.'],
    ['-c, --config <.markplusrc|json|config.js>', 'Read the config from the file.'],
    ['--no-transform', 'With out babel transform.'],
].forEach(([...args]) => commander.option(...args));
commander.parse(process.argv);

compile();
