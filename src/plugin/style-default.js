import fs from 'fs';
import path from 'path';

const head = fs.readFileSync(path.join(__dirname, './../../src/plugin/style-default.css'), 'utf-8').replace(/\r?\n/g, '\n    ').replace(/ {4}\n/g, '\n').trim();
const StyleDefault = () => ({
    head: () => `<style>\n    ${head}\n</style>`,
    code: () => [
        'Markplus.decorators.push((ele, _, payload) => ele.classList.contains(\'Header\') && (ele.innerHTML = `<span class="hash"></span>${ele.innerHTML}`, ele.querySelector(\'.hash\').addEventListener(\'click\', () => location.hash = payload.id)));',
    ].join('\n'),
});

export default StyleDefault;
