'use strict';

const { TASKS, SERIAL, PARALLEL } = require('./tasksType');
const execSerial = require('./execSerial');

/**
 * **并行**执行
 */
module.exports = function execParallel(tasks = []) {
    if (!tasks.length) {
        return Promise.resolve();
    }
    const promisies = tasks
        .map(task => {
            if (!task[TASKS]) {
                // 在并行中再使用 promise是没有必要的，但是如果出现串并行任务嵌套的情况时，
                // 必须等到一个任务执行完才能执行另一个，此时promise是非常有必要的。例如：
                // `serial(task1, parallel(task2, task3), task4)`
                // 当执行到 parallel(task2, task3) 时，我们并不关心 task2 跟 task3哪个先执行。
                // 但是在使用了serial 的视情况下，我们必须保证 task4 要晚于 task2 跟 task3，
                // 当我们将 task2 与 task3 用promise包裹后，通过Promise.all([]).then() 就可以
                // 保证这一切有序执行。
                return new Promise(resolve => task.call(null, resolve));
            }

            if (task[SERIAL]) {
                return Promise.resolve(execSerial(task.tasks));
            }

            if (task[PARALLEL]) {
                throw Error(
                    'Some tasks like this `parallel( task1, task2, parallel(task3, task4) )` is not necessary,' +
                        'You can just write it like this `parallel(task1, task2, task3, task4)`'
                );
            }
            // TODO 也许这里应该报错
            return false;
        })
        .filter(Boolean);
    return Promise.all(promisies);
};
