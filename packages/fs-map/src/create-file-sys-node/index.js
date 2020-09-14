'use strict';

const fs = require('fs');
const path = require('path');
const DirNode = require('./dir-node');
const FileNode = require('./file-node');

/**
 * 创建一个fs node
 */
module.exports = function createFsNode(filename, parent) {
    let stats = null;
    try {
        stats = fs.statSync(filename);
    } catch (err) {
        throw err;
    }
    if (!stats) {
        return null;
    }

    const Constructor = stats.isDirectory() ? DirNode : FileNode;

    const fileNode = new Constructor(path.basename(filename), stats, parent);

    return fileNode;
};
