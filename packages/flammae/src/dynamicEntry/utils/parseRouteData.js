'use strict';

const {
    markdownParse,
    frontCommentsParse,
    sepToModuleSystem,
} = require('@flammae/helpers');
const { appHomePageTplFile } = require('../../paths');

function getDefaultIndexPage() {
    return {
        routePath: '/index',
        type: 'page',
        title: 'index',
        filePath: sepToModuleSystem(appHomePageTplFile),
    };
}

/**
 * 通过解析短路径，生成文件的路由路径
 */
function getRouterPath(sortPath) {
    // TODO: 优化
    const normalizedPath = sepToModuleSystem(sortPath);
    if (normalizedPath.match(/^\/\.theme\/pages/)) {
        // '/.theme/pages/**/index.jsx'
        return normalizedPath.slice(13, -10);
    }
    // '/docs/**/*.md' => '/doc/**'
    return `/doc${normalizedPath.slice(5, -3)}`;
}

/**
 * 读取文件，获取 frontmatter
 */
function getFrontmatter(data, isDoc) {
    try {
        let frontmatter;
        const parse = isDoc ? markdownParse : frontCommentsParse;
        const result = parse(data);
        /**
         * markdownParse总是会返回一个对象，所以不用判断
         */
        if (isDoc) {
            /* eslint-disable-next-line prefer-destructuring */
            frontmatter = result.frontmatter;
        } else {
            frontmatter = result;
        }
        return frontmatter;
    } catch (err) {
        console.log();
        console.log(err);
        return null;
    }
}

/**
 * 解析文件内容及路径等信息，生成一份文件的描述信息
 * @param {array} files
 */
module.exports = function parseRouteFiles(files) {
    const docs = [];
    const pages = [];

    let hasIndexPage = false;

    if (files.length) {
        files.forEach(({ data, type, filePath, sortPath }) => {
            const isDoc = type === 'doc';

            const routePath = getRouterPath(sortPath);

            const filename = routePath.split('/').pop();

            const frontmatter = getFrontmatter(data, isDoc);

            const result = Object.assign(
                { routePath, title: filename },
                frontmatter,
                { filePath: sepToModuleSystem(filePath), type }
            );

            if (routePath === '/index') {
                hasIndexPage = true;
            }

            if (isDoc) {
                docs.push(result);
            } else {
                pages.push(result);
            }
        });
    }

    if (!hasIndexPage) {
        pages.push(getDefaultIndexPage());
    }

    return {
        docs,
        pages,
    };
};
