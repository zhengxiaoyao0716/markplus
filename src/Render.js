const elements = [];

export default /** @param {HTMLElement} container */ container => {
    elements.forEach(/** @param {HTMLElement} ele */ ele => container.appendChild(ele));
};

const register = (at, payload) => {
    const ele = (/** @return {HTMLElement} */() => {
        if (payload instanceof String) {
            const ele = document.createElement('span');
            ele.innerHTML = `${payload}<br>`;
            return ele;
        }
        if (payload instanceof Promise) {
            return document.createElement('span');
        }
        if (payload instanceof Object && payload.tag) {
            const { tag, html, ...props } = payload;
            const ele = document.createElement(tag);
            ele.innerHTML = html;
            Object.keys(props).forEach(name => ele.setAttribute(name, props[name]));
            return ele;
        }
        return document.createElement('span');
    })();
    ele.setAttribute('data-markplus-at', at);
    elements[at] = ele;
};
