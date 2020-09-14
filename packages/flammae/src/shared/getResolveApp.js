'use strict';

const fs = require('fs');
const path = require('path');

const getResolveApp = cwd => {
    const appRoot = fs.realpathSync(cwd);
    const resolveApp = src => path.resolve(appRoot, src);
    return resolveApp;
};

module.exports = getResolveApp;
