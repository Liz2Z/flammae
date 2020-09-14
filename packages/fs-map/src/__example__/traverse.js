const path = require('path');
const createFsMap = require('..');

const fsMap = createFsMap(path.resolve(__dirname, '../'));

fsMap.traverse({
    'create-file-sys-node': v => {
        console.log(v);
    },
});
