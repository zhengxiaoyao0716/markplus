const fs = require('fs');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');

fs.appendFileSync('./browser/temp/render-code.js', '\nimport * as hljs from \'highlight.js\'; // eslint-disable-line no-unused-vars\n', 'utf-8');
fs.appendFileSync('./dist/render.html', '\n<script src="./render.min.js"></script>\n', 'utf-8');

module.exports = [
    { // publish for browser (minify).
        entry: './browser/render.js',
        output: {
            filename: './dist/render.min.js',
            libraryTarget: 'umd',
        },
        plugins: [
            new UglifyJsPlugin({ minimize: true, sourceMap: true }),
        ],
    },
].map(c => ({
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.(js|es6)$/,
                exclude: /(node_modules|bower_components)/,
                use: { loader: 'babel-loader' },
            },
        ],
    },
    ...c,
}));
