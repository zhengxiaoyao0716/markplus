'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _Parser = require('./Parser');

var Types = _interopRequireWildcard(_Parser);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var withEscape = _fs2.default.readFileSync(_path2.default.join(__dirname, './../src/Parser.js'), 'utf-8').split(/\r?\n/).slice(0, 5).join('\n');
var Render = _fs2.default.readFileSync(_path2.default.join(__dirname, './../src/Render.js'), 'utf-8');
var polyfill = 'window.Promise || document.writeln(\'<script src="https://cdn.jsdelivr.net/npm/babel-polyfill@6.26.0/dist/polyfill.min.js"><\' + \'/script>\');';
var CorePlugin = function CorePlugin(self, pkg) {
    if (typeof self.name != 'string') {
        var firstH1 = self.elements.find(function (ele) {
            return ele instanceof Types.Header && ele.level == 1;
        });
        if (!firstH1 && self.name instanceof Function) {
            self.name = self.name();
        } else {
            var name = firstH1 ? firstH1.id : '_' + new Date().getTime();
            self.name = '' + name[0].toUpperCase() + name.slice(1);
        }
    }
    return {
        head: function head() {
            return ['<!DOCTYPE html>', '<!-- Markplus: ' + self.name + ' -->', '<meta charset="UTF-8">', '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, shrink-to-fit=no">', '<title>' + self.name + '</title>', '<script>' + polyfill + '</script>'].join('\n');
        },
        code: function code() {
            return withEscape + '\n' + Render + 'export const version = \'' + pkg.version + '\';\n';
        },
        dump: function dump() {
            return ('\n            import * as Markplus from \'Markplus\';\n            const { default: render, ...extra } = Markplus;\n            export default class {\n                constructor(container) {\n                    render(container, ctx => this.render({ ...ctx, ...extra }));\n                }\n                render(Markplus) {\n                    ' + self.elements.map(function (ele) {
                return ele.dump();
            }).join('\n').replace(/\r?\n/g, '\n' + ' '.repeat(4 * 5)) + '\n                }\n            };\n        ').replace(/\r?\n {12}/g, '\n');
        }
    };
};
var corePlugins = [[CorePlugin, require('./../package.json')], require('./plugin/render-promise').default, require('./plugin/render-table').default, require('./plugin/style-default').default];

var Markplus = function Markplus(elements, name, opts) {
    var _this = this;

    _classCallCheck(this, Markplus);

    _initialiseProps.call(this);

    this.elements = elements;
    this.name = name;

    this.plugin = function () {
        var pluginNames = new Set();
        var plugins = [].concat(corePlugins, _toConsumableArray(opts.plugin || [])).map(function (payload) {
            var _ref = payload instanceof Array ? payload : [payload],
                _ref2 = _toArray(_ref),
                nameOrPlugin = _ref2[0],
                args = _ref2.slice(1);

            var plugin = nameOrPlugin instanceof Function ? nameOrPlugin : require('markplus-plugin-' + nameOrPlugin).default;
            var name = plugin.name;
            if (!name) {
                throw new Error('Invalid plugin.');
            }
            if (pluginNames.has(name)) {
                console.warn(new Error('plugin name (' + name + ') conflict.').stack.replace(/^Error/, 'Warning')); // eslint-disable-line no-console
            }
            pluginNames.add(name);
            return plugin.apply(undefined, [_this].concat(_toConsumableArray(args)));
        });
        return function (action) {
            return plugins.map(function (p) {
                return p[action] && p[action]();
            }).filter(function (code) {
                return code != null;
            });
        };
    }();
};

Markplus.from = function (content, name, opts) {
    return new Promise(function (resolve, reject) {
        var elements = Types.default.parse(content);
        resolve(new Markplus(elements, name || '', opts || {}));
    });
};

var _initialiseProps = function _initialiseProps() {
    var _this2 = this;

    this.head = function () {
        return _this2.plugin('head').join('\n\n') + '\n';
    };

    this.code = function () {
        return _this2.plugin('code').join('\n\n') + '\n';
    };

    this.dump = function () {
        return _this2.plugin('dump').join('\n\n') + '\n';
    };

    this.__dirname = __dirname;
};

exports.default = Markplus;
//# sourceMappingURL=core.js.map