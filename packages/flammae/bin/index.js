#!/usr/bin/env node

'use strict';

process.on('uncaughtException', err => {
    console.log('uncaughtException: ');
    throw err;
});
process.on('unhandledRejection', err => {
    console.log('unhandledRejection: ');
    throw err;
});
process.on('exit', code => {
    console.log(`exit code: ${code}`);
});

const path = require('path');
const program = require('commander');
const chalk = require('chalk');
const spawn = require('cross-spawn');
const packageJSON = require('../package.json');
const createProject = require('./createProject');
const flammaeStart = require('../lib/index');
const readConfig = require('./readConfig.js');

/**
 * 打印帮助信息
 * @param {string} command
 */
function printCliHelp(command) {
    if (command) {
        console.log(`无效的指令：${command}\n`);
    }
    console.log(
        `使用 ${chalk.cyan(
            'flammae create 项目名'
        )} 指令创建一个flammae项目。\n`
    );
    console.log(`使用 ${chalk.cyan('flammae run <cmd>')} 执行指令。\n`);
    console.log(`输入 ${chalk.cyan('flammae -h')} 查看更多\n`);
    process.exit(0);
}

if (!process.argv.slice(2).length) {
    printCliHelp();
} else {
    // flammae create prooject-name
    program
        .version(packageJSON.version)
        .command('create [project-directory]')
        .description('创建一个flammae项目')
        .action(projectName => {
            console.log();
            if (!projectName) {
                console.log(
                    chalk.yellow('给你的项目起个名字，例如：'),
                    chalk.cyan('flammae create 我的项目名 \n')
                );
                process.exit(0);
                return;
            }
            createProject(
                projectName,
                path.resolve(process.cwd(), projectName)
            );
        });

    // flammae run ...
    // 启动引擎
    const cmdMap = {
        dev: 'development',
        build: 'production',
    };

    program.command('run <cmd>').action(cmd => {
        if (['dev', 'build'].includes(cmd)) {
            const config = readConfig();
            flammaeStart(Object.assign({}, config, { mode: cmdMap[cmd] }));
            return;
        }

        let child = null;
        child = spawn('npm', ['run', cmd], {
            cwd: path.resolve(process.cwd()),
            stdio: 'inherit',
        });
        child.on('close', code => {
            if (code !== 0) {
                console.log(`run ${cmd} failed`);
            }
        });
    });

    program.on('command:*', printCliHelp);

    program.parse(process.argv);
}
