'use strict';

const { SERIAL, PARALLEL } = require('./tasksType');
const execSerial = require('./execSerial');
const execParallel = require('./execParallel');

/**
 * **执行**
 */
function execute(task, ...restTasks) {
    if (!task) {
        return;
    }

    const type = typeof task;

    if (!['object', 'function'].includes(type)) {
        throw TypeError('Invalid task type.');
    }

    if (task[SERIAL]) {
        execSerial(task.tasks);
    } else if (task[PARALLEL]) {
        execParallel(task.tasks);
    } else {
        execSerial([task].concat(restTasks));
    }
}

module.exports = execute;
