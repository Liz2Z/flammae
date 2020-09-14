'use strict';

const { pathExistSync, sepToModuleSystem } = require('@flammae/helpers');
const {
    deomTplComponent,
    contentTplComponent,
    markdownTplComponent,
    markdownRenderTpl: src,
} = require('../paths');
const {
    overrideDemoFile,
    overrideContentFile,
    markdownRenderJsxFile,
} = require('../schema');
const writeFile = require('./utils/writeFile');
const getResolveApp = require('../shared/getResolveApp');

module.exports = function returnRenderMdRenderer(cwd) {
    const resolveApp = getResolveApp(cwd);
    const overrideContentPath = resolveApp(overrideContentFile);
    const overrideDemoPath = resolveApp(overrideDemoFile);
    const output = resolveApp(markdownRenderJsxFile);

    return function renderMdRendererJsFile(done) {
        // content 组件路径
        const content = pathExistSync(overrideContentPath)
            ? sepToModuleSystem(overrideContentPath)
            : sepToModuleSystem(contentTplComponent);

        const demo = pathExistSync(overrideDemoPath)
            ? sepToModuleSystem(overrideDemoPath)
            : sepToModuleSystem(deomTplComponent);

        // markdown 组件
        const markdown = sepToModuleSystem(markdownTplComponent);

        writeFile(src, output, {
            content,
            demo,
            markdown,
        });
        done();
    };
};
