'use strict';

const babel = require('@babel/core');

/**
 * 编译jsx代码
 */
function compileJsx(code) {
    try {
        const result = babel.transformSync(code, {
            presets: [
                require.resolve('@babel/preset-env'),
                require.resolve('@babel/preset-react'),
            ],
            plugins: [require.resolve('@babel/plugin-transform-runtime')],
            ast: true,
        });
        return result.code;
    } catch (err) {
        throw err;
    }
}

/**
 * @flammae/markdown-loader 使用的用于编译jsx的插件
 *
 */
module.exports = function markdownJsxPlugin(rawCode) {
    /**
     * 包裹一下
     */
    const code = `import ReactDOM from 'react-dom';
${rawCode};
function _mount(container) {
    ReactDOM.render(<Demo/>, container);
}
function _unMount(container) {
    ReactDOM.unmountComponentAtNode(container);
}`;

    const compiledCode = compileJsx(code);
    const result = `
        function() {
            ${compiledCode};
            return {
                mount: _mount,
                unMount: _unMount,
            };
        }
    `;
    return result;
};
