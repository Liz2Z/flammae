const path = require('path');
const createFsMap = require('..');

const fsMap = createFsMap(path.resolve(__dirname, '../'));

console.log(
    fsMap.find(
        path.normalize(
            'D:\\Git\\flammae\\packages\\dir-watch\\fs-map\\__example__\\find2.js'
        )
    )
);
