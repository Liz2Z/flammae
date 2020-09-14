'use strict';

const execute = require('./execute');
const { parallel, serial } = require('./tasksType');

module.exports = {
    parallel,
    serial,
    execute,
};
