'use strict';

// 针对不同平台判断，不同换行符。这里只匹配了 Windows
// windows \n\r
// unix \n
// mac \r

module.exports = {
    newLine: '\\r\\n|\\n',
    space: '(\u0020| )',
};
