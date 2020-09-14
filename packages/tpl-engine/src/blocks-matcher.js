'use strict';

const blockStartSymbol = '<%';
const blockEndSymbol = '%>';
// const blockReg = `<%((?:(?:.|\\n|\\r\\n)(?!<%))*)%>`;
const blockReg = `${blockStartSymbol}((?:(?:.|\\n|\\r\\n)(?!${blockStartSymbol}))*)${blockEndSymbol}`;

/**
 * 用于匹配字符串模板中的代码块 <% ... %>
 * @param {string} targetText
 * @return {array}
 */
function matchBlocks(targetText) {
    const matchedBlocks = targetText.match(new RegExp(blockReg, 'gm'));
    if (!matchedBlocks) {
        return [];
    }
    return matchedBlocks;
}

module.exports = {
    blockReg,
    matchBlocks,
};
