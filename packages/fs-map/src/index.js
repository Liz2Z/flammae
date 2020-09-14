const fs = require('fs');
const path = require('path');
const createFsNode = require('./create-file-sys-node');

/**
 * 传入一个文件夹的绝对路径，及一个父节点（可选）。
 * 如果未传父节点，则根据绝对路径创建一个文件夹节点作为父节点，读取文件夹，
 * 将文件夹内所有文件生成对应的子节点放入父节点的children属性中
 *
 * @param {string} dirName
 * @param {*} parent
 */
function createFileSysMap(dirName, parent) {
    /**
     * path must be absolute
     */
    if (!path.isAbsolute(dirName)) {
        throw TypeError(`path '${dirName}' must be absolute`);
    }

    /**
     * if parent is not exists create Root Node
     * TODO: validate type of parent
     */
    const parentNode =
        parent ||
        createFsNode(dirName, {
            absPath: dirName,
            root: true,
        });

    /**
     * 读取文件夹第一级目录，生成dirent数组
     */
    let filenames;
    try {
        filenames = fs.readdirSync(dirName, {
            encoding: 'utf8',
        });
    } catch (err) {
        // throw err;
        console.log();
        console.log(
            'This error occurred in @flammae/fs-map, this may be a bug. bug report: https://github.com/flammae/fs-map/issues'
        );
        // TODO 错误处理
        return null;
    }

    if (!filenames.length) {
        return null;
    }

    /**
     * 递归文件夹，生成Map
     *
     * eslint: https://eslint.org/docs/rules/no-param-reassign
     */
    filenames.forEach(filename => {
        const absPath = path.join(dirName, filename);
        const fileNode = createFsNode(absPath, parentNode);
        if (!fileNode) {
            return;
        }
        parentNode.children.push(fileNode);
        if (fileNode.isDirectory) {
            createFileSysMap(fileNode.absPath, fileNode);
        }
    });

    return parentNode;
}

module.exports = createFileSysMap;
