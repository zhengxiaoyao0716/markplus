const code = `[
    payload => payload instanceof Promise,
    payload => {
        const ele = document.createElement('span');
        ele.classList.add('Promise');
        payload.then(r => Markplus.replaceHtml(ele, \`\${r}<br>\`));
        return ele;
    },
]`;
const RenderPromise = () => ({
    code: () => `Markplus.renders.unshift(${code});`,
});
export default RenderPromise;
