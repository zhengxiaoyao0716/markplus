export class Element {
    constructor(size: number, line: string, at: number, params: any) {
        this.type = this.constructor.name;
        this.size = size;
        const lines: [string | Element] = [line];
        this.lines = lines;
        this.params = params;
        this.at = at;
    }
    push(line: string, at: number) { // eslint-disable-line no-unused-vars
        this.lines.push(line);
    }
    completed(line: string, at: number) { // eslint-disable-line no-unused-vars
        return this.size == this.lines.length;
    }
    get json() { return this; }
    dump() { return `Markplus.register(${this.at}, ${JSON.stringify({ ...this.json })});`; }
}
export class Invalid extends Element {
    constructor(line: string, at: number, reason: string) {
        super(1, line, at, { reason });
    }
    dump() { return `console.error(${JSON.stringify(this)});`; }
}
export class Save extends Element {
    push(line: string, at: number) { // eslint-disable-line no-unused-vars
        const splited = Parser.Function.body.split(line.trim());
        if (!splited) {
            this.lines.push(new Invalid(line, at, `child function of (${this.params.name}) syntax invalid.`));
            return;
        }
        const { args, exec, hold, extra } = splited;
        if (exec) {
            this.lines.push(new Invalid(line, at, 'multi-lines functions cannot have immediately child function.'));
            return;
        }
        if (hold) {
            this.lines.push(new Invalid(line, at, 'nested multi-lines functions not support.'));
            return;
        }
        this.lines.push(new Save(1, line, at, { args, extra }));
    }
    dump() {
        const { name, args, exec, extra = '' } = this.params;
        const lines = this.size == 1 ? ''
            : `    ${[
                'let result;',
                ...this.lines.slice(1)
                    .map(ele => ele instanceof Invalid ? `() => ${ele.dump()}` : ele.params)
                    .map(({ args, extra = '' }) => `result = (${args || '()'} => (\n        ${extra}\n    ))(result);`),
            ].join('\n    ')}\n`;
        const linesResult = this.size == 1 ? '' : 'result';
        const fn = `function ${args || '()'} {\n${lines}    return (\n        ${linesResult}${extra}\n    );\n}`;
        return `const ${name}${name.startsWith('_') ? '' : ` = this.${name}`} = ${exec ? `(${fn})()` : fn};`;
    }
}
export class Load extends Element {
    push(line: string, at: number) { // eslint-disable-line no-unused-vars
        if (!this.params.exec) {
            this.lines.push(line);
            return;
        }
        if (this.lastLine instanceof Element && !this.lastLine.completed(line, at)) {
            this.lastLine.push(line, at);
            this.size--;
            return;
        }
        const ele = Parser.Function.pipe(line, at) || Parser.HTMLElement.pipe(line, at);
        if (!ele || ele instanceof Save) {
            this.lines.push(line.slice(4));
            return;
        }
        this.lines.push(ele);
    }
    get expr() {
        const { name, args, exec, extra = '' } = this.params;
        const lines = this.size == 1 ? ''
            : this.lines.slice(1).map(
                exec ?
                    line => line instanceof Element ?
                        line.expr || JSON.stringify({ ...line.json, at: line.at }) : `(\n        ${line}\n    )`
                    : JSON.stringify
            ).join(',\n    ');
        return `${args ? `${name}.bind${args}` : name}(\n    ${lines}${extra}\n)`;
    }
    dump() {
        return `Markplus.register(${this.at}, ${this.expr});`;
    }
    // completed(line: string, at: number) { // eslint-disable-line no-unused-vars
    //     if (this.lastLine instanceof Element && !this.lastLine.completed(line, at)) {
    //         return false;
    //     }
    //     return super.completed(line, at);
    // }
    get lastLine() {
        return this.lines[this.lines.length - 1];
    }
}
export class Comments extends Element {
    constructor(line: string, at: number) {
        super(1, line, at, null);
    }
    get json() {
        return { tag: 'span', html: `<!-- ${this.lines[0]} -->`, class: 'Comments' };
    }
}
export class Plain extends Element {
    constructor(line: string, at: number, mathced?: [string]) {
        super(1, line, at, { mathced });
    }
    get json() {
        return { tag: 'span', html: `${this.lines[0]}<br>`, class: 'Plain' };
    }
}
export class Header extends Element {
    static camel = str => {
        const match = str.match(/\w+/g);
        if (!match) {
            return `_${str.replace(/[-\s+=)(*&^%$#@!~`}{\]["':;?/><.,\\|]+/g, '')}`;
        }
        const camel = `${match.reduce((str, part) => `${str}${part[0].toUpperCase()}${part.slice(1)}`, '')}`;
        if (/^\d/.test(camel)) {
            return `_${camel}`;
        }
        return `${camel[0].toLowerCase()}${camel.slice(1)}`;
    };
    constructor(line: string, at: number, level: number, content: string) {
        super(1, line, at, { level, content });
        this.level = level;
        this.content = content;
        this.id = Header.camel(content);
    }
    get json() {
        return {
            tag: 'span',
            html: `<span>${this.content}</span><br>`,
            class: `Header Header-${this.level}`,
            'data-markplus-header-level': this.level,
            id: this.id,
        };
    }
}
export class Code extends Element {
    static symbol = ['~~~', '```'];
    constructor(line: string, at: number, symbol?: string, language?: string) {
        super(-1, line, at, { language });
        this.symbol = symbol || line;
        this.language = language || '';
    }
    get json() {
        return {
            tag: 'pre',
            html: this.lines.slice(1, this.size - 1).join('\n'),
            class: `Code Code-${this.language}`,
        };
    }
    push(line: string, at: number) { // eslint-disable-line no-unused-vars
        this.lines.push(line);
        if (line == this.symbol) {
            this.size = this.lines.length;
        }
    }
}
export class Divider extends Element {
    static symbol = ['---', '***'];
    constructor(line: string, at: number) {
        super(1, line, at, {});
        this.style = ['solid', 'dashed'][Divider.symbol.indexOf(line)];
    }
    get json() {
        return { tag: 'span', html: '<br>', class: `Divider Divider-${this.style}` };
    }
}
export class Block extends Element {
    static symbol = '>';
    static regex = /^(>+)\s/;
    constructor(line: string, at: number, indent: number) {
        super(-1, line, at, {});
        this.indents = [indent];
    }
    get json() {
        const fold = (input: []) => {
            const output: [[]] = [];
            input.forEach(({ indent, content }) => {
                if (indent == 1) {
                    output.unshift(content);
                    return;
                }
                if (!(output[0] instanceof Array)) {
                    output.unshift([]);
                }
                output[0].push({ indent: indent - 1, content });
            });
            return output.map(input => input instanceof Array ? fold(input) : input).reverse();
        };
        const folded = fold(this.lines.map((line, index) => {
            const indent = this.indents[index];
            const content = `<span>${line.match(Block.regex) ? line.slice(1 + indent) : line}</span>`;
            return { indent, content };
        }));
        const map = (folded: []) => folded.map(line =>
            line instanceof Array ? `<span class="Block Block-nested">${map(line)}</span>` : `${line}<br>`
        ).join('');
        return { tag: 'span', html: map(folded), class: 'Block' };
    }
    push(line: string, at: number) { // eslint-disable-line no-unused-vars
        if (line == Block.symbol.repeat(this.indents[0])) {
            this.size = this.lines.length;
            return;
        }
        this.lines.push(line);
        const mathced = line.match(Block.regex);
        this.indents.push(mathced ? mathced[1].length : this.indents[this.indents.length - 1]);
    }
    completed(line: string, at: number) {
        if (line == '') {
            this.size = this.lines.length;
        }
        return super.completed(line, at);
    }
}
export class More extends Element {
    static symbol = '^';
    constructor(line: string, at: number, symbol?: string, brief?: string) {
        super(-1, line, at, { brief });
        this.symbol = symbol || line;
        // this.brief = brief || '';
    }
    get json() {
        const html = this.lines.length > 1 ? '' : `<span>${this.brief}</span>`;
        return { tag: 'span', html, class: 'More' };
    }
    completed(line: string, at: number) { // eslint-disable-line no-unused-vars
        if (!line.startsWith('    ')) {
            this.size = this.lines.length;
        }
        return super.completed(line, at);
    }
}

