'use strict';

const createFsMap = require('@flammae/fs-map');

function glob(globText, { cwd = process.cwd() } = {}) {
    const isString = typeof globText === 'string';
    const isArray = Array.isArray(globText);
    if (!isString && !isArray) {
        throw Error('need glob text');
    }

    const traverseObj = {};
    const result = [];
    if (isString) {
        Object.defineProperty(traverseObj, globText, {
            value: node => {
                result.push(node);
            },
        });
    } else {
        globText.forEach(item => {
            if (typeof item !== 'string') {
                throw Error('');
            }
            Object.defineProperty(traverseObj, item, {
                value: node => {
                    result.push(node);
                },
            });
        });
    }

    const fsMap = createFsMap(cwd);

    fsMap.traverse(traverseObj);

    return result;
}

module.exports = glob;
