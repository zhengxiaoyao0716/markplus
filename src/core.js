import fs from 'fs';
import path from 'path';

import Parser, * as Types from './Parser';
import PluginRenderPromise from './plugin/render-promise';
import PluginStyleDefault from './plugin/style-default';

const Render = fs.readFileSync(path.join(__dirname, './../src/Render.js'), 'utf-8');
const CorePlugin = (self: Markplus, pkg: { version: string }) => {
    if (!self.name) {
        const firstH1: Types.Header = self.elements.find(ele => ele instanceof Types.Header && ele.level == 1);
        self.name = firstH1 ? firstH1.id : `_${new Date().getTime()}`;
    }
    return {
        head: () => `<!-- Markplus: ${self.name} -->`,
        code: () => `${Render}Markplus.__defineGetter__('version', () => '${pkg.version}');\n`,
        dump: () => [
            `\nexport const name = '${self.name}';`,
            ...self.elements.map(ele => ele.dump()),
        ].join('\n'),
    };
};
import pkg from './../package.json';
const corePlugins = [
    [CorePlugin, pkg],
    PluginRenderPromise,
    PluginStyleDefault,
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
        const lines = content instanceof Array ? content : content.split(content.endsWith('\r\n') ? '\r\n' : '\n');
        const elements = Parser.parse(lines);
        resolve(new Markplus(elements, name || '', opts || {}));
    });

    constructor(elements: [Types.Element], name: string, opts: Options) {
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

    head = () => this.plugin('head').join('\n');
    code = () => ([
        '\n/* code */\n',
        ...this.plugin('code'),
        '\n/* dump */\n',
        ...this.plugin('dump'),
    ].join('\n'));

    __dirname = __dirname;
}
