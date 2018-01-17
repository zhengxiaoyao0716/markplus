'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _head = _fs2.default.readFileSync(_path2.default.join(__dirname, './../../src/plugin/style-default.css'), 'utf-8');
var StyleDefault = function StyleDefault() {
    return {
        head: function head() {
            return '<style>\n' + _head + '\n</style>';
        },
        code: function code() {
            return ['Markplus.decorators.push((ele, _, payload) => ele.classList.contains(\'Header\') && (ele.innerHTML = `<span class="hash"></span>${ele.innerHTML}`, ele.querySelector(\'.hash\').addEventListener(\'click\', () => location.hash = payload.id)));'].join('\n');
        }
    };
};

exports.default = StyleDefault;
//# sourceMappingURL=style-default.js.map