'use strict';

const path = require('path');
// TODO: 两个节点的路径关系
// TODO: hook不正确

class FsNode {
    constructor(basename, stats, parent) {
        const isDirectory = stats.isDirectory();
        const { sortPath, root, absPath, level } = parent;

        this.stats = stats;

        /**
         * 文件唯一标识符
         */
        this.ino = stats.ino;

        /**
         * 类型标识
         */
        this.isDirectory = isDirectory;

        /**
         * 文件名
         */
        this.name = basename;
        this.lastFilename = undefined;

        /**
         * 短路径 \a\b\c
         */
        this.sortPath = root ? path.sep : path.join(sortPath, basename);

        /**
         * 从盘符开始的绝对路径 c:\\a\\b\\c
         */
        this.absPath = root ? absPath : path.join(absPath, basename);

        /**
         * 链路
         */
        // this.root = root;
        this.parent = root ? null : parent;
        this.children = isDirectory ? [] : null;
        this.level = root ? 0 : level + 1;
    }
}

module.exports = FsNode;
