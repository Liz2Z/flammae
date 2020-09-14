'use strict';

/* eslint-disable global-require */
const fs = require('fs');
const path = require('path');
const FsNode = require('./fs-node');
const isObject = require('../utils/is-object');
const {
    diffArr,
    recursionTraverse,
    dirWatchListenerFactory: listenerFactory,
} = require('./helpers');

/**
 * DirNode
 */
module.exports = class DirNode extends FsNode {
    /**
     * make file or dir
     * @param {string} filename a filename, best be basename
     */
    make(filename) {
        if (typeof filename !== 'string') {
            throw Error('Expected the filename to be a string.');
        }
        const createFsNode = require('./index');
        const basename = path.basename(filename);
        const absPath = path.join(this.absPath, basename);
        const stats = fs.statSync(absPath);
        const fsNode = createFsNode(filename, stats, this);
        let found = false;
        /**
         * 如果已存在，就覆盖
         */
        this.children = (this.children || []).map(child => {
            if (child.name === basename) {
                found = true;
                return fsNode;
            }
            return child;
        });
        /**
         * 不存在
         */
        if (!found) {
            this.children.push(fsNode);
        }
    }

    /**
     * 重命名
     * @param {String} newName
     */
    rename(oldName, newName) {
        if (typeof oldName !== 'string' || typeof newName !== 'string') {
            throw Error(
                'Expected both the old filename and the new filename to be string type.'
            );
        }

        /**
         * 找到 oldName对应的节点
         */
        const parent = this;
        const { children, absPath } = parent;
        const child = children.find(item => item.name === oldName);

        if (!child) {
            throw Error(`not found child named ${oldName}.`);
        }

        /**
         * 移除旧节点
         */
        parent.remove(oldName);

        /**
         * 如果重命名的是个文件夹，从这个文件夹开始重新创建一边map
         * 如果是个文件，就创建一个新的
         */
        if (child.isDirectory) {
            // TODO: 这里可能有问题
            const newPath = path.resolve(absPath, newName);
            const createFsMap = require('../index');
            createFsMap(newPath, parent);
        } else {
            parent.make(newName);
        }
    }

    /**
     * 删除文件
     */
    remove(filename) {
        let result = false;
        this.children = this.children.filter(child => {
            const found = child.name === filename;
            if (found) {
                result = true;
            }
            return !found;
        });
        return result;
    }

    /**
     * 校准children,
     * 重新读取文件夹获取children node
     */
    correctChildren() {
        this.children = [];
        const createFsMap = require('../index');
        createFsMap(this.absPath, this);
    }

    /**
     * 读取文件夹
     * @param {object} options options for fs.readdirSync
     */
    readdirSync(options) {
        return fs.readdirSync(
            this.absPath,
            options || {
                encoding: 'utf-8',
            }
        );
    }

    /**
     * 深度优先，遍历每一个文件节点
     * visitor为普通对象，形状为
     * {
     *   [glob] : (fsNode, {break, continue})=>{}
     * }
     * @param {object} visitor
     */
    traverse(visitor) {
        if (visitor && !isObject(visitor)) {
            throw new TypeError('Expected the visitor to be a object.');
        }
        if (Object.keys(visitor) === 0) {
            throw new TypeError(
                'Expected at least one pattern property in visitor.'
            );
        }
        // eslint-disable-next-line no-use-before-define
        recursionTraverse(this.children, visitor);
    }

    /**
     * 监听文件夹内部操作
     */
    watch(listener) {
        if (typeof listener !== 'function' && !isObject(listener)) {
            throw new Error(
                'Expected the listener to be a function or object.'
            );
        }
        const node = this;
        fs.watch(
            node.absPath,
            {
                encoding: 'utf8', // 指定用于传给监听器的文件名的字符编码
                recursive: true, // 指示应该监视所有子目录，还是仅监视当前目录，仅在 macOS 和 Windows 上有效
                persistent: true, // 指示如果文件已正被监视，进程是否应继续运行
            },
            listenerFactory(node, listener)
        );
    }

    /**
     * 根据传入的**路径**找到map中对应的节点，找不到的话返回`null`
     * _该路径为相对于当前节点的短路径 '/a/b/c'_
     * @param {string} sortPath
     */
    find(sortPath) {
        if (!sortPath) {
            throw new Error('Argument path is required.');
        }
        if (typeof sortPath !== 'string') {
            throw new TypeError('Expected the path to be a string.');
        }

        /**
         * 路径分隔符可以有以下几种形式
         * - c:\\a\\b
         * - a\b\c
         * - a/b/c
         */
        const sepReg = '\\\\|\\|/';

        /**
         * 去掉首部的 / or \ or \\
         * /a/b/c => a/b/c
         */
        const normalizedPath = path
            .normalize(sortPath)
            .replace(new RegExp(`^${sepReg}`), '');

        /**
         * 'a/b/c' => ['a','b','c']
         */
        const filenames = normalizedPath.split(new RegExp(sepReg));

        let result = null;
        const fsMap = this;
        let fsNodes = fsMap.children;
        let i = 0;
        const { length } = filenames;
        do {
            /**
             * 找到文件名对应的文件节点
             */
            const filename = filenames[i];
            const fsNode = fsNodes.find(
                fsNodeItem => fsNodeItem.name === filename
            );

            /**
             * 如果文件节点不存在，就终止本次查找
             */
            if (!fsNode) {
                // not found
                break;
            }

            if (i === length - 1) {
                result = fsNode;
            }

            i += 1;
            fsNodes = fsNode.children;
        } while (i < length && fsNodes);

        return result;
    }

    /**
     * TODO：不是很准确，更精准的diff
     * TODO: 这里是一个核心，必须做好
     * 传入一个文件名
     * @param {filename} filename
     * @param {function} callback
     */
    diffPinpoint(filename, callback) {
        const dirNode = this;
        const basename = path.basename(filename);
        const absPath = path.resolve(dirNode.absPath, basename);
        const virtualChildren = dirNode.children.map(item => item.name);
        let realityChildren;
        try {
            realityChildren = dirNode.readdirSync();
        } catch (err) {
            throw err;
        }
        const rLen = realityChildren.length;
        const vLen = virtualChildren.length;

        if (rLen > vLen) {
            /**
             * 新建：create
             * 多了文件，且新文件列表中包含传入的文件名
             */
            if (realityChildren.includes(basename)) {
                dirNode.make(basename);
                callback('create', dirNode, absPath);
            } else {
                dirNode.correctChildren();
            }
        } else if (rLen < vLen) {
            /**
             * 删除：remove
             * 少了文件，且旧文件列表中包含传入的文件名
             */
            if (virtualChildren.includes(basename)) {
                dirNode.remove(basename);
                callback('remove', dirNode, absPath);
            } else {
                dirNode.correctChildren();
            }
        } else if (
            virtualChildren.includes(basename) &&
            !realityChildren.includes(basename)
        ) {
            /**
             * 两个文件列表一样长，新文件列表中存在的，
             * 旧文件列表中不存在
             */
            const [[oldName], [newName]] = diffArr(
                realityChildren,
                virtualChildren
            );
            dirNode.rename(newName, oldName);
            callback(
                'rename',
                dirNode,
                path.resolve(dirNode.absPath, newName),
                path.resolve(dirNode.absPath, oldName)
            );
        } else {
            callback('unknown', dirNode, absPath);
            // TODO: XXXXXX
            // 这里也需要更新fsMap
            // 要时刻保持fsMap与实际一致
        }
    }

    /**
     * 从当前节点开始，读取文件夹，采用react虚拟DOM的diff方式
     *
     * 1. 读取当前文件夹获取所有文件的具体信息
     * 2. 比较UID，比较最后一次更新时间
     */
    // diff() {
    //     const thisNode = this;
    //     let childrenNames;
    //     try {
    //         childrenNames = thisNode.readdirSync();
    //     } catch (err) { throw err; }
    // }
};