const Parser = {
    Function: {
        body: {
            scopes: {
                nestable: '()[]{}',
                nonested: ['\'\'', '``', '""', ['/*', '*/']],
            },
            regex: /^(\s*\/:?\d+)?(.*)?$/,
            split(body: string) {
                if (!body) {
                    return { args: null, exec: false, hold: null, extra: null };
                }
                const { scopes, regex } = this;
                let args;
                let cursor = 0;
                if (body[cursor] == '(') {
                    let nestableClose = [];
                    let nonestedClose = null;
                    const index = Array.from(body).findIndex((char) => {
                        if (nonestedClose) {
                            if (char == nonestedClose) {
                                nonestedClose = null;
                            }
                            return false;
                        }
                        const nonestedFound = scopes.nonested.find(symbol => symbol[0] == char);
                        if (nonestedFound) {
                            nonestedClose = nonestedFound[1];
                            return false;
                        }
                        const nestableIndex = scopes.nestable.indexOf(char);
                        if (nestableIndex == -1) {
                            return false;
                        }
                        if (nestableIndex % 2 == 0) {
                            nestableClose.unshift(scopes.nestable[1 + nestableIndex]);
                            return false;
                        }
                        if (char != nestableClose[0]) {
                            return false;
                        }
                        nestableClose.shift();
                        return nestableClose.length == 0;
                    });
                    if (index == -1) {
                        return false;
                    }
                    cursor = 1 + index;
                    args = body.slice(0, cursor);
                }
                const matched = body.slice(cursor).match(regex);
                if (matched == null) {
                    return false;
                }
                const [, hold, extra] = matched;
                if (!hold) {
                    if (!extra) {
                        return { args, exec: false };
                    }
                    if (extra[0] == '/') {
                        return { args, exec: true, extra: extra.slice(1) };
                    }
                    if (extra[0] == ' ') {
                        return { args, exec: false, extra: extra.slice(1) };
                    }
                }
                const exec = hold != null && hold[0] == '/';
                return { args, exec, hold: hold && hold.trim(), extra };
            },
        },
        regex: /^([$#])([\w.]+)(.*)?$/,
        pipe(line: string, at: number): Save | Load {
            const match = line.match(this.regex);
            if (match == null) {
                return false;
            }
            const [, type, name, body] = match;
            const splited = this.body.split(body);
            if (!splited) {
                return new Invalid(line, at, `unexpected body(${body}).`);
            }
            const { args, exec, hold, extra } = splited;
            const holdSize =
                hold ?
                    hold[1] == ':' ?
                        parseInt(hold.slice(2)) - at
                        : parseInt(hold.slice(1))
                    : 0;
            if (holdSize < 0) {
                return new Invalid(line, at, `unexpected size(${holdSize}), check: ${hold}.`);
            }
            return new ({ $: Load, '#': Save })[type](
                1 + holdSize,
                line,
                at,
                { name: name == '_' ? 'void' : name, args, exec, extra },
            );
        },
    },
    HTMLElement: {
        enum: {
            mapper: {
                ...Divider.symbol.reduce((o, s) => (o[s] = Divider, o), {}),
                ...Code.symbol.reduce((o, s) => (o[s] = Code, o), {}),
            },
            pipe(line: string, at: number): Element {
                return new (this.mapper[line] || Plain)(line, at);
            },
        },
        regex: /^(\S*)\s(.*)$/,
        pipe(line: string, at: number): Element {
            const matched = line.match(this.regex);
            if (matched == null) {
                return this.enum.pipe(line, at);
            }
            const [, type, content] = matched;
            const length = type.length || 1;
            const pipe = ({
                ...(o => (o['#'.repeat(length)] = () => new Header(line, at, length, content), o))({}),
                ...Code.symbol.reduce((o, s) => (o[s] = () => new Code(line, at, s, content), o), {}),
                ...Array.from(More.symbol).reduce((o, s) => (o[s] = () => new More(line, at, s, content), o), {}),
                ...(o => (o[Block.symbol.repeat(length)] = () => new Block(line, at, length), o))({}),
                '': () => line.startsWith('    ') ? false : new Plain(line, at), // 4 white-space means code.
            })[type];
            if (!pipe) {
                return new Plain(line, at, { type, content });
            }
            return pipe();
        },
    },
    pipe(line: string, at: number): Element {
        return this.Function.pipe(line, at) || this.HTMLElement.pipe(line, at) || new Invalid(line, at, 'Unknown syantax.');
    },
    parse(lines: [string]) {
        const elements = [new Comments('https://github.com/zhengxiaoyao0716/markplus', 0)];
        lines.forEach((line, index) => {
            const at = 1 + index;
            const ele = elements[0];
            if (ele.completed(line, at)) {
                elements.unshift(this.pipe(line, at));
                return;
            }
            ele.push(line, at);
        });
        return elements.reverse();
    },
};
export default Parser;
