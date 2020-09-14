'use strict';

const fs = require('fs-extra');
const chalk = require('chalk');
const webpack = require('webpack');

module.exports = function runBuild(webpackConfig) {
    /**
     * 环境变量
     */
    const MODE = 'production';
    process.env.BABEL_ENV = MODE;
    process.env.NODE_ENV = MODE;

    const { output: { path: buildPath } = {} } = webpackConfig;

    console.log();
    if (fs.existsSync(buildPath)) {
        console.log(chalk.cyan('正在清理旧的打包文件...'));
        fs.removeSync(buildPath);
        console.log();
        console.log(chalk.cyan('开始重新打包...'));
    } else {
        console.log(chalk.cyan('开始打包...'));
    }

    const compiler = webpack(webpackConfig);

    compiler.run((err, stats) => {
        if (err) {
            console.log();
            console.error(err);
            process.exit(1);
            return;
        }
        const messages = stats.toJson({
            all: false,
            warnings: true,
            errors: true,
        });

        if (!messages.errors.length && !messages.warnings.length) {
            console.log();
            console.log(chalk.green(`打包完成：${buildPath}`));
        } else {
            console.log();
            console.log(chalk.red('编译出错！'));
            console.log();
            if (messages.errors.length) {
                console.log(chalk.red('错误信息：'));
                messages.errors.forEach(error => console.log(`${error}\n`));
            }
            if (messages.warnings.length) {
                console.log(chalk.yellow('警告信息：\n'));
                messages.warnings.forEach(warning =>
                    console.log(`${warning}\n`)
                );
            }
        }
    });
};
