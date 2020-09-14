'use strict';

const path = require('path');
const fs = require('fs-extra');

/**
 * 防抖
 * @param {function} fn
 * @param {number} time
 */
exports.debounce = function debounce(fn, time) {
    let timer;
    return function debouncedFunction(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn(...args);
        }, time || 300);
    };
};

/**
 * 标准路径，然后将各种路径分隔符转换成 模块化可以加载的路径
 * @param src
 */
exports.sepToModuleSystem = src => {
    if (!src) {
        return '';
    }
    return path.normalize(src).replace(/\\\\|\\|\//g, '/');
};

/**
 * 标准路径，然后将各种路径分隔符转换成当前系统分隔符
 * @param src
 */
exports.normalizeSepToSysSep = src => {
    if (!src) {
        return '';
    }
    return path.normalize(src).replace(/\\\\|\\|\//g, path.sep);
};

/**
 * 判断**给定的路径是否存在**，无论是文件夹还是指定的文件
 * @param {string} targetPath 目标路径
 * @param {array} suffixs 文件后缀名
 */
exports.pathExistSync = function pathExistSync(
    targetPath,
    suffixs = ['.jsx', '.js']
) {
    if (fs.existsSync(targetPath)) {
        return true;
    }
    return suffixs.some(suffix => {
        try {
            const file = fs.statSync(targetPath + suffix);
            return file && file.isFile();
        } catch (err) {
            return false;
        }
    });
};
