'use strict';

const fs = require('fs');
const FsNode = require('./fs-node');

/**
 * 非文件夹文件
 */
module.exports = class FileNode extends FsNode {
    /**
     * 异步读取
     */
    readFile(...args) {
        return fs.readFile(this.absPath, ...args);
    }

    /**
     * 同步读取
     */
    readFileSync(...args) {
        return fs.readFileSync(this.absPath, ...args);
    }
};
