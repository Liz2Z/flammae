'use strict';

const glob = require('./glob');

class Src {
    constructor(
        globText,
        { cwd = process.cwd(), readFile = false, watch = false } = {}
    ) {
        if (!globText) {
            throw Error('The glob text is required.');
        }
        this._watch = watch;
        this._readFile = readFile;
        this._callback = () => null;
        this._filenames = [];
        this._files = [];

        glob(globText, {
            cwd,
        }).forEach(fsNode => {
            this._filenames.push(fsNode.absPath);

            if (readFile) {
                this._files.push({
                    filename: fsNode.absPath,
                    data: fsNode.readFileSync(),
                });
            }
        });
    }

    then(callback) {
        if (typeof callback !== 'function') {
            throw Error('Expected the callback to be a function.');
        }
        this._callback = callback;
        this._exec();
    }

    _exec() {
        const result = this._readFile ? this._files : this._filenames;
        this._callback(result);
    }
}

function createSrc(globalOptions) {
    return [
        'src',
        /**
         * 通过用户提供的glob读取文件
         */
        function src(globText, options) {
            return new Src(globText, Object.assign({}, globalOptions, options));
        },
    ];
}

module.exports = createSrc;
