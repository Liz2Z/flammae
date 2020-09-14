'use strict';

const path = require('path');

const ownRoot = path.resolve(__dirname, '../');
const resolveOwn = src => path.resolve(ownRoot, src);

module.exports = {
    // TODO: 找一个好的地方来存放缓存信息
    nodeModule: resolveOwn('node_modules'),
    templates: resolveOwn('./templates'),

    // 模板组件及页面
    appHomePageTplFile: resolveOwn('templates/components/home'),
    deomTplComponent: resolveOwn('templates/components/demo'),
    contentTplComponent: resolveOwn('templates/components/content'),
    markdownTplComponent: resolveOwn('templates/components/markdown'),

    //  .tpl 渲染模板
    indexFileTpl: resolveOwn('templates/tpls/index.tpl'),
    routeDataFileTpl: resolveOwn('templates/tpls/route-data.tpl'),
    markdownRenderTpl: resolveOwn('templates/tpls/markdown-render.tpl'),

    // html
    appTemplateHtml: resolveOwn('templates/public/index.html'),
};
