'use strict';

/**
 * 找出两个数组中的不同项
 * @param {array} targetOne
 * @param {array} targetTwo
 */
module.exports = function diffArray(targetOne, targetTwo) {
    if (!Array.isArray(targetOne) || !Array.isArray(targetTwo)) {
        throw Error('Expected anyone of the arguments to be an Array.');
    }
    const isFirstLong = targetOne.length > targetTwo.length;
    let i = 0;
    const len = isFirstLong ? targetTwo.length : targetOne.length;
    const copyLong = isFirstLong ? [...targetOne] : [...targetTwo];
    const copyShort = isFirstLong ? targetTwo : targetOne;
    const diffedArr = [];
    for (; i < len; i += 1) {
        const item = copyShort[i];
        const index = copyLong.indexOf(item);
        if (index > -1) {
            copyLong.splice(index, 1);
        } else {
            diffedArr.push(item);
        }
    }
    return isFirstLong ? [copyLong, diffedArr] : [diffedArr, copyLong];
};
