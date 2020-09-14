'use strict';

const fs = require('fs-extra');
const render = require('@flammae/tpl-engine');

module.exports = function writeFile(tplPath, output, sourceData) {
    // src;
    const tplText = fs.readFileSync(tplPath, {
        encoding: 'utf8',
    });
    // 生成文本
    const renderText = render(tplText, sourceData);
    fs.writeFileSync(output, renderText);
};
