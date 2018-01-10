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

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RenderCode = _fs2.default.readFileSync(_path2.default.join(__dirname, './../src/Render.js'), 'utf-8');

var plugins = [function (self) {
    if (!self.name) {
        var firstH1 = self.elements.find(function (ele) {
            return ele instanceof Types.Header && ele.level == 1;
        });
        self.name = firstH1 && '' + firstH1.content;
    }
    return {
        dump: function dump() {
            return 'export const name = \'' + self.name + '\';';
        }
    };
}];
var names = new Set();
var use = exports.use = function use(name, plugin) {
    if (names.has(name)) {
        console.warn(new Error('plugin name (' + name + ') conflict.').stack.replace(/^Error/, 'Warning')); // eslint-disable-line no-console
    }
    names.add(name);
    plugins.push(plugin);
};

var Markplus = function Markplus(elements, name) {
    var _this = this;

    _classCallCheck(this, Markplus);

    _initialiseProps.call(this);

    this.elements = elements;
    this.name = name;
    this.plugins = plugins.map(function (plugin) {
        return plugin(_this);
    });
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
        return [RenderCode].concat(_toConsumableArray(_this2.elements.map(function (ele) {
            return ele.dump();
        })), _toConsumableArray(_this2.plugins.map(function (plugin) {
            return plugin.dump && plugin.dump();
        }).filter(function (code) {
            return code;
        }))).join('\n');
    };
};

exports.default = Markplus;
//# sourceMappingURL=core.js.map