const path = require('path');
const createFsMap = require('../index');

const filename = path.resolve(__dirname, '../');
const fsMap = createFsMap(filename);
fsMap.watch(() => {
    fsMap.traverse({
        doc(file) {
            console.log(file);
        },
    });
});
