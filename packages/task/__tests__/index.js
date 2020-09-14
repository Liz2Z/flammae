'use strict';

const { serial, parallel } = require('../src/index.js');

console.log('start');

function task1(done) {
    console.log(1);
    done();
}

function task2(done) {
    setTimeout(() => {
        console.log(2);
        done();
    }, 1000);
}

function task3(done) {
    Promise.resolve(3).then(res => {
        console.log(res);
        done();
    });
}

function task4(done, {}) {
    console.log(4);
    done();
}

executor(serial(task3, task1, parallel(task2, task4)));
