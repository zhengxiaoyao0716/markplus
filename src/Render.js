const Markplus = {
    elements: [],
    renders: [
        [
            payload => payload instanceof String,
            payload => {
                const ele = document.createElement('span');
                ele.innerHTML = `${payload}<br>`;
                ele.classList.add('String');
                return ele;
            },
        ],
        [
            payload => payload instanceof Promise,
            () => {
                const ele = document.createElement('span');
                ele.classList.add('Promise');
                return ele;
            },
        ],
        [
            payload => payload instanceof Object && payload.tag,
            payload => {
                const { tag, html, ...props } = payload;
                const ele = document.createElement(tag);
                ele.innerHTML = html;
                Object.keys(props).forEach(name => ele.setAttribute(name, props[name]));
                ele.classList.add('Target');
                return ele;
            },
        ],
        [() => true, () => document.createElement('span')],
    ],
    decorators: [
        (ele, at) => ele.setAttribute('data-markplus-at', at),
    ],
    register(at, payload) {
        const ele = this.renders.find(([cond]) => cond(payload))[1](payload);
        this.decorators.forEach(decorator => decorator(ele, at, payload));
        Markplus.elements[at] = ele;
    },
};

export default /** @param {HTMLElement} container */ container => Markplus.elements.forEach(/** @param {HTMLElement} ele */ ele => container.appendChild(ele));
