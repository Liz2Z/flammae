'use strict';

const fs = require('fs-extra');
const getResolveApp = require('../shared/getResolveApp');
const { appFlammaeDir, appCacheDir } = require('../schema');

module.exports = function returnInitTask(cwd) {
    const resolveApp = getResolveApp(cwd);
    return function init(done) {
        fs.ensureDirSync(resolveApp(appFlammaeDir));
        fs.ensureDirSync(resolveApp(appCacheDir));
        done();
    };
};
