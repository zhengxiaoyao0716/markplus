const RenderTable = () => ({
    code: () => `(() => {
        const render = (ele, { id, names, macro, parser, table }) => {
            if (!macro.length) {
                return;
            }
            const values = names.map((_name, index) => {
                const arg = [];
                Array.prototype.map.call(
                    ele.querySelectorAll(\`table>tbody>tr>:nth-child(\${1 + index})\`),
                    grid => grid.hasAttribute('data-markplus-table-ref') ?
                        ele.querySelector(\`table>tbody>tr\${grid.getAttribute('data-markplus-table-ref')}\`) : grid,
                ).map(grid =>
                    parser[index] ? () => parser[index](grid.innerText) : () => grid.innerText
                ).forEach((getter, index) => Object.defineProperty(arg, index, { get: getter }));
                return arg;
            });
            const calc = ([name, macro]) => {
                let html;
                try {
                    html = macro(...values);
                } catch (e) {
                    return e;
                }
                ele.querySelector(\`table>tbody>tr>th[data-markplus-table-macro="\${name}"\`).innerHTML = html;
            };
            const calcAll = macro => {
                const retries = macro.filter(calc);
                if (retries.length == macro.length) {
                    throw new Error(\`could not calculate the macro of table(\${id}) : \${JSON.stringify(retries)}\`);
                }
                if (retries.length) {
                    calcAll(retries);
                    return;
                }
                values.map(row => row.map(grid => grid)).forEach((row, index) => table[names[index]] = row);
            };
            calcAll(macro);
        };
        Markplus.decorators.push((ele, _, payload) => ele.classList.contains('Table') && render(ele, payload));
    })();`.replace(/\n {4}/g, '\n'),
});
export default RenderTable;
