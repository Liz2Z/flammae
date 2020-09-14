const path = require('path');
const createFsMap = require('../index');

console.log(path.resolve(__dirname, '../'));
console.log(createFsMap(path.resolve(__dirname, '../')));
