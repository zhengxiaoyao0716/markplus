'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Element = exports.Element = function () {
    function Element(size, line, params, at) {
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
            return 'register(' + this.at + ', ' + JSON.stringify(this.json) + ');';
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

    function Invalid(line, reason, at) {
        _classCallCheck(this, Invalid);

        return _possibleConstructorReturn(this, (Invalid.__proto__ || Object.getPrototypeOf(Invalid)).call(this, 1, line, { reason: reason }, at));
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
                this.lines.push(new Invalid(line, 'child function of (' + this.params.name + ') syntax invalid.'));
                return;
            }
            var args = splited.args,
                exec = splited.exec,
                hold = splited.hold,
                extra = splited.extra;

            if (exec) {
                this.lines.push(new Invalid(line, 'multi-lines functions cannot have immediately child function.'));
                return;
            }
            if (hold) {
                this.lines.push(new Invalid(line, 'nested multi-lines functions not support.'));
                return;
            }
            this.lines.push(new Save(1, line, { args: args, extra: extra }, at));
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
            return (name.startsWith('_') ? '' : 'export ') + 'const ' + name + ' = ' + (exec ? '(' + fn + ')()' : fn) + ';';
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
            var ele = Parser.HTMLElement.pipe(line, at);
            if (!ele) {
                this.lines.push(line.slice(4));
                return;
            }
            this.lines.push(ele);
        }
    }, {
        key: 'dump',
        value: function dump() {
            var _params2 = this.params,
                name = _params2.name,
                args = _params2.args,
                exec = _params2.exec,
                _params2$extra = _params2.extra,
                extra = _params2$extra === undefined ? '' : _params2$extra;

            var lines = this.size == 1 ? '' : this.lines.slice(1).map(exec ? function (line) {
                return line instanceof Element ? '' + JSON.stringify(line.json) : line;
            } : function (line) {
                return '' + JSON.stringify(line);
            }).join(',\n    ');
            var expr = (args ? name + '.bind' + args : name) + '(\n    ' + lines + extra + '\n)';
            return 'register(' + this.at + ', ' + expr + ');';
        }
    }]);

    return Load;
}(Element);

var Comments = exports.Comments = function (_Element4) {
    _inherits(Comments, _Element4);

    function Comments(line, at) {
        _classCallCheck(this, Comments);

        return _possibleConstructorReturn(this, (Comments.__proto__ || Object.getPrototypeOf(Comments)).call(this, 1, line, null, at));
    }

    _createClass(Comments, [{
        key: 'json',
        get: function get() {
            return { tag: 'span', html: '<!-- ' + this.lines[0] + ' -->' };
        }
    }]);

    return Comments;
}(Element);

var Plain = exports.Plain = function (_Element5) {
    _inherits(Plain, _Element5);

    function Plain(line, at) {
        _classCallCheck(this, Plain);

        return _possibleConstructorReturn(this, (Plain.__proto__ || Object.getPrototypeOf(Plain)).call(this, 1, line, null, at));
    }

    _createClass(Plain, [{
        key: 'dump',
        value: function dump() {
            return 'register(' + this.at + ', { tag: \'span\', html: \'' + this.lines[0] + '<br>\' });';
        }
    }, {
        key: 'json',
        get: function get() {
            return { tag: 'span', html: this.lines[0] + '<br>', class: 'Plain' };
        }
    }]);

    return Plain;
}(Element);

var Header = exports.Header = function (_Element6) {
    _inherits(Header, _Element6);

    function Header(line, level, content, at) {
        _classCallCheck(this, Header);

        var _this6 = _possibleConstructorReturn(this, (Header.__proto__ || Object.getPrototypeOf(Header)).call(this, 1, line, { level: level, content: content }, at));

        _this6.level = level;
        _this6.content = content;
        return _this6;
    }

    _createClass(Header, [{
        key: 'json',
        get: function get() {
            return { tag: 'span', html: this.lines[0] + '<br>', class: 'Header Header-' + this.level, 'data-markplus-header-level': this.level };
        }
    }]);

    return Header;
}(Element);

var Parser = {
    Function: {
        body: {
            scopes: {
                nestable: '()[]{}',
                nonested: ['\'\'', '``', '""', ['/*', '*/']]
            },
            regex: /^(\s*\/:?\d+)?(.*)?$/,
            split: function split(body) {
                var scopes = this.scopes,
                    regex = this.regex;

                var args = void 0;
                var cursor = 0;
                if (body[cursor] == '(') {
                    var nestableClose = [];
                    var nonestedClose = null;
                    var index = Array.from(body).findIndex(function (char, index) {
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
                    args = body.slice(0, 1 + cursor);
                }
                var matched = body.slice(cursor).match(regex);
                if (matched == null) {
                    return false;
                }

                var _matched = _slicedToArray(matched, 3),
                    hold = _matched[1],
                    extra = _matched[2];

                if (!hold) {
                    if (extra[0] == '/') {
                        return { args: args, exec: true, hold: null, extra: extra.slice(1) };
                    }
                    if (extra[0] == ' ') {
                        return { args: args, exec: false, hold: null, extra: extra.slice(1) };
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
                return new Invalid(line, 'unexpected body(' + body + ') ', at);
            }
            var args = splited.args,
                exec = splited.exec,
                hold = splited.hold,
                extra = splited.extra;

            var holdSize = hold ? hold[1] == ':' ? parseInt(hold.slice(2)) - at : parseInt(hold.slice(1)) : 0;
            if (holdSize < 0) {
                return new Invalid(line, 'unexpected size(' + holdSize + '), check: ' + hold + ' ', at);
            }
            return new { $: Load, '#': Save }[type](1 + holdSize, line, { name: name == '_' ? 'void' : name, args: args, exec: exec, extra: extra }, at);
        }
    },
    HTMLElement: {
        regex: /^(\S*)\s(.*)$/,
        pipe: function pipe(line, at) {
            var match = line.match(this.regex);
            if (match == null) {
                return new Plain(line, at);
            }

            var _match2 = _slicedToArray(match, 3),
                type = _match2[1],
                content = _match2[2];

            var pipe = _extends({}, function (o) {
                return o['#'.repeat(type.length || 1)] = function (content) {
                    return new Header(line, type.length, content, at);
                }, o;
            }({}), {
                '': function _() {
                    return line.startsWith('    ') ? false : new Plain(line, at);
                } // 4 white-space means code.
            })[type];
            if (!pipe) {
                return new Plain(line, at);
            }
            return pipe(content);
        }
    },
    pipe: function pipe(line, at) {
        return this.Function.pipe(line, at) || this.HTMLElement.pipe(line, at) || new Invalid(line, 'Unknown syantax.', at);
    },
    parse: function parse(lines) {
        var _this7 = this;

        var elements = [new Comments('https://github.com/zhengxiaoyao0716/markplus', 0)];
        lines.forEach(function (line, index) {
            var at = 1 + index;
            var ele = elements[0];
            if (ele.completed(line, at)) {
                elements.unshift(_this7.pipe(line, at));
                return;
            }
            ele.push(line, at);
        });
        return elements.reverse();
    }
};
exports.default = Parser;
//# sourceMappingURL=Parser.js.map