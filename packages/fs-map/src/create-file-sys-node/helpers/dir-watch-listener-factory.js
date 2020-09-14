'use strict';

const path = require('path');
const minimatch = require('minimatch');
const { sepToModuleSystem } = require('@flammae/helpers');
const isObject = require('../../utils/is-object');

module.exports = function listenerFactory(fsMap, callback) {
    /**
     * listener 接收两个参数 eventType filename
     * eventType 是 'rename' 或 'change'， filename 是触发事件的文件的名称。
     *
     * 规则：
     *
     * 顶级目录：
     * - 增删： rename filename
     * - 重命名文件 f => f1：  rename f1 & change f1
     * 在文件夹dir中：比较dir中文件变化
     * - 在文件夹dir中增删文件： change dir & rename  dir/filename
     * - 在文件夹dir中重命名文件 dir/f => dir/f1：  rename dir/f1 & change dir & change dir/f1
     *
     */
    return function listener(e, filename) {
        /**
         * filename的格式为 a\b\c
         */

        /**
         * TODO: X
         * 有的系统可能不传filename
         * 这个时候需要重新生成一遍fsMap
         */
        if (!filename) {
            return;
        }
        // TODO: 下面可以放在 fsNode.diff函数中

        /**
         * filename是相对于被watch的那个节点，
         * 根据pathLength长度可以知道是哪个层级发生了变化
         *
         * 'a' => [ a ]
         * 'a\b\c' =>  [ a, b, c ]
         */
        const filenames = filename.split(path.sep);
        const pathLength = filenames.length;

        let fsNode;
        /**
         * 矫正fsMap
         */
        if (pathLength === 1) {
            /**
             * filename只有一个路径 'a'
             * 说明在一级目录下进行操作
             */
            fsNode = fsMap;
        } else {
            const sortDirPath = filenames.slice(0, -1).join(path.sep);
            const dirNode = fsMap.find(sortDirPath);
            fsNode = dirNode || fsMap;
        }
        fsNode.correctChildren();
        if (typeof callback === 'function') {
            callback(filename, fsNode);
        } else if (isObject(callback)) {
            const obj = callback;
            const globs = Object.keys(obj);
            globs.forEach(glob => {
                if (minimatch(`/${sepToModuleSystem(filename)}`, glob)) {
                    obj[glob](fsNode);
                }
            });
        }
    };
};
