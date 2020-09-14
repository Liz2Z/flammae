'use strict';

/**
 * 执行字符串代码块
 * @param {string} blockText
 * @param {*} data
 * @return {string}
 */
module.exports = function executeCode(blockText, data) {
    const trimedBlockText = blockText.trim();
    if (!trimedBlockText) {
        return '';
    }
    const codeText = `( ($data) => (
        ${trimedBlockText}
    ))(${JSON.stringify(data)})`;

    let result = null;
    // TODO: 静态编译代码块，给出更准确的错误提示
    try {
        /* eslint-disable */
        result = eval(codeText);
        /* eslint-enable */
    } catch (err) {
        console.log();
        console.log('@flammae/tpl-engine Error:');
        console.error(err);
        console.log();
        console.log('Error Code:');
        console.log(trimedBlockText);
        console.log();
        process.exit(0);
    }
    if (!result) {
        return '';
    }
    if (typeof result === 'string') {
        return result;
    }
    if (Array.isArray(result)) {
        return result.join('\n');
    }
    return String(result);
};
