const path = require('path');
const fs = require('fs');
const { executor, serial } = require('../lib');

const dir = path.resolve(__dirname, '../');

function Task(done) {
    src('/lib/**/index.js', { watch: true }).then(files => {
        console.log(123456);
        console.log(text);
    });
    done();
}

const exec = executor.use(
    src({
        cwd: __dirname,
        readFile: true,
    })
);

exec.exec(serial(Task));
