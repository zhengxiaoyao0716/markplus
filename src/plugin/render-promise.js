const polyfill = 'window.fetch || document.writeln(\'<script src="https://cdn.jsdelivr.net/npm/whatwg-fetch@2.0.3/fetch.min.js"><\' + \'/script>\');';
const code = `[
    payload => payload instanceof Promise,
    payload => {
        const ele = document.createElement('span');
        ele.classList.add('Promise');
        payload.then(r => Markplus.register(ele, payload.at, r));
        return ele;
    },
]`;
const RenderPromise = () => ({
    head: () => `<script>${polyfill}</script>`,
    code: () => `Markplus.renders.unshift(${code});`,
});
export default RenderPromise;
