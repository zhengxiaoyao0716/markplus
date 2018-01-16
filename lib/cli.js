'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _babelCore = require('babel-core');

var babel = _interopRequireWildcard(_babelCore);

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _package = require('./../package.json');

var _package2 = _interopRequireDefault(_package);

var _core = require('./core');

var _core2 = _interopRequireDefault(_core);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

var opts = function opts(name) {
    if (!name) {
        name = '.markplusrc';
        if (!_fs2.default.existsSync(name)) {
            return {};
        }
    }
    name = _path2.default.join(process.cwd(), name);
    if (name.endsWith('rc') || name.endsWith('.json')) {
        return JSON.parse(_fs2.default.readFileSync(name));
    }
    return require(name).default;
};

var babelrc = JSON.parse(_fs2.default.readFileSync(_path2.default.join(__dirname, './../.babelrc'), 'utf-8'));
var head = function head(_ref) {
    var head = _ref.head;
    return head();
};
var code = function code(_ref2) {
    var code = _ref2.code,
        name = _ref2.name;
    return _commander2.default.transform ? babel.transform(code(), _extends({}, babelrc, { plugins: ['transform-es2015-modules-umd'], filename: name })).code : code();
};
var launch = function launch(_ref3) {
    var name = _ref3.name;
    return '<div id="markplus"></div><script>' + name + '.default(document.querySelector(\'#markplus\'));</script>';
};

var compile = function compile() {
    var input = _commander2.default.args[0]; // eslint-disable-line no-console
    if (!input) {
        throw new Error('missing input file.');
    }
    var name = _commander2.default.args[1];
    _core2.default.from(_fs2.default.readFileSync(input, 'utf-8'), name, opts(_commander2.default.config)).then(function (mp) {
        return _commander2.default.only ? { head: head, code: code }[_commander2.default.only](mp) : [head(mp), '<style>body { margin: 0; width: 100%; height: 100%; }</style>', '<script>\n' + code(mp) + '\n</script>', launch(mp), ''].join('\n');
    }).then(function (output) {
        return _commander2.default.out ? _fs2.default.writeFileSync(_commander2.default.out, output, 'utf-8') : console.log(output);
    } // eslint-disable-line no-console
    ).catch(console.error); // eslint-disable-line no-console
};

_commander2.default.version(_package2.default.version).usage('[options] INPUT <name> ...');
[['--only <head|code>', 'Only output the specific part.'], ['-o, --out <file>', 'Write the output into the file.'], ['-c, --config <.markplusrc|json|config.js>', 'Read the config from the file.'], ['--no-transform', 'With out babel transform.']].forEach(function (_ref4) {
    var _ref5 = _toArray(_ref4),
        args = _ref5.slice(0);

    return _commander2.default.option.apply(_commander2.default, _toConsumableArray(args));
});
_commander2.default.parse(process.argv);

compile();
//# sourceMappingURL=cli.js.map