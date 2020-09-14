'use strict';

const minimatch = require('minimatch');
const { sepToModuleSystem } = require('@flammae/helpers');

/**
 * 深度优先递归遍历文件节点
 * @param {array} fsNodes
 * @param {object} visitor
 * @returns {boolean}
 */
function recursionTraverse(fsNodes, visitor) {
    const len = fsNodes.length;
    if (!len) {
        return false;
    }
    let i = 0;
    let fsNode;
    let fileSortpath;
    const visitorGlobs = Object.keys(visitor);
    /**
     * 终止traverse
     */
    let shouldBreak = false;
    const breakLoop = () => {
        shouldBreak = true;
    };
    for (; i < len; i += 1) {
        /**
         * 遍历一个文件夹下所有文件节点
         */
        fsNode = fsNodes[i];
        fileSortpath = sepToModuleSystem(fsNode.sortPath);
        let glob;
        let j = 0;
        const globsLen = visitorGlobs.length;
        let shouldContinue = false;
        const continueLoop = () => {
            shouldContinue = true;
        };
        do {
            glob = visitorGlobs[j];
            /**
             * 通过glob模式匹配visitor
             */
            if (minimatch(fileSortpath, glob)) {
                /**
                 * 执行visitor
                 */
                visitor[glob](fsNode, {
                    continue: continueLoop,
                    break: breakLoop,
                });
                if (shouldBreak) {
                    /**
                     * 如果用户在visitor中调用了break, 则停止整个traverse
                     */
                    return shouldBreak;
                }
                if (shouldContinue) {
                    /**
                     * 如果用户调用了continue, 中止当前循环
                     */
                    break;
                }
            }
            j += 1;
        } while (j < globsLen);

        if (!shouldContinue && fsNode.children) {
            shouldBreak = recursionTraverse(fsNode.children, visitor);
            if (shouldBreak === true) {
                return shouldBreak;
            }
        }
    }
    return shouldBreak;
}

module.exports = recursionTraverse;
