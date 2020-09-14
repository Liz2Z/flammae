'use strict';

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');

module.exports = function createProject(projectName, projectRoot) {
    /**
     * 创建项目
     */
    function run() {
        console.log();
        console.log(`正在 ${chalk.cyan(projectRoot)} 文件夹下创建项目... `);
        // 拷贝文件夹
        try {
            fs.copySync(
                path.resolve(__dirname, 'createProjectTpl'),
                projectRoot
            );
        } catch (err) {
            throw err;
        }
        console.log();
        console.log('创建完成。');
        console.log();
        console.log(`执行 ${chalk.cyan(`cd ${projectName}`)} 进入项目目录`);
        console.log();
        console.log(`然后执行 ${chalk.cyan('flammae run dev')} 开始开发`);
        console.log();
    }

    // 判断文件夹是否已被占用
    //  -- 占用。退出程序
    //  -- 没占用。创建文件夹
    process.once('exit', code => {
        if (code === -1) {
            return;
        }
        fs.remove(projectRoot, err => {
            if (err) {
                throw err;
            }
        });
    });

    if (fs.existsSync(projectRoot)) {
        inquirer
            .prompt({
                type: 'confirm',
                message: `项目名称 ${projectName} 已被占用，是否覆盖？（将删除文件夹内所有内容）`,
                default: false,
                name: 'overwrite',
            })
            .then(res => {
                console.log();
                if (!res.overwrite) {
                    process.exit(0);
                    return;
                }
                console.log('正在清理文件夹...');
                fs.emptyDirSync(projectRoot);
                console.log();
                console.log('清理完成');
                run();
            })
            .catch(err => {
                console.log();
                console.log(chalk.red('文件夹清理失败，请手动清理'));
                throw err;
            });
    } else {
        fs.ensureDirSync(projectRoot);
        run();
    }
};
