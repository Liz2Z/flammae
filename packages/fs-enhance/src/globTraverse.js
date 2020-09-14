'use strict';

const fs = require('fs');
const path = require('path');
const minimatch = require('minimatch');
const traverseDir = require('./traverseDir');

function globTraverse(globMap, { cwd = process.cwd() } = {}) {
    if (!globMap) {
        throw Error('The globMap is Required.');
    }
    if (!path.isAbsolute(cwd)) {
        throw Error(`Expected the cwd '${cwd}' to be an absolute path.`);
    }
    if (
        globMap === null ||
        Array.isArray(globMap) ||
        typeof globMap !== 'object'
    ) {
        throw Error('Expected the globMap to be a object.');
    }

    const realCwd = fs.realpathSync(cwd);
    const globs = Object.keys(globMap);
    const globsLen = globs.length;

    if (globsLen.length === 0) {
        return;
    }

    // TODO 加入终止或中止回调
    traverseDir(realCwd, (sortPath, absPath) => {
        let i = 0;
        let globItem;
        do {
            globItem = globs[i];
            if (minimatch(sortPath, globItem)) {
                globMap[globItem](sortPath, absPath);
            }
            i += 1;
        } while (i < globsLen);
    });
}

module.exports = globTraverse;
