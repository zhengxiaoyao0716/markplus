'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var polyfill = 'window.fetch || document.writeln(\'<script src="https://cdn.jsdelivr.net/npm/whatwg-fetch@2.0.3/fetch.min.js"><\' + \'/script>\');';
var _code = '[\n    payload => payload instanceof Promise,\n    payload => {\n        const ele = document.createElement(\'span\');\n        ele.classList.add(\'Promise\');\n        payload.then(r => Markplus.replaceHtml(ele, `${r}<br>`));\n        return ele;\n    },\n]';
var RenderPromise = function RenderPromise() {
    return {
        head: function head() {
            return '<script>' + polyfill + '</script>';
        },
        code: function code() {
            return 'Markplus.renders.unshift(' + _code + ');';
        }
    };
};
exports.default = RenderPromise;
//# sourceMappingURL=render-promise.js.map