'use strict';

const fs = require('fs-extra');
const { sepToModuleSystem } = require('@flammae/helpers');
const globTraverse = require('@flammae/fs-enhance/src/globTraverse');
const writeFile = require('./utils/writeFile');
const { indexFileTpl: src } = require('../paths');
const getResolveApp = require('../shared/getResolveApp');
const { indexFile, customIndexFile } = require('../schema');

function writeIndexJs(output) {
    const stylePaths = [];
    globTraverse({
        '/.flammae/styles/*.{css,scss,less,sass,styl}': (sortPath, absPath) => {
            stylePaths.push(sepToModuleSystem(absPath));
        },
    });
    writeFile(src, output, { stylePaths });
}

function ensureIndexFileNotExists(output) {
    fs.remove(output);
}

module.exports = function returnToggleIndexJsFile(cwd) {
    const resolveApp = getResolveApp(cwd);
    const output = resolveApp(indexFile);
    const customIndexFilePath = resolveApp(customIndexFile);

    return function toggleIndexJsFile(done) {
        const hasCustomIndex = fs.existsSync(customIndexFilePath);
        if (hasCustomIndex) {
            ensureIndexFileNotExists(output);
        } else {
            writeIndexJs(output);
        }
        done();
    };
};
