'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var RenderTable = function RenderTable() {
    return {
        code: function code() {
            return '(() => {\n        const render = (ele, { id, names, macro, parser, table }) => {\n            if (!macro.length) {\n                return;\n            }\n            const values = names.map((_name, index) => {\n                const arg = [];\n                Array.prototype.map.call(\n                    ele.querySelectorAll(`table>tbody>tr>:nth-child(${1 + index})`),\n                    grid => grid.hasAttribute(\'data-markplus-table-ref\') ?\n                        ele.querySelector(`table>tbody>tr${grid.getAttribute(\'data-markplus-table-ref\')}`) : grid,\n                ).map(grid =>\n                    parser[index] ? () => parser[index](grid.innerText) : () => grid.innerText\n                ).forEach((getter, index) => Object.defineProperty(arg, index, { get: getter }));\n                return arg;\n            });\n            const calc = ([name, macro]) => {\n                let html;\n                try {\n                    html = macro(...values);\n                } catch (e) {\n                    return e;\n                }\n                ele.querySelector(`table>tbody>tr>th[data-markplus-table-macro="${name}"`).innerHTML = html;\n            };\n            const calcAll = macro => {\n                const retries = macro.filter(calc);\n                if (retries.length == macro.length) {\n                    throw new Error(`could not calculate the macro of table(${id}) : ${JSON.stringify(retries)}`);\n                }\n                if (retries.length) {\n                    calcAll(retries);\n                    return;\n                }\n                values.map(row => row.map(grid => grid)).forEach((row, index) => table[names[index]] = row);\n            };\n            calcAll(macro);\n        };\n        Markplus.decorators.push((ele, _, payload) => ele.classList.contains(\'Table\') && render(ele, payload));\n    })();'.replace(/\n {4}/g, '\n');
        }
    };
};
exports.default = RenderTable;
//# sourceMappingURL=render-table.js.map