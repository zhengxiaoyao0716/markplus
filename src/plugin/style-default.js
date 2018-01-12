import fs from 'fs';
import path from 'path';

const head = fs.readFileSync(path.join(__dirname, './../../src/plugin/style-default.css'), 'utf-8');
const StyleDefault = () => ({
    head: () => `<style>\n${head}\n</style>`,
});
export default StyleDefault;
