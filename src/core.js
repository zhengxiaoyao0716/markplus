import fs from 'fs';
import path from 'path';

import Parser, * as Types from './Parser';

const withEscape = fs.readFileSync(path.join(__dirname, './../src/Parser.js'), 'utf-8').split(/\r?\n/).slice(0, 5).join('\n');
const Render = fs.readFileSync(path.join(__dirname, './../src/Render.js'), 'utf-8');
const polyfill = 'window.Promise || document.writeln(\'<script src="https://cdn.jsdelivr.net/npm/babel-polyfill@6.26.0/dist/polyfill.min.js"><\' + \'/script>\');';
const CorePlugin = (self: Markplus, pkg: { version: string }) => {
    if (typeof self.name != 'string') {
        const firstH1: Types.Header = self.elements.find(ele => ele instanceof Types.Header && ele.level == 1);
        if (!firstH1 && self.name instanceof Function) {
            self.name = self.name();
        } else {
            const name = firstH1 ? firstH1.id : `_${new Date().getTime()}`;
            self.name = `${name[0].toUpperCase()}${name.slice(1)}`;
        }
    }
    return {
        head: () => [
            '<!DOCTYPE html>',
            `<!-- Markplus: ${self.name} -->`,
            '<meta charset="UTF-8">',
            '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, shrink-to-fit=no">',
            `<title>${self.name}</title>`,
            `<script>${polyfill}</script>`,
        ].join('\n'),
        code: () => `${withEscape}\n${Render}export const version = '${pkg.version}';\n`,
        dump: () => `
            import * as Markplus from 'Markplus';
            const { default: render, ...extra } = Markplus;
            export default class {
                constructor(container) {
                    render(container, ctx => this.render({ ...ctx, ...extra }));
                }
                render(Markplus) {
                    ${self.elements.map(ele => ele.dump()).join('\n').replace(/\r?\n/g, `\n${' '.repeat(4 * 5)}`)}
                }
            };
        `.replace(/\r?\n {12}/g, '\n'),
    };
};
const corePlugins = [
    [CorePlugin, require('./../package.json')],
    require('./plugin/render-promise').default,
    require('./plugin/render-table').default,
    require('./plugin/style-default').default,
];
export type Plugin = (self: Markplus) => {
    head: () => string,
    code: () => string,
    dump: () => string,
};
export type Options = {
    plugin: [string | Plugin | [string | Plugin]],
};

export default class Markplus {
    static from = (content: string | [string], name?: string, opts?: Options): Promise<Markplus> => new Promise((resolve, reject) => {
        const elements = Parser.parse(content);
        resolve(new Markplus(elements, name || '', opts || {}));
    });

    constructor(elements: [Types.Element], name: string | (() => string), opts: Options) {
        this.elements = elements;
        this.name = name;

        this.plugin = (() => {
            const pluginNames = new Set();
            const plugins = [...corePlugins, ...opts.plugin || []].map(payload => {
                const [nameOrPlugin, ...args] = payload instanceof Array ? payload : [payload];
                const plugin: Plugin = nameOrPlugin instanceof Function ? nameOrPlugin : require(`markplus-plugin-${nameOrPlugin}`).default;
                const name = plugin.name;
                if (!name) {
                    throw new Error('Invalid plugin.');
                }
                if (pluginNames.has(name)) {
                    console.warn(new Error(`plugin name (${name}) conflict.`).stack.replace(/^Error/, 'Warning')); // eslint-disable-line no-console
                }
                pluginNames.add(name);
                return plugin(this, ...args);
            });
            return (action: string): string => plugins.map(p => p[action] && p[action]()).filter(code => code != null);
        })();
    }

    head = () => `${this.plugin('head').join('\n\n')}\n`;
    code = () => `${this.plugin('code').join('\n\n')}\n`;
    dump = () => `${this.plugin('dump').join('\n\n')}\n`;

    __dirname = __dirname;
}
