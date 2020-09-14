'use strict';

const fs = require('fs-extra');
const getResolveApp = require('../shared/getResolveApp');
const { realIndexJsFile, customIndexFile } = require('../schema');

module.exports = function returnWriteRealIndex(cwd, content) {
    const resolveApp = getResolveApp(cwd);
    const realIndexPath = resolveApp(realIndexJsFile);

    return function writeRealIndexJsFile(done) {
        let text = '';
        if (typeof content !== 'undefined') {
            text = content;
        } else {
            const hasCustomIndex = fs.existsSync(resolveApp(customIndexFile));
            text = `import ${hasCustomIndex ? `'../index'` : `'./index'`}`;
        }
        fs.writeFileSync(realIndexPath, text, { encoding: 'utf8' });
        done();
    };
};
