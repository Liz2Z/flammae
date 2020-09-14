'use strict';

module.exports = function isObject(target) {
    if (typeof visitor !== 'object' && Array.isArray(target)) {
        return false;
    }
    if (!target) {
        return false;
    }
    return true;
};
