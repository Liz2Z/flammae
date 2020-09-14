'use strict';

/* eslint-disable no-underscore-dangle */
const execWebpack = require('@flammae/webpack-execter');
const dynamicEntry = require('./dynamicEntry');
const webpackConfigFactory = require('./webpackConfig');

/**
 * 启动flammae
 */
function startFlammae({ mode, cwd = process.cwd(), ...options }) {
    const __DEV__ = mode === 'development';

    // 生成webpack配置
    const webpackConfig = webpackConfigFactory({
        mode,
        cwd,
        entry: dynamicEntry(cwd),
        ...options,
    });

    // 运行webpack
    const exector = __DEV__ ? execWebpack.runServer : execWebpack.runBuild;
    exector(webpackConfig);
}

module.exports = startFlammae;
