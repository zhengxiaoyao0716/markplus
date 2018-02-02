import * as Babel from '@babel/standalone';
import transformClassProperties from 'babel-plugin-transform-class-properties';
Babel.registerPlugin('transform-class-properties', transformClassProperties);

import Parser from './../src/Parser';
import * as Markplus from './temp/render-code';

(matched => matched && window.localStorage.setItem('render', window.decodeURIComponent(matched[2])))(window.location.search.slice(1).match(/(^|&)render=([^&]*)(&|$)/));

const { default: render, ...extra } = Markplus;
const Render = function (container) {
    render(container, ctx => this.render({ ...ctx, ...extra }));
};
const resolve = (text: Promise<string>) => text.then(Parser.parse.bind(Parser)).then(elements =>
    Babel.transform(`
        Render.prototype.render = function (Markplus) {
            ${elements.map(ele => ele.dump()).join('\n').replace(/\r?\n/g, `\n${' '.repeat(4 * 5)}`)}
        };
    `, { plugins: ['transform-class-properties'], presets: ['es2015', 'flow', 'stage-2'] })
).then(r => eval(r.code)).then(() => (parent: HTMLElement) => {
    parent.textContent = '';
    parent.style.margin = 0;
    parent.style.width = '100%';
    parent.style.height = '100%';

    const container = document.createElement('div');
    parent.appendChild(container);
    container.id = '#markplusRender';

    ((global, factory) => {
        const mod = { exports: {} };
        factory(mod.exports);
        global.launchMarkplusRender = mod.exports;
    })(this || typeof window !== 'undefined' && window || global, exports => {
        Object.defineProperty(exports, '__esModule', { value: true });

        exports.default = new Render(
            (div => { container.appendChild(div); return div; })(document.createElement('div'))
        );
    });
}).then(init => document.body ? init(document.body) : window.addEventListener('load', () => init(document.body)));

(url => {
    if (url) {
        resolve(fetch(url).then(r => {
            document.head.appendChild((base => (base.href = url, base))(document.createElement('base')));
            return r.text();
        }));
        return;
    }
    const dropbox = document.createElement('div');
    window.addEventListener('load', () => {
        document.body.appendChild(dropbox);

        dropbox.id = 'dropbox';
        dropbox.innerText = 'Drag file to here or click and input the path to render it.';
        dropbox.style.color = '#ccc';
        dropbox.style.border = '3px dashed #ccc';
        dropbox.style.fontSize = '2em';
        dropbox.style.padding = '30px 60px';
        dropbox.style.textAlign = 'center';
        dropbox.style.cursor = 'pointer';
        dropbox.click();
    });
    dropbox.addEventListener('dragover', e => { e.stopPropagation(); e.preventDefault(); });
    dropbox.addEventListener('drop', e => {
        e.stopPropagation();
        e.preventDefault();

        const files = e.dataTransfer.files;
        if (!files || files.length < 1) {
            return;
        }
        const reader = new FileReader();
        reader.addEventListener('load', e => resolve(Promise.resolve(e.target.result)));
        reader.readAsText(files[0]);
    });
    dropbox.addEventListener('click', () => {
        const input = window.prompt('Input the path to render:');
        input && (window.location.search = `&render=${window.encodeURIComponent(input)}`);
    });
})(window.localStorage.getItem('render'));
