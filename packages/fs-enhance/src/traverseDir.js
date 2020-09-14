'use strict';

const fs = require('fs');
const path = require('path');

module.exports = function traverseDir(
    targetDir,
    sortPath,
    callback = () => null
) {
    if (!targetDir) {
        throw Error('The targetDir is required.');
    }
    if (!path.isAbsolute(targetDir)) {
        throw Error('Expected the targetDir to be an absolute path.');
    }

    let _callback = callback;
    let _sortPath = sortPath;
    if (typeof sortPath === 'function') {
        _callback = sortPath;
        _sortPath = '/';
    }

    let dirents;
    try {
        dirents = fs.readdirSync(targetDir, {
            encoding: 'utf8',
            withFileTypes: true,
        });
    } catch (err) {
        throw err;
    }

    if (!dirents || !dirents.length) {
        return;
    }

    let i = 0;
    let dirent;
    const len = dirents.length;
    while (i < len) {
        dirent = dirents[i];
        const subSortPath = path.join(_sortPath, dirent.name);
        const absPath = path.resolve(targetDir, dirent.name);
        _callback(subSortPath, absPath);
        if (dirent.isDirectory()) {
            traverseDir(absPath, subSortPath, _callback);
        }
        i += 1;
    }
};
