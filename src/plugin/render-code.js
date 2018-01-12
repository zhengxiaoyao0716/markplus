import { Code } from './../Parser';

Code.prototype.__defineGetter__('json', function () {
    return {
        tag: 'span',
        html: this.lines.slice(1, this.size - 1).map(line => `<span>${line}</span><br>`).join(''),
        class: `Code Code-${this.language}`,
    };
});

const head = [
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.12.0/build/styles/vs2015.min.css">',
    '<script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.12.0/build/highlight.min.js"></script>',
].join('\n');

const RenderCode = () => ({
    head: () => head,
    code: () => 'hljs && Markplus.decorators.push(ele => ele.classList.contains(\'Code\') && hljs.highlightBlock(ele));',
});
export default RenderCode;
