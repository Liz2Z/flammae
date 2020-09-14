'use strict';

const { space, newLine } = require('./new-line');

/**
 * 匹配下面的格式
 * `// path: '/button'`
 * `// title: 'button'`
 */
const fmReg = `//(${space}*)([A-z]+)(${space}*):(${space}*)('(.[^'"]+)'|"(.[^'"]+)")(${space}*)(${newLine})?`;

/**
 * 找到一个 .{js,jsx} 文件头部的行级注释frontmatter
 */
module.exports = function frontCommentsParse(str) {
    const fmMatcher = str.match(new RegExp(fmReg, 'mg'));
    let frontmatter = null;
    if (fmMatcher) {
        frontmatter = {};
        fmMatcher.forEach(subStr => {
            const arr = subStr
                .replace(new RegExp(`${newLine}|//`), '')
                .split(':');
            frontmatter[arr[0].trim()] = arr[1].trim().replace(/'|"/gm, '');
        });
    }
    return frontmatter;
};
