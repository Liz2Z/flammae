'use strict';

const createFsMap = require('@flammae/fs-map');

function fsWatch(cwd = process.cwd(), callback) {
    const fsMap = createFsMap(cwd);
    fsMap.watch(callback);
}

module.exports = fsWatch;
