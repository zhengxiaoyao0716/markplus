'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var Markplus = {
    get version() {
        return '';
    },
    container: function (container) {
        return container.classList.add('Markplus'), container;
    }(document.createElement('div')),
    renders: [[function (payload) {
        return typeof payload == 'string';
    }, function (payload) {
        var ele = document.createElement('span');
        ele.innerHTML = payload + '<br>';
        ele.classList.add('String');
        return ele;
    }], [function (payload) {
        return payload instanceof Array;
    }, function (payload) {
        var ele = document.createElement('span');
        payload.filter(function (p) {
            return p != null;
        }).forEach(function (payload) {
            return Markplus.register(payload.at, payload);
        });
        ele.classList.add('Array');
        return ele;
    }], [function (payload) {
        return payload instanceof Object && payload.tag;
    }, function (payload) {
        var tag = payload.tag,
            html = payload.html,
            props = _objectWithoutProperties(payload, ['tag', 'html']);

        var ele = document.createElement(tag);
        ele.innerHTML = html;
        Object.keys(props).forEach(function (name) {
            return ele.setAttribute(name, props[name]);
        });
        ele.classList.add('Target');
        return ele;
    }], [function () {
        return true;
    }, function () {
        return document.createElement('span');
    }]],
    htmlSugars: [[/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>'], [/`(.*?)`/g, '<code>$1</code>']],
    replaceHtml: function replaceHtml(ele, html) {
        var _this = this;

        ele.innerHTML = withEscape(function (html) {
            return _this.htmlSugars.reduce(function (html, _ref) {
                var _ref2 = _slicedToArray(_ref, 2),
                    regExp = _ref2[0],
                    replace = _ref2[1];

                return html.replace(regExp, replace);
            }, html);
        })(html);
    },

    decorators: [function (ele, at) {
        return ele.setAttribute('data-markplus-at', at);
    }, function (ele, at) {
        return ele.id || (ele.id = 'L' + at);
    }],
    register: function register(at, payload) {
        var ele = this.renders.find(function (_ref3) {
            var _ref4 = _slicedToArray(_ref3, 1),
                cond = _ref4[0];

            return cond(payload);
        })[1](payload);
        this.replaceHtml(ele, ele.innerHTML);
        this.decorators.forEach(function (decorator) {
            return decorator(ele, at, payload);
        });
        this.container.appendChild(ele);
    }
};
var register = exports.register = Markplus.register.bind(Markplus);

exports.default = /** @param {HTMLElement} container */function (container) {
    return container.appendChild(Markplus.container);
};
//# sourceMappingURL=Render.js.map