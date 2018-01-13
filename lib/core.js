'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.use = undefined;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _Parser = require('./Parser');

var Types = _interopRequireWildcard(_Parser);

var _renderCode = require('./plugin/render-code');

var _renderCode2 = _interopRequireDefault(_renderCode);

var _renderPromise = require('./plugin/render-promise');

var _renderPromise2 = _interopRequireDefault(_renderPromise);

var _package = require('./../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var Render = _fs2.default.readFileSync(_path2.default.join(__dirname, './../src/Render.js'), 'utf-8');
var plugins = [function (self) {
    if (!self.name) {
        var firstH1 = self.elements.find(function (ele) {
            return ele instanceof Types.Header && ele.level == 1;
        });
        self.name = firstH1 ? '' + firstH1.content : '_' + new Date().getTime();
    }
    return {
        head: function head() {
            return '<!-- Markplus: ' + self.name + ' -->';
        },
        code: function code() {
            return Render + 'Markplus.__defineGetter__(\'version\', () => \'' + _package2.default.version + '\');\n';
        },
        dump: function dump() {
            return ['\nexport const name = \'' + self.name + '\';'].concat(_toConsumableArray(self.elements.map(function (ele) {
                return ele.dump();
            }))).join('\n');
        }
    };
}];
var pluginNames = new Set();
var use = exports.use = function use(plugin) {
    var name = plugin.name;
    if (!name) {
        throw new Error('Invalid plugin.');
    }
    if (pluginNames.has(name)) {
        console.warn(new Error('plugin name (' + name + ') conflict.').stack.replace(/^Error/, 'Warning')); // eslint-disable-line no-console
    }
    pluginNames.add(name);
    plugins.push(plugin);
};

[_renderCode2.default, _renderPromise2.default].forEach(use);

var Markplus = function Markplus(elements, name) {
    var _this = this;

    _classCallCheck(this, Markplus);

    _initialiseProps.call(this);

    this.elements = elements;
    this.name = name;
    var ps = plugins.map(function (plugin) {
        return plugin(_this);
    });
    this.plugin = function (action) {
        return ps.map(function (p) {
            return p[action] && p[action]();
        }).filter(function (code) {
            return code != null;
        });
    };
};

Markplus.from = function (content) {
    return new Promise(function (resolve, reject) {
        var lines = content instanceof Array ? content : content.split(content.endsWith('\r\n') ? '\r\n' : '\n');
        var elements = Types.default.parse(lines);
        resolve(new Markplus(elements));
    });
};

var _initialiseProps = function _initialiseProps() {
    var _this2 = this;

    this.code = function () {
        return ['\n/* code */\n'].concat(_toConsumableArray(_this2.plugin('code')), ['\n/* dump */\n'], _toConsumableArray(_this2.plugin('dump'))).join('\n');
    };
};

exports.default = Markplus;
//# sourceMappingURL=core.js.map