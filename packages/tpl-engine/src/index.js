'use strict';

const executeCode = require('./code-executor');
const { matchBlocks, blockReg } = require('./blocks-matcher');

// TODO: 依赖注入
function compileTpl(targetText, data) {
    // 提取所有代码块
    const matchedBlocks = matchBlocks(targetText);
    if (!matchedBlocks.length) {
        return targetText;
    }
    // 执行代码块，替换原文本
    // TODO: 优化，只用replace就可以
    const result = matchedBlocks.reduce((text, blockText) => {
        const codeText = blockText.match(new RegExp(blockReg))[1];
        const blockExecutedResult = executeCode(codeText, data);
        const newText = text.replace(blockText, blockExecutedResult);
        return newText;
    }, targetText);
    // TODO: needFormat ? 输出格式化的文本
    return result;
}

module.exports = compileTpl;
