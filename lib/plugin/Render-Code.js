'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Parser = require('./../Parser');

_Parser.Code.prototype.__defineGetter__('json', function () {
    return {
        tag: 'span',
        html: this.lines.slice(1, this.size - 1).map(function (line) {
            return '<span>' + line + '</span><br>';
        }).join(''),
        class: 'Code Code-' + this.language
    };
});

var _head = ['<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.12.0/build/styles/vs2015.min.css">', '<script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.12.0/build/highlight.min.js"></script>'].join('\n');

var RenderCode = function RenderCode() {
    return {
        head: function head() {
            return _head;
        },
        code: function code() {
            return 'hljs && Markplus.decorators.push(ele => ele.classList.contains(\'Code\') && hljs.highlightBlock(ele));';
        }
    };
};
exports.default = RenderCode;
//# sourceMappingURL=render-code.js.map