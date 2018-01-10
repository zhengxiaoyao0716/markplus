import fs from 'fs';
import path from 'path';

import Parser, * as Types from './Parser';

const RenderCode = fs.readFileSync(path.join(__dirname, './../src/Render.js'), 'utf-8');

const plugins = [
    (self: Markplus) => {
        if (!self.name) {
            const firstH1: Types.Header = self.elements.find(ele => ele instanceof Types.Header && ele.level == 1);
            self.name = firstH1 && `${firstH1.content}`;
        }
        return {
            dump: () => `export const name = '${self.name}';`,
        };
    },
];
const names = new Set();
export const use = (name: string, plugin: (self: Markplus) => { dump: () => string, compile: () => string }) => {
    if (names.has(name)) {
        console.warn(new Error(`plugin name (${name}) conflict.`).stack.replace(/^Error/, 'Warning')); // eslint-disable-line no-console
    }
    names.add(name);
    plugins.push(plugin);
};

export default class Markplus {
    static from = (content: string | [string]): Promise<Markplus> => new Promise((resolve, reject) => {
        const lines = content instanceof Array ? content : content.split(content.endsWith('\r\n') ? '\r\n' : '\n');
        const elements = Parser.parse(lines);
        resolve(new Markplus(elements));
    });

    constructor(elements: [Types.Element], name?: string) {
        this.elements = elements;
        this.name = name;
        this.plugins = plugins.map(plugin => plugin(this));
    }

    code = () => ([
        RenderCode,
        ...this.elements.map(ele => ele.dump()),
        ...this.plugins.map(plugin => plugin.dump && plugin.dump()).filter(code => code),
    ].join('\n'));
}
