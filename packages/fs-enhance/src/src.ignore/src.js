'use strict';

const fs = require('fs');
const createFsMap = require('@flammae/fs-map');

class Src {
    constructor(URL) {
        this._readStream = fs.createReadStream(URL, {
            autoClose: true,
        });
    }

    pipe(callback) {
        let data = '';
        const readStream = this._readStream;
        // readStream.setEncoding('utf8');
        readStream.on('data', chunk => {
            if (chunk.length) {
                data += chunk;
            }
        });
        readStream.on('end', () => {
            callback(data);
        });
        readStream.on('error', err => {
            throw err;
        });
    }
}

function createSrc(cwd) {
    const fsMap = createFsMap(cwd);
    /**
     * 通过用户提供的glob读取文件
     *
     */
    return [
        'src',
        function src(glob) {
            let fsReadStream;
            fsMap.traverse({
                [glob](node) {
                    fsReadStream = new Src(node.absPath);
                },
            });
            return fsReadStream;
        },
    ];
}

module.exports = createSrc;
