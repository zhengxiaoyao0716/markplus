const Markplus = {
    /** @type {HTMLElement} */
    get container() { throw new Error('could not access Markplus.container without context.'); },
    /** render the parsered data to element */
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
                payload.filter(p => p != null).forEach(payload => Markplus.register(Markplus.container, payload.at, payload));
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
                Object.keys(props).forEach(name => typeof props[name] == 'string' && ele.setAttribute(name, props[name]));
                ele.classList.add('Target');
                return ele;
            },
        ],
        [() => true, () => document.createElement('span')],
    ],
    /** replace the sugars to it's raw syntax */
    htmlSugars: [
        [/\[(.*?)\]\((.*?)\)/g, (...$) => `<a href="${(matched => matched ? `javascript:${matched[1]}(${matched[2]});` : $[2])($[2].match(/^\$(\w+)(.*)/))}">${$[1]}</a>`],
        [/`(.*?)`/g, '<code>$1</code>'],
    ],
    /**
     * replace the sugars in the html content.
     * @param {HTMLElement} ele Element witch the resolved html will be set on.
     * @param {*} html Html content to be replaced the sugars.
     */
    replaceHtml(ele, html) {
        ele.innerHTML = withEscape( // eslint-disable-line no-undef
            html =>
                (reg, rep) => this.htmlSugars.reduce(
                    (html, [regExp, replace]) => html.replace(regExp, replace), html
                ).replace(reg, rep)
        )(html);
    },
    /** decorators for each element before they would be insert into container */
    decorators: [
        (ele, at) => ele.setAttribute('data-markplus-at', at),
        (ele, at) => ele.id || (ele.id = `L${at}`),
    ],
    /**
     * 
     * @param {HTMLElement} container where the elements would be insert.
     * @param {number} at line index of the element.
     * @param {any} payload data of the element.
     */
    register(container, at, payload) {
        const ele = this.renders.find(([cond]) => cond(payload))[1](payload);
        this.replaceHtml(ele, ele.innerHTML);
        this.decorators.forEach(decorator => decorator(ele, at, payload));
        container.appendChild(ele);
    },
    /** processes to initialize the container  */
    process: [
        /** @param {HTMLElement} container */container => container.classList.add('Markplus'),
    ],
};
export default /** @param {HTMLElement} container @param {(Markplus: { register: (at: number, payload: any) => void}) => void} ctx */ (container, ctx) => {
    const containerProperty = Object.getOwnPropertyDescriptor(Markplus, 'container');
    Object.defineProperty(Markplus, 'container', { get: () => container, configurable: true });

    Markplus.process.forEach(process => process(container));
    ctx({ register: Markplus.register.bind(Markplus, container) });

    Object.defineProperty(Markplus, 'container', containerProperty);
};
