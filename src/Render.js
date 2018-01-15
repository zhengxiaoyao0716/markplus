const Markplus = {
    get version() { return ''; },
    container: (container => (container.classList.add('Markplus'), container))(document.createElement('div')),
    elements: [],
    renders: [
        [
            payload => typeof payload == 'string',
            payload => {
                const ele = document.createElement('span');
                ele.innerHTML = `${payload}<br>`;
                ele.classList.add('String');
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
        (ele, at) => ele.id || (ele.id = `L${at}`),
    ],
    register(at, payload) {
        const ele = this.renders.find(([cond]) => cond(payload))[1](payload);
        this.decorators.forEach(decorator => decorator(ele, at, payload));
        Markplus.elements[at] = ele;
        this.container.appendChild(ele);
    },
};

export default /** @param {HTMLElement} container */ container => container.appendChild(Markplus.container);
