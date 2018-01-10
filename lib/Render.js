'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var elements = [];

exports.default = /** @param {HTMLElement} container */function (container) {
    elements.forEach( /** @param {HTMLElement} ele */function (ele) {
        return container.appendChild(ele);
    });
};

var register = function register(at, payload) {
    var ele = /** @return {HTMLElement} */function () {
        if (payload instanceof String) {
            var _ele = document.createElement('span');
            _ele.innerHTML = payload + '<br>';
            return _ele;
        }
        if (payload instanceof Promise) {
            return document.createElement('span');
        }
        if (payload instanceof Object && payload.tag) {
            var tag = payload.tag,
                html = payload.html,
                props = _objectWithoutProperties(payload, ['tag', 'html']);

            var _ele2 = document.createElement(tag);
            _ele2.innerHTML = html;
            Object.keys(props).forEach(function (name) {
                return _ele2.setAttribute(name, props[name]);
            });
            return _ele2;
        }
        return document.createElement('span');
    }();
    ele.setAttribute('data-markplus-at', at);
    elements[at] = ele;
};
//# sourceMappingURL=Render.js.map