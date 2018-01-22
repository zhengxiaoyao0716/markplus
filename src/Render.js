const Markplus = {
    get version() { return ''; },
    container: (container => (container.classList.add('Markplus'), container))(document.createElement('div')),
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
            payload => payload instanceof Array,
            payload => {
                const ele = document.createElement('span');
                payload.filter(p => p != null).forEach(payload => Markplus.register(payload.at, payload));
                ele.classList.add('Array');
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
    htmlSugars: [
        [/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>'],
        [/`(.*?)`/g, '<code>$1</code>'],
    ],
    replaceHtml(ele, html) {
        const escape = html.replace(/\\(.)/g, (_, char) => `\\u00${char.charCodeAt(0).toString(16)}`);
        const replaced = this.htmlSugars.reduce((html, [regExp, replace]) => html.replace(regExp, replace), escape);
        ele.innerHTML = replaced.replace(/\\u([0-9A-Za-z]{4})/g, (_, code) => `${String.fromCodePoint(Number.parseInt(code, 16))}`);
    },
    decorators: [
        (ele, at) => ele.setAttribute('data-markplus-at', at),
        (ele, at) => ele.id || (ele.id = `L${at}`),
    ],
    register(at, payload) {
        const ele = this.renders.find(([cond]) => cond(payload))[1](payload);
        this.replaceHtml(ele, ele.innerHTML);
        this.decorators.forEach(decorator => decorator(ele, at, payload));
        this.container.appendChild(ele);
    },
};
export const register = Markplus.register.bind(Markplus);
export default /** @param {HTMLElement} container */ container => container.appendChild(Markplus.container);
