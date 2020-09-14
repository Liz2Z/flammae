'use strict';

const { execute } = require('@flammae/task');
const fsWatch = require('@flammae/fs-enhance/src/fsWatch');
const returnToggleIndexJsFile = require('./toggleIndexJsFile');
const returnWriteRouteDataFile = require('./writeRouteDataFile');
const returnWriteRealIndexJsFile = require('./writeRealIndexJsFile');
const returnWriteMdRendererJsFile = require('./writeMdRendererJsFile');

module.exports = function returnWatchTask(cwd) {
    return function watchTask() {
        fsWatch(cwd, {
            /**
             * 路由
             */
            '{/docs,/docs/**,/docs/**/*.md,/.flammae/pages,/.flammae/pages/**,/.flammae/pages/*/**/index.jsx}': () => {
                execute(returnWriteRouteDataFile(cwd));
            },

            /**
             * 自定义入口
             */
            '.flammae/index.{jsx,js}': () => {
                execute(
                    returnToggleIndexJsFile(cwd),
                    returnWriteRealIndexJsFile(cwd)
                );
            },

            /**
             * 全局样式
             */
            '/.flammae/styles,.flammae/styles/*.{less,css,scss,sass}': () => {
                execute(returnToggleIndexJsFile(cwd));
            },

            /**
             * 模板覆盖
             */
            '/.flammae/override/{content.jsx,demo.jsx,content/index.js,demo.jsx}': () => {
                execute(returnWriteMdRendererJsFile(cwd));
            },
        });
    };
};
