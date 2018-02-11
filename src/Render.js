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
            payload => payload instanceof HTMLElement,
            payload => payload,
        ],
        [
            payload => payload instanceof Object && payload.tag,
            payload => {
                const { tag, html, ...props } = payload;
                const ele = document.createElement(tag);
                ele.innerHTML = html;
                Object.keys(props).forEach(name => props[name] instanceof Object || ele.setAttribute(name, props[name]));
                ele.classList.add('Target');
                return ele;
            },
        ],
        [() => true, () => document.createElement('span')],
    ],
    /** replace the sugars to it's raw syntax */
    htmlSugars: [
        [/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1">'],
        [/\[(.*?)\]\((.*?)\)/g, (...$) => `<a href="${(matched => matched ? `javascript:${matched[1] == '_' ? 'void' : matched[1]}(${matched[2]});` : $[2])($[2].match(/^\$([\w.]+)(.*)/))}">${$[1]}</a>`],
        [/`(.+?)`/g, '<code>$1</code>'],
        [/\*\*(\S+?)\*\*/g, '<span class="sugar italic">$1</span>'],
        [/##(\S+?)##/g, '<span class="sugar bold">$1</span>'],
        [/~~(\S+?)~~/g, '<span class="sugar through">$1</span>'],
        [/__(\S+?)__/g, '<span class="sugar under">$1</span>'],
        [/!!(\S+?)!!/g, '<span class="sugar hide">$1</span>'],
        [/-\s\[x\]\s(.*)$/g, '<input disabled type="checkbox"><span>$1</span>'],
        [/-\s\[\s\]\s(.*)$/g, '<input type="checkbox"><span>$1</span>'],
        [/-\s\[o\]\s(.*)$/g, '<input disabled type="checkbox" checked><span>$1</span>'],
        [/-\s\(x\)\s(.*)$/g, '<input disabled type="radio"><span>$1</span>'],
        [/-\s\(\s\)\s(.*)$/g, '<input type="radio"><span>$1</span>'],
        [/-\s\(o\)\s(.*)$/g, '<input disabled type="radio" checked><span>$1</span>'],
    ],
    /**
     * replace the sugars in the html content.
     * @param {HTMLElement} ele Element witch the resolved html will be set on.
     * @param {*} html Html content to be replaced the sugars.
     */
    replaceHtml(ele, html) {
        if (ele.classList.contains('raw-text')) {
            return;
        }
        ele.innerHTML = withEscape( // eslint-disable-line no-undef
            html =>
                (reg, rep) => this.htmlSugars.reduce(
                    (html, [regExp, replace]) => html.replace(regExp, replace), html
                ).replace(reg, rep)
        )(html);
    },
    /** decorators for each element before they would be insert into container */
    decorators: [
        (ele, at) => at != null && ele.setAttribute('data-markplus-at', at),
        (ele, at) => ele.id || at != null && (ele.id = `L${at}`),
        (ele, at, payload) => payload && payload.nested && payload.nested.forEach((payload, index) =>
            Markplus.register(ele.querySelector(`*[data-markplus-nested="${index}"]`), index, payload)),
    ],
    /**
     * 
     * @param {HTMLElement} container where the elements would be insert.
     * @param {number} at line index of the element.
     * @param {any} payload data of the element.
     */
    register(container, at, payload) {
        const ele = this.renders.find(([cond]) => cond(payload))[1](payload);
        container.appendChild(ele);
        this.replaceHtml(ele, ele.innerHTML);
        this.decorators.forEach(decorator => decorator(ele, at, payload));
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
