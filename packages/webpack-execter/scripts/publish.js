'use strict';

/* eslint-disable import/no-extraneous-dependencies */
const spawn = require('cross-spawn');

try {
    spawn.sync(
        'npm',
        ['config', 'set', 'registry', 'https://registry.npmjs.org'],
        {
            cwd: process.cwd(),
            stdio: 'inherit',
        }
    );
} catch (err) {
    process.exit(err);
}

let rawArgv;
try {
    rawArgv = JSON.parse(process.env.npm_config_argv);
} catch (error) {
    process.exit(error);
}
const cookedArgv = rawArgv.cooked;
const index = cookedArgv.indexOf('--otp');
let otp;
if (index !== -1) {
    otp = cookedArgv[index + 1];
}

try {
    spawn.sync('npm', ['version', 'patch'], {
        cwd: process.cwd(),
        stdio: 'inherit',
    });
} catch (err) {
    process.exit(err);
}

const cmds = ['publish'];
if (otp) {
    cmds.push(`--otp=${otp}`);
}

const child = spawn('npm', cmds, {
    cwd: process.cwd(),
    stdio: 'inherit',
});
child.on('error', err => {
    process.exit(err);
});
