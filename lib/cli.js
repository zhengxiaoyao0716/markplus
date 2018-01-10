'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _babelCore = require('babel-core');

var babel = _interopRequireWildcard(_babelCore);

var _core = require('./core');

var _core2 = _interopRequireDefault(_core);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelrc = JSON.parse(_fs2.default.readFileSync(_path2.default.join(__dirname, './../.babelrc'), 'utf-8'));
var style = '<style>.Markplus { }</style>';
var launch = function launch(name) {
    return '<div id="markplus"></div><script>' + name + '.default(document.querySelector(\'#markplus\'));</script>';
};

var transform = function transform(code, name) {
    return babel.transform(code, _extends({}, babelrc, { plugins: ['transform-es2015-modules-umd'], filename: name }));
};

var compile = function compile() {
    var input = _fs2.default.readFileSync('ReadMe.mp', 'utf-8');
    _core2.default.from(input).then(function (mp) {
        return _extends({}, mp, { code: mp.code() });
    }).then(function (mp) {
        return _extends({}, mp, transform(mp.code, mp.name));
    }).then(function (_ref) {
        var code = _ref.code,
            name = _ref.name;
        return '<!-- markplus -->' + style + '\n<script>\n' + code + '\n</script>\n' + launch(name) + '\n';
    }).then(function (output) {
        _fs2.default.writeFileSync(_path2.default.join(__dirname, './../index.html'), output, 'utf-8');
        console.log(output); // eslint-disable-line no-console
    }).catch(console.error); // eslint-disable-line no-console
};

compile();
//# sourceMappingURL=cli.js.map