'use strict';

const fs = require('fs-extra');
const path = require('path');

function readConfig(cwd) {
    let config = null;
    const configFilePath = path.resolve(
        fs.realpathSync(cwd || process.cwd()),
        'flammae.config.js'
    );
    try {
        /* eslint-disable-next-line global-require,import/no-dynamic-require */
        config = require(configFilePath);
    } catch (err) {
        // 配置文件不存在
    }
    return config;
}

module.exports = readConfig;
