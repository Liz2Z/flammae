'use strict';

/* eslint-disable camelcase */
const { execute } = require('@flammae/task');
const { realIndexJsFile } = require('../schema');
const getResolveApp = require('../shared/getResolveApp');
const init = require('./initTask');
const returnWatchTask = require('./watchTask');
const returnToggleIndexJsFile = require('./toggleIndexJsFile');
const returnWriteFlammaeJsFile = require('./writeFlammaeJsFile');
const returnWriteRouteDataFile = require('./writeRouteDataFile');
const returnWriteRealIndexJsFile = require('./writeRealIndexJsFile');
const returnWriteMdRendererJsFile = require('./writeMdRendererJsFile');

module.exports = function createDynamicEntry(cwd) {
    const realIndexPath = getResolveApp(cwd)(realIndexJsFile);

    /**
     * 当存在index.js时，不需要执行：
     * - 生成index.js文件
     * - 生成router.jsx文件
     */
    execute(
        init(cwd),
        returnWriteRealIndexJsFile(cwd, ''),
        returnWriteRouteDataFile(cwd),
        returnWriteMdRendererJsFile(cwd),
        returnWriteFlammaeJsFile(cwd),
        returnToggleIndexJsFile(cwd),
        returnWriteRealIndexJsFile(cwd),
        returnWatchTask(cwd)
    );

    return realIndexPath;
};
