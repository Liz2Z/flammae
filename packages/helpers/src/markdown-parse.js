'use strict';

const { newLine, space } = require('./new-line');

// frontmatter
const fmReg = `---(?:${newLine})((${newLine}|.)*)(?:${newLine})---`;
// heading
const headingReg = `(#{1,5})${space}+(.+)(?:${newLine})`;

// 解析frontmatter中的数据
function frontmatterParse(str) {
    const arr = str.match(/.*/g).filter(Boolean);
    const obj = {};
    arr.forEach(item => {
        const subArr = item.split(':');
        try {
            // eslint-disable-next-line no-eval
            obj[subArr[0].trim()] = eval(
                subArr[1].trim()
            ); /* eslint-disable-line */
        } catch (err) {
            throw new Error('Incorrect frontmatter format!');
        }
    });
    return obj;
}

// 解析文档标题
// # title
// ## title
function headingParse(headingStr) {
    const subArr = headingStr.match(new RegExp(headingReg));
    if (subArr) {
        return {
            level: subArr[1].length,
            text: subArr[3],
        };
    }
    return false;
}

module.exports = function parseMarkdown(source) {
    if (typeof source !== 'string') {
        throw new Error('Expected the source to be a string.');
    }
    let frontmatter = null;
    let headings = [];
    let markdownText = source;

    // 提取 frontmatter
    const fmMatcher = markdownText.match(new RegExp(fmReg));
    if (fmMatcher) {
        // 截掉的frontmatter
        markdownText = markdownText.replace(fmMatcher[0], '');
        frontmatter = frontmatterParse(fmMatcher[1]);
    }

    // 提取标题
    const headingMatcher = markdownText.match(new RegExp(headingReg, 'g'));

    if (headingMatcher) {
        headings = headingMatcher.map(headingParse).filter(Boolean);
    }

    return {
        frontmatter,
        headings,
        text: markdownText,
    };
};
