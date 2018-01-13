"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var _code = "[\n    payload => payload instanceof Promise,\n    payload => {\n        const ele = document.createElement('span');\n        ele.classList.add('Promise');\n        payload.then(r => ele.innerHTML = `${r}<br>`);\n        return ele;\n    },\n]";
var RenderPromise = function RenderPromise() {
    return {
        code: function code() {
            return "Markplus.renders.unshift(" + _code + ");";
        }
    };
};
exports.default = RenderPromise;
//# sourceMappingURL=render-promise.js.map