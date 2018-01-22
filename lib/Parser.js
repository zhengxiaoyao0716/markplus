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
            return 'const ' + name + (name.startsWith('_') ? '' : ' = this.' + name) + ' = ' + (exec ? '(' + fn + ')()' : fn) + ';';
        }
    }]);

    return Save;
}(Element);

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
                return line instanceof Element ? line.expr || JSON.stringify(_extends({}, line.json, { at: line.at })) : '(\n        ' + line + '\n    )';
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
        _this6.id = Header.camel(content);
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

Header.camel = function (str) {
    var match = str.match(/\w+/g);
    if (!match) {
        return '_' + str.replace(/[-\s+=)(*&^%$#@!~`}{\]["':;?/><.,\\|]+/g, '');
    }
    var camel = '' + match.reduce(function (str, part) {
        return '' + str + part[0].toUpperCase() + part.slice(1);
    }, '');
    if (/^\d/.test(camel)) {
        return '_' + camel;
    }
    return '' + camel[0].toLowerCase() + camel.slice(1);
};

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

        _this8.style = ['solid', 'dashed'][Divider.symbol.indexOf(line)];
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

Divider.symbol = ['---', '***'];

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
            }, {})),
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
        var _this12 = this;

        var elements = [new Comments('https://github.com/zhengxiaoyao0716/markplus', 0)];
        lines.forEach(function (line, index) {
            var at = 1 + index;
            var ele = elements[0];
            if (ele.completed(line, at)) {
                elements.unshift(_this12.pipe(line, at));
                return;
            }
            ele.push(line, at);
        });
        return elements.reverse();
    }
};
exports.default = Parser;
//# sourceMappingURL=Parser.js.map