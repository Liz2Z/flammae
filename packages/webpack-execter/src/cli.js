'use strict';

const program = require('commander');
const packageJson = require('../package.json');
const fns = require('./index');

const cmdMap = {
    server: fns.runServer,
    build: fns.runBuild,
};
// TODO: 待做
program.version(packageJson.version, '-v, --version');

// program.command('run <cmd>')
//     .description('run webpack')
//     .action((cmd) => {
//         if (cmdMap[cmd]) {
//             // cmd[map]
//         }
//     });

program.command('*').action(cmd => {
    console.log();
    console.log(`unknown cmd ${cmd}.`);
    console.log('cli not finish yet.');
    program.help();
});

program.parse(process.argv);
