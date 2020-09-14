'use strict';

const fs = require('fs-extra');
const globTraverse = require('@flammae/fs-enhance/src/globTraverse');
const writeFile = require('./utils/writeFile');
const { routeDataFileTpl: src } = require('../paths');
const getResolveApp = require('../shared/getResolveApp');
const parseRouteFiles = require('./utils/parseRouteData');
const { routeDataJsFile, siteDataJsonFile } = require('../schema');
/**
 * 以promise的形式读取文件
 */
function readFilePromise(type, sortPath, absPath) {
    return new Promise((resolve, reject) => {
        fs.readFile(absPath, { encoding: 'utf8' }, (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            resolve({
                data,
                type,
                sortPath,
                filePath: absPath,
            });
        });
    });
}

module.exports = function returnWriteRouteDataFile(cwd) {
    const resolveApp = getResolveApp(cwd);
    const siteDataOutput = resolveApp(siteDataJsonFile);
    const routeDataOutput = getResolveApp(cwd)(routeDataJsFile);

    return function writeRouteDataFile(done) {
        const promises = [];
        globTraverse({
            '/docs/**/*.md': (sortPath, absPath) => {
                promises.push(readFilePromise('doc', sortPath, absPath));
            },
            '/.theme/pages/*/**/index.jsx': (sortPath, absPath) => {
                promises.push(readFilePromise('page', sortPath, absPath));
            },
        });

        Promise.all(promises)
            .then(files => {
                const siteData = parseRouteFiles(files);
                // 路由数据
                writeFile(src, routeDataOutput, { siteData });
                // 全站元数据
                fs.writeJsonSync(siteDataOutput, siteData, {
                    spaces: 2,
                    EOL: '\n',
                });
            })
            .catch(() => {
                // TODO
            })
            .finally(done);
    };
};
