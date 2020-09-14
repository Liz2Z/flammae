'use strict';

const { markdownParse } = require('@flammae/helpers');
const handleColonZones = require('./handle-colon-zones');
const handleImgLink = require('./handle-img-link');

/**
 * webpack的loader
 * 使用方法
 * loader: require.resolve('@flammae/markdown-loader'),
 * options: {
 *      publicPath: './',
 *      plugins:  {
 *          vue: require('markdown-plugin-vue'),
 *      }
 * },
 */
module.exports = function compileMarkdown(source) {
    // eslint-disable-next-line prefer-destructuring
    const loadModule = this.loadModule;
    const callback = this.async();
    const { publicPath = '/', plugins } = this.query.publicPath;
    // 解析.md文件
    // 1. 分离frontmatter与主体
    // 2. 获取所有标题数据
    const { frontmatter, headings, text } = markdownParse(source);
    let mdText = text;
    const replaceSource = function replaceSource(from, to) {
        mdText = mdText.replace(from, to);
    };
    // const setSource = function setSource(newSource) {
    //     mdText = newSource;
    // };
    // const getSource = function getSource() {
    //     return mdText;
    // };

    // 解析markdown，找到代码块并进行处理
    let demos = [];
    try {
        demos = handleColonZones(mdText, {
            plugins,
            replaceSource,
            // setSource,
            // getSource,
        });
    } catch (err) {
        throw err;
    }

    // 触发 webpack loader的回调，将此loader处理完成的结果传递出去
    function emitResult() {
        const data = {
            frontmatter,
            headings,
            text: mdText,
        };

        // markdown中使用反引号包裹代码，在js中反引号为特殊符号，所以需要转义
        const jsonStr = JSON.stringify(data)
            .replace(/`/gm, '\\`')
            .slice(1, -1);

        const loaderResult = `export default {
            ${jsonStr},
            demos: ${demos}
        }`;

        callback(null, loaderResult);
    }

    // 如果markdown中有图片链接，
    // 通过wepback loader自带的loadModule功能加载图片模块
    handleImgLink(mdText, {
        publicPath,
        loadModule,
        replaceSource,
    })
        .then(emitResult)
        .catch(err => {
            // emitResult();
            throw err;
        });
};
