'use strict';

const TASKS = Symbol('tasksType');

const PARALLEL = Symbol('parallel');

/**
 * 将传入的任务注册为并行任务
 */
function parallel(...tasks) {
    return {
        [TASKS]: true,
        [PARALLEL]: true,
        tasks,
    };
}

const SERIAL = Symbol('serial');

/**
 * 将传入的任务注册为串行任务
 */
function serial(...tasks) {
    return {
        [TASKS]: true,
        [SERIAL]: true,
        tasks,
    };
}

exports.parallel = parallel;
exports.serial = serial;
exports.SERIAL = SERIAL;
exports.PARALLEL = PARALLEL;
exports.TASKS = TASKS;
