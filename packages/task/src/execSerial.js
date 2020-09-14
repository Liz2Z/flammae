'use strict';

const { TASKS, SERIAL, PARALLEL } = require('./tasksType');
const execParallel = require('./execParallel');

function execTask(task, next) {
    if (!task[TASKS]) {
        task.call(null, next);
        return;
    }
    if (task[SERIAL]) {
        throw Error(
            'Some tasks like this `serial( task1, task2, serial(task3, task4) )` is not necessary,' +
                'You can just write it like this `serial(task1, task2, task3, task4)`'
        );
    }
    if (task[PARALLEL]) {
        // eslint-disable-next-line no-use-before-define
        execParallel(task.tasks).then(next);
        return;
    }
    // TODO: 报错
    next();
}

/**
 * **串行**执行
 */
module.exports = function execSerial(tasks = []) {
    if (!tasks.length) {
        return;
    }
    const copyTasks = [...tasks];
    const next = () => {
        if (copyTasks.length) {
            execTask(copyTasks.shift(), next);
        }
    };
    next();
};
