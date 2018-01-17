import fs from 'fs';
import path from 'path';

const head = fs.readFileSync(path.join(__dirname, './../../src/plugin/style-default.css'), 'utf-8');
const StyleDefault = () => ({
    head: () => `<style>\n${head}\n</style>`,
    code: () => [
        'Markplus.decorators.push((ele, _, payload) => ele.classList.contains(\'Header\') && ele.addEventListener(\'click\', () => location.hash = payload.id));',
        'Markplus.decorators.push(ele => ele.classList.contains(\'Header\') && (ele.innerHTML = `<span class="hash"></span>${ele.innerHTML}`));',
    ].join('\n'),
});

export default StyleDefault;
