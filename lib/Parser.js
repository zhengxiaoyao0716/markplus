'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var withEscape = /** @param {(text: string) => (reg: RegExp|string, rep: function) => any} action @param {string} only */
exports.withEscape = function withEscape(action, only) {
    return (/** @param {string} text */function (text) {
            return action(text.replace(/\\(.)/g, function (_, char) {
                return only && only.indexOf(char) == -1 ? '\\' + char : '\\u00' + char.charCodeAt(0).toString(16);
            }))(/\\u([0-9A-Za-z]{4})/g, function (_, code) {
                return '' + String.fromCodePoint(Number.parseInt(code, 16));
            });
        }
    );
};

var Namer = {
    pascal: function pascal(str) {
        var match = str.match(/\w+/g);
        if (!match) {
            return '' + str.replace(/[-\s+=)(*&^%$#@!~`}{\]["':;?/><.,\\|]+/g, '');
        }
        var pascal = '' + match.reduce(function (str, part) {
            return '' + str + part[0].toUpperCase() + part.slice(1);
        }, '');
        if (/^\d/.test(pascal)) {
            return '_' + pascal;
        }
        return pascal;
    },
    camel: function camel(str) {
        var pascal = this.pascal(str);
        return '' + pascal[0].toLowerCase() + pascal.slice(1);
    }
};

var Element = exports.Element = function () {
    function Element(size, line, at, params) {
        _classCallCheck(this, Element);

        this.type = this.constructor.name;
        this.size = size;
        var lines = [line];
        this.lines = lines;
        this.params = params;
        this.at = at;
    }

    _createClass(Element, [{
        key: 'push',
        value: function push(line, at) {
            // eslint-disable-line no-unused-vars
            this.lines.push(line);
        }
    }, {
        key: 'completed',
        value: function completed(line, at) {
            // eslint-disable-line no-unused-vars
            return this.size == this.lines.length;
        }
    }, {
        key: 'dump',
        value: function dump() {
            return 'Markplus.register(' + this.at + ', ' + JSON.stringify(_extends({}, this.json)) + ');';
        }
    }, {
        key: 'json',
        get: function get() {
            return this;
        }
    }]);

    return Element;
}();

var Invalid = exports.Invalid = function (_Element) {
    _inherits(Invalid, _Element);

    function Invalid(line, at, reason) {
        _classCallCheck(this, Invalid);

        return _possibleConstructorReturn(this, (Invalid.__proto__ || Object.getPrototypeOf(Invalid)).call(this, 1, line, at, { reason: reason }));
    }

    _createClass(Invalid, [{
        key: 'dump',
        value: function dump() {
            return 'console.error(' + JSON.stringify(this) + ');';
        }
    }]);

    return Invalid;
}(Element);

var Save = exports.Save = function (_Element2) {
    _inherits(Save, _Element2);

    function Save() {
        _classCallCheck(this, Save);

        return _possibleConstructorReturn(this, (Save.__proto__ || Object.getPrototypeOf(Save)).apply(this, arguments));
    }

    _createClass(Save, [{
        key: 'push',
        value: function push(line, at) {
            // eslint-disable-line no-unused-vars
            var splited = Parser.Function.body.split(line.trim());
            if (!splited) {
                this.lines.push(new Invalid(line, at, 'child function of (' + this.params.name + ') syntax invalid.'));
                return;
            }
            var args = splited.args,
                exec = splited.exec,
                hold = splited.hold,
                extra = splited.extra;

            if (exec) {
                this.lines.push(new Invalid(line, at, 'multi-lines functions cannot have immediately child function.'));
                return;
            }
            if (hold) {
                this.lines.push(new Invalid(line, at, 'nested multi-lines functions not support.'));
                return;
            }
            this.lines.push(new Save(1, line, at, { args: args, extra: extra }));
        }
    }, {
        key: 'dump',
        value: function dump() {
            var _params = this.params,
                name = _params.name,
                args = _params.args,
                exec = _params.exec,
                _params$extra = _params.extra,
                extra = _params$extra === undefined ? '' : _params$extra;

            var lines = this.size == 1 ? '' : '    ' + ['let result;'].concat(_toConsumableArray(this.lines.slice(1).map(function (ele) {
                return ele instanceof Invalid ? '() => ' + ele.dump() : ele.params;
            }).map(function (_ref) {
                var args = _ref.args,
                    _ref$extra = _ref.extra,
                    extra = _ref$extra === undefined ? '' : _ref$extra;
                return 'result = (' + (args || '()') + ' => (\n        ' + extra + '\n    ))(result);';
            }))).join('\n    ') + '\n';
            var linesResult = this.size == 1 ? '' : 'result';
            var fn = 'function ' + (args || '()') + ' {\n' + lines + '    return (\n        ' + linesResult + extra + '\n    );\n}';
            return Save.save(name, exec ? '(' + fn + ')()' : fn);
        }
    }]);

    return Save;
}(Element);

Save.save = function (name, content) {
    return 'const ' + name + (name.startsWith('_') ? '' : ' = this.' + name) + ' = ' + content + ';';
};

var Load = exports.Load = function (_Element3) {
    _inherits(Load, _Element3);

    function Load() {
        _classCallCheck(this, Load);

        return _possibleConstructorReturn(this, (Load.__proto__ || Object.getPrototypeOf(Load)).apply(this, arguments));
    }

    _createClass(Load, [{
        key: 'push',
        value: function push(line, at) {
            // eslint-disable-line no-unused-vars
            if (!this.params.exec) {
                this.lines.push(line);
                return;
            }
            if (this.lastLine instanceof Element && !this.lastLine.completed(line, at)) {
                this.lastLine.push(line, at);
                this.size--;
                return;
            }
            var ele = Parser.Function.pipe(line, at) || Parser.HTMLElement.pipe(line, at);
            if (!ele || ele instanceof Save) {
                this.lines.push(line.slice(4));
                return;
            }
            this.lines.push(ele);
        }
    }, {
        key: 'dump',
        value: function dump() {
            return 'Markplus.register(' + this.at + ', ' + this.expr + ');';
        }
        // completed(line: string, at: number) { // eslint-disable-line no-unused-vars
        //     if (this.lastLine instanceof Element && !this.lastLine.completed(line, at)) {
        //         return false;
        //     }
        //     return super.completed(line, at);
        // }

    }, {
        key: 'expr',
        get: function get() {
            var _params2 = this.params,
                name = _params2.name,
                args = _params2.args,
                exec = _params2.exec,
                _params2$extra = _params2.extra,
                extra = _params2$extra === undefined ? '' : _params2$extra;

            var lines = this.size == 1 ? '' : this.lines.slice(1).map(exec ? function (line) {
                return line instanceof Element ? line.__proto__.hasOwnProperty('expr') ? line.expr.replace(/\r?\n/g, '\n    ') : JSON.stringify(_extends({}, line.json, { at: line.at })) : '(\n        ' + line + '\n    )';
            } : JSON.stringify).join(',\n    ');
            return (args ? name + '.bind' + args : name) + '(\n    ' + lines + extra + '\n)';
        }
    }, {
        key: 'lastLine',
        get: function get() {
            return this.lines[this.lines.length - 1];
        }
    }]);

    return Load;
}(Element);

var Comments = exports.Comments = function (_Element4) {
    _inherits(Comments, _Element4);

    function Comments(line, at) {
        _classCallCheck(this, Comments);

        return _possibleConstructorReturn(this, (Comments.__proto__ || Object.getPrototypeOf(Comments)).call(this, 1, line, at, null));
    }

    _createClass(Comments, [{
        key: 'json',
        get: function get() {
            return { tag: 'span', html: '<!-- ' + this.lines[0] + ' -->', class: 'Comments' };
        }
    }]);

    return Comments;
}(Element);

var Plain = exports.Plain = function (_Element5) {
    _inherits(Plain, _Element5);

    function Plain(line, at, mathced) {
        _classCallCheck(this, Plain);

        return _possibleConstructorReturn(this, (Plain.__proto__ || Object.getPrototypeOf(Plain)).call(this, 1, line, at, { mathced: mathced }));
    }

    _createClass(Plain, [{
        key: 'json',
        get: function get() {
            return { tag: 'span', html: this.lines[0] + '<br>', class: 'Plain' };
        }
    }]);

    return Plain;
}(Element);

var Header = exports.Header = function (_Element6) {
    _inherits(Header, _Element6);

    function Header(line, at, level, content) {
        _classCallCheck(this, Header);

        var _this6 = _possibleConstructorReturn(this, (Header.__proto__ || Object.getPrototypeOf(Header)).call(this, 1, line, at, { level: level, content: content }));

        _this6.level = level;
        _this6.content = content;
        _this6.id = Namer.camel(content);
        return _this6;
    }

    _createClass(Header, [{
        key: 'json',
        get: function get() {
            return {
                tag: 'span',
                html: '<span>' + this.content + '</span><br>',
                class: 'Header Header-' + this.level,
                'data-markplus-header-level': this.level,
                id: this.id
            };
        }
    }]);

    return Header;
}(Element);

var Code = exports.Code = function (_Element7) {
    _inherits(Code, _Element7);

    function Code(line, at, symbol, language) {
        _classCallCheck(this, Code);

        var _this7 = _possibleConstructorReturn(this, (Code.__proto__ || Object.getPrototypeOf(Code)).call(this, -1, line, at, { language: language }));

        _this7.symbol = symbol || line;
        _this7.language = language || '';
        return _this7;
    }

    _createClass(Code, [{
        key: 'push',
        value: function push(line, at) {
            // eslint-disable-line no-unused-vars
            this.lines.push(line);
            if (line == this.symbol) {
                this.size = this.lines.length;
            }
        }
    }, {
        key: 'json',
        get: function get() {
            return {
                tag: 'pre',
                html: this.lines.slice(1, this.size - 1).join('\n'),
                class: 'Code Code-' + this.language
            };
        }
    }]);

    return Code;
}(Element);

Code.symbol = ['~~~', '```'];

var Divider = exports.Divider = function (_Element8) {
    _inherits(Divider, _Element8);

    function Divider(line, at) {
        _classCallCheck(this, Divider);

        var _this8 = _possibleConstructorReturn(this, (Divider.__proto__ || Object.getPrototypeOf(Divider)).call(this, 1, line, at, {}));

        _this8.style = ['solid', 'dashed', 'bold'][Divider.symbol.indexOf(line)];
        return _this8;
    }

    _createClass(Divider, [{
        key: 'json',
        get: function get() {
            return { tag: 'span', html: '<br>', class: 'Divider Divider-' + this.style };
        }
    }]);

    return Divider;
}(Element);

Divider.symbol = ['---', '***', '==='];

var Block = exports.Block = function (_Element9) {
    _inherits(Block, _Element9);

    function Block(line, at, indent) {
        _classCallCheck(this, Block);

        var _this9 = _possibleConstructorReturn(this, (Block.__proto__ || Object.getPrototypeOf(Block)).call(this, -1, line, at, {}));

        _this9.indents = [indent];
        return _this9;
    }

    _createClass(Block, [{
        key: 'push',
        value: function push(line, at) {
            // eslint-disable-line no-unused-vars
            if (line == Block.symbol.repeat(this.indents[0])) {
                this.size = this.lines.length;
                return;
            }
            this.lines.push(line);
            var mathced = line.match(Block.regex);
            this.indents.push(mathced ? mathced[1].length : this.indents[this.indents.length - 1]);
        }
    }, {
        key: 'completed',
        value: function completed(line, at) {
            if (line == '') {
                this.size = this.lines.length;
            }
            return _get(Block.prototype.__proto__ || Object.getPrototypeOf(Block.prototype), 'completed', this).call(this, line, at);
        }
    }, {
        key: 'json',
        get: function get() {
            var _this10 = this;

            var fold = function fold(input) {
                var output = [];
                input.forEach(function (_ref2) {
                    var indent = _ref2.indent,
                        content = _ref2.content;

                    if (indent == 1) {
                        output.unshift(content);
                        return;
                    }
                    if (!(output[0] instanceof Array)) {
                        output.unshift([]);
                    }
                    output[0].push({ indent: indent - 1, content: content });
                });
                return output.map(function (input) {
                    return input instanceof Array ? fold(input) : input;
                }).reverse();
            };
            var folded = fold(this.lines.map(function (line, index) {
                var indent = _this10.indents[index];
                var content = '<span>' + (line.match(Block.regex) ? line.slice(1 + indent) : line) + '</span>';
                return { indent: indent, content: content };
            }));
            var map = function map(folded) {
                return folded.map(function (line) {
                    return line instanceof Array ? '<span class="Block Block-nested">' + map(line) + '</span>' : line + '<br>';
                }).join('');
            };
            return { tag: 'span', html: map(folded), class: 'Block' };
        }
    }]);

    return Block;
}(Element);

Block.symbol = '>';
Block.regex = /^(>+)\s/;

var More = exports.More = function (_Element10) {
    _inherits(More, _Element10);

    function More(line, at, symbol, brief) {
        _classCallCheck(this, More);

        var _this11 = _possibleConstructorReturn(this, (More.__proto__ || Object.getPrototypeOf(More)).call(this, -1, line, at, { brief: brief }));

        _this11.symbol = symbol || line;
        // this.brief = brief || '';
        return _this11;
    }

    _createClass(More, [{
        key: 'completed',
        value: function completed(line, at) {
            // eslint-disable-line no-unused-vars
            if (!line.startsWith('    ')) {
                this.size = this.lines.length;
            }
            return _get(More.prototype.__proto__ || Object.getPrototypeOf(More.prototype), 'completed', this).call(this, line, at);
        }
    }, {
        key: 'json',
        get: function get() {
            var html = this.lines.length > 1 ? '' : '<span>' + this.brief + '</span>';
            return { tag: 'span', html: html, class: 'More' };
        }
    }]);

    return More;
}(Element);

More.symbol = '^';

var Table = exports.Table = function (_Element11) {
    _inherits(Table, _Element11);

    function Table(line, at, content) {
        _classCallCheck(this, Table);

        var _this12 = _possibleConstructorReturn(this, (Table.__proto__ || Object.getPrototypeOf(Table)).call(this, -1, line, at));

        _initialiseProps.call(_this12);

        _this12.body = [];
        if (!content) {
            return _possibleConstructorReturn(_this12);
        }
        var splited = Table.split(content);
        if (splited == null) {
            _this12.name = content.trim();
            return _possibleConstructorReturn(_this12);
        }
        _this12.pushHead(splited);
        return _this12;
    }

    _createClass(Table, [{
        key: 'dump',
        value: function dump() {
            var _this13 = this;

            var aligns = this.head.map(function (_ref3) {
                var _ref4 = _slicedToArray(_ref3, 2),
                    align = _ref4[1];

                return align;
            });
            this.align.forEach(function (align, index) {
                return aligns[index] = align;
            });
            var rows = new Array(this.body.length).fill().map(function () {
                return new Array(_this13.head.length).fill();
            });
            this.body.forEach(function (row, ri) {
                return row.reduce(function (ci, text) {
                    var offset = rows[ri].slice(ci).findIndex(function (grid) {
                        return grid == null;
                    });
                    var index = offset == -1 ? rows[ri].length : ci + offset;
                    var align = aligns[index];

                    var _text$match = text.match(Table.regGrid),
                        _text$match2 = _slicedToArray(_text$match, 4),
                        type = _text$match2[1],
                        span = _text$match2[2],
                        _text$match2$ = _text$match2[3],
                        content = _text$match2$ === undefined ? '' : _text$match2$;

                    var macro = type == '#';
                    if (!span) {
                        rows[ri][index] = { align: align, macro: macro, content: content };
                        return 1 + index;
                    }
                    var grid = macro ? { align: align, macro: macro, content: content } : { refer: ':nth-child(' + (1 + ri) + ')>:nth-child(' + (1 + index) + ')' };

                    var _span$match = span.match(Table.regSpan),
                        _span$match2 = _slicedToArray(_span$match, 3),
                        rs = _span$match2[1],
                        cs = _span$match2[2];

                    rows.slice(ri, ri + (rs ? parseInt(rs) : 1)).forEach(function (row) {
                        return new Array(cs ? parseInt(cs) : 1).fill().forEach(function (_, si) {
                            return row[index + si] = grid;
                        });
                    });
                    macro || (rows[ri][index] = { align: align, macro: macro, content: content, rowspan: rs && ' rowspan="' + rs + '"', colspan: cs && ' colspan="' + cs + '"' });
                    return 1 + index;
                }, 0);
            });

            var names = function (set) {
                _this13.head.forEach(function (_ref5, index) {
                    var _ref6 = _slicedToArray(_ref5, 1),
                        text = _ref6[0];

                    var name = Namer.pascal(text || Array.from(index.toString(26)).map(function (c) {
                        return c.charCodeAt(0);
                    }).map(function (c) {
                        return c < 65 ? c + 49 : c + 10;
                    }).map(function (c) {
                        return String.fromCharCode(c);
                    }).join('').toUpperCase());
                    set.add(set.has(name) ? name + '_' + index : name);
                });
                return Array.from(set);
            }(new Set());
            var macros = [];
            var addMacro = function addMacro(content, row, col) {
                var name = names[col] + '_' + row;
                var replaced = withEscape(function (text) {
                    return function (reg, rep) {
                        return text.replace(Table.regMacro, '${$1[' + row + ']}').replace(reg, rep);
                    };
                })(content);
                var expr = '(' + names.join(', ') + ') => { const L = ' + row + '; return `' + replaced + '`; }';
                macros.push([name, expr]);
                return name;
            };

            var name = this.name ? '<tr><td align="center" colspan="' + this.head.length + '">' + this.name + '</td></tr>' : '';
            var head = '<tr>' + this.head.map(function (_ref7, index) {
                var _ref8 = _slicedToArray(_ref7, 2),
                    text = _ref8[0],
                    align = _ref8[1];

                return '<th' + align + '>' + (text || '(' + names[index] + ')') + '</th>';
            }).join('') + '</tr>';
            var body = rows.map(function (row, ri) {
                return '<tr>' + row.map(function (grid) {
                    return grid || {};
                }).map(function (_ref9, ci) {
                    var refer = _ref9.refer,
                        align = _ref9.align,
                        macro = _ref9.macro,
                        _ref9$content = _ref9.content,
                        content = _ref9$content === undefined ? '' : _ref9$content,
                        rowspan = _ref9.rowspan,
                        colspan = _ref9.colspan;
                    return refer ? '<td style="display: none;" data-markplus-table-ref="' + refer + '"></td>' : macro ? function (name) {
                        return '<th' + (align || '') + ' data-markplus-table-macro="' + name + '">#' + name + '</th>';
                    }(addMacro(content.trim(), ri, ci)) : '<td' + (align || '') + (rowspan || '') + (colspan || '') + '>' + content.trim() + '</td>';
                }).join('') + '</tr>';
            }).join('');
            var html = '<table><thead>' + head + '</thead><tbody>' + body + '</tbody><tfoot>' + name + '</tfoot></table>';

            var id = Namer.camel(this.name || '_' + this.at);
            var json = _extends({ tag: 'span', html: html, class: 'Table' }, this.name && { id: id }, { names: names });
            var parser = this.head.map(function (_ref10) {
                var _ref11 = _slicedToArray(_ref10, 3),
                    parser = _ref11[2];

                return parser;
            }).join(', ');
            var macro = macros.map(function (_ref12) {
                var _ref13 = _slicedToArray(_ref12, 2),
                    name = _ref13[0],
                    expr = _ref13[1];

                return '[\'' + name + '\', ' + expr + ']';
            }).join(', ');
            return Save.save(id, '{}') + '\nMarkplus.register(' + this.at + ', { ...' + JSON.stringify(_extends({}, json)) + ', parser: [' + parser + '], macro: [' + macro + '], table: ' + id + ' });';
        }
    }, {
        key: 'push',
        value: function push(line, at) {
            // eslint-disable-line no-unused-vars
            this.lines.push(line);
            if (line == '\\') {
                this.size = this.lines.length;
                return;
            }
            var splited = Table.split(line);
            if (splited == null) {
                return;
            }
            if (!this.head) {
                this.pushHead(splited);
                return;
            }
            if (!this.align) {
                this.pushAlign(splited);
                return;
            }
            this.pushBody(splited);
        }
    }, {
        key: 'completed',
        value: function completed(line, at) {
            if (line == '') {
                this.size = this.lines.length;
            }
            return _get(Table.prototype.__proto__ || Object.getPrototypeOf(Table.prototype), 'completed', this).call(this, line, at);
        }
    }]);

    return Table;
}(Element);

Table.split = withEscape(function (text) {
    var reg = /\||#/g;
    var split = /** @param {[[]]} seps */function split(seps) {
        var result = reg.exec(text);
        var last = seps.pop();
        return result ? split(last ? [].concat(_toConsumableArray(seps), [text.slice(last.index, result.index), result]) : [result]) : last ? [].concat(_toConsumableArray(seps), [text.slice(last.index)]) : null;
    };
    var seps = split([]);
    return function (reg, rep) {
        return seps ? seps.map(function (text) {
            return text.replace(reg, rep);
        }) : null;
    };
}, '|#');
Table.regHead = /^([^(]*)(\(.*\))?$/;
Table.regGrid = /^(\||#)(\d*\\\d*\s)?(.*)$/;
Table.regSpan = /^(\d*)\\(\d*)\s$/;
Table.regMacro = /\$(\w+)/g;

var _initialiseProps = function _initialiseProps() {
    var _this15 = this;

    this.pushHead = function (splited) {
        _this15.head = splited.map(function (t) {
            return t.slice(1);
        }).map(function (t) {
            return [t, { '+': 'left', ':': 'center', '-': 'right' }[t[0]]];
        }).map(function (_ref14) {
            var _ref15 = _slicedToArray(_ref14, 2),
                text = _ref15[0],
                align = _ref15[1];

            return [(align ? text.slice(1) : text).trim(), align ? ' align="' + align + '"' : ''];
        }).map(function (_ref16) {
            var _ref17 = _slicedToArray(_ref16, 2),
                text = _ref17[0],
                align = _ref17[1];

            var matched = text.match(Table.regHead);
            if (!matched) {
                return [text, align];
            }

            var _matched3 = _slicedToArray(matched, 3),
                name = _matched3[1],
                parser = _matched3[2];

            return [name, align, parser];
        });
    };

    this.pushAlign = function (splited) {
        var matched = splited.map(function (t) {
            return t.match(/\s*(:?)-+(:?)\s*/);
        });
        if (matched.some(function (m) {
            return m == null;
        })) {
            _this15.align = [];
            _this15.pushBody(splited);
            return;
        }
        _this15.align = matched.map(function (m) {
            return m[1] + ',' + m[2];
        }).map(function (se) {
            return { ':,': 'left', ':,:': 'center', ',:': 'right' }[se];
        }).map(function (align) {
            return align ? ' align="' + align + '"' : '';
        });
    };

    this.pushBody = function (splited) {
        var row = splited;
        _this15.body.push(row);
    };
};

var Parser = {
    Function: {
        body: {
            scopes: {
                nestable: '()[]{}',
                nonested: ['\'\'', '``', '""', ['/*', '*/']]
            },
            regex: /^(\s*\/:?\d+)?(.*)?$/,
            split: function split(body) {
                if (!body) {
                    return { args: null, exec: false, hold: null, extra: null };
                }
                var scopes = this.scopes,
                    regex = this.regex;

                var args = void 0;
                var cursor = 0;
                if (body[cursor] == '(') {
                    var nestableClose = [];
                    var nonestedClose = null;
                    var index = Array.from(body).findIndex(function (char) {
                        if (nonestedClose) {
                            if (char == nonestedClose) {
                                nonestedClose = null;
                            }
                            return false;
                        }
                        var nonestedFound = scopes.nonested.find(function (symbol) {
                            return symbol[0] == char;
                        });
                        if (nonestedFound) {
                            nonestedClose = nonestedFound[1];
                            return false;
                        }
                        var nestableIndex = scopes.nestable.indexOf(char);
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
                var matched = body.slice(cursor).match(regex);
                if (matched == null) {
                    return false;
                }

                var _matched = _slicedToArray(matched, 3),
                    hold = _matched[1],
                    extra = _matched[2];

                if (!hold) {
                    if (!extra) {
                        return { args: args, exec: false };
                    }
                    if (extra[0] == '/') {
                        return { args: args, exec: true, extra: extra.slice(1) };
                    }
                    if (extra[0] == ' ') {
                        return { args: args, exec: false, extra: extra.slice(1) };
                    }
                }
                var exec = hold != null && hold[0] == '/';
                return { args: args, exec: exec, hold: hold && hold.trim(), extra: extra };
            }
        },
        regex: /^([$#])([\w.]+)(.*)?$/,
        pipe: function pipe(line, at) {
            var match = line.match(this.regex);
            if (match == null) {
                return false;
            }

            var _match = _slicedToArray(match, 4),
                type = _match[1],
                name = _match[2],
                body = _match[3];

            var splited = this.body.split(body);
            if (!splited) {
                return new Invalid(line, at, 'unexpected body(' + body + ').');
            }
            var args = splited.args,
                exec = splited.exec,
                hold = splited.hold,
                extra = splited.extra;

            var holdSize = hold ? hold[1] == ':' ? parseInt(hold.slice(2)) - at : parseInt(hold.slice(1)) : 0;
            if (holdSize < 0) {
                return new Invalid(line, at, 'unexpected size(' + holdSize + '), check: ' + hold + '.');
            }
            return new { $: Load, '#': Save }[type](1 + holdSize, line, at, { name: name == '_' ? 'void' : name, args: args, exec: exec, extra: extra });
        }
    },
    HTMLElement: {
        enum: {
            mapper: _extends({}, Divider.symbol.reduce(function (o, s) {
                return o[s] = Divider, o;
            }, {}), Code.symbol.reduce(function (o, s) {
                return o[s] = Code, o;
            }, {}), {
                '\\': Table
            }),
            pipe: function pipe(line, at) {
                return new (this.mapper[line] || Plain)(line, at);
            }
        },
        regex: /^(\S*)\s(.*)$/,
        pipe: function pipe(line, at) {
            var matched = line.match(this.regex);
            if (matched == null) {
                return this.enum.pipe(line, at);
            }

            var _matched2 = _slicedToArray(matched, 3),
                type = _matched2[1],
                content = _matched2[2];

            var length = type.length || 1;
            var pipe = _extends({}, function (o) {
                return o['#'.repeat(length)] = function () {
                    return new Header(line, at, length, content);
                }, o;
            }({}), Code.symbol.reduce(function (o, s) {
                return o[s] = function () {
                    return new Code(line, at, s, content);
                }, o;
            }, {}), Array.from(More.symbol).reduce(function (o, s) {
                return o[s] = function () {
                    return new More(line, at, s, content);
                }, o;
            }, {}), function (o) {
                return o[Block.symbol.repeat(length)] = function () {
                    return new Block(line, at, length);
                }, o;
            }({}), {
                '\\': function _() {
                    return new Table(line, at, content);
                },
                '': function _() {
                    return line.startsWith('    ') ? false : new Plain(line, at);
                } // 4 white-space means code.
            })[type];
            if (!pipe) {
                return new Plain(line, at, { type: type, content: content });
            }
            return pipe();
        }
    },
    pipe: function pipe(line, at) {
        return this.Function.pipe(line, at) || this.HTMLElement.pipe(line, at) || new Invalid(line, at, 'Unknown syantax.');
    },
    parse: function parse(lines) {
        var _this14 = this;

        var elements = [new Comments('https://github.com/zhengxiaoyao0716/markplus', 0)];
        lines.forEach(function (line, index) {
            var at = 1 + index;
            var ele = elements[0];
            if (ele.completed(line, at)) {
                elements.unshift(_this14.pipe(line, at));
                return;
            }
            ele.push(line, at);
        });
        return elements.reverse();
    }
};
exports.default = Parser;
//# sourceMappingURL=Parser.js.map