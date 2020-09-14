'use strict';

const chalk = require('chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const { clearConsole, address } = require('./helpers');
/**
 * webpack-dev-server配置
 */
const defaultServerConfig = require('./dev-server-config');

module.exports = function runServer(webpackConfig, devServerConfig) {
    const MODE = 'development';
    process.env.BABEL_ENV = MODE;
    process.env.NODE_ENV = MODE;

    /**
     * webpack-dev-server 的配置
     */
    const mergedServerConfig = Object.assign(
        {},
        defaultServerConfig,
        devServerConfig
    );
    const { host = '0.0.0.0', port } = mergedServerConfig;

    const isCustomHost = host !== '0.0.0.0';

    /**
     * webpack compiler
     */
    const createCompiler = () => {
        const compiler = webpack(webpackConfig);

        compiler.hooks.done.tap('done', stats => {
            const messages = stats.toJson({
                all: false,
                warnings: true,
                errors: true,
            });
            const compileSuccessful =
                !messages.errors.length && !messages.warnings.length;

            // 首次编译成功后（npm start）时执行
            if (compileSuccessful) {
                clearConsole();
                console.log(chalk.green('Compiled successfully!'));
                console.log();
                console.log('You can now view this app in the browser.');
                console.log();
                const PORT = chalk.whiteBright(port);
                if (!isCustomHost) {
                    console.log(`Local:           http://localhost:${PORT}/`);
                    console.log(
                        `On Your Network: http://${address.ip()}:${PORT}/`
                    );
                } else {
                    console.log(`On Your Network: http://${host}:${PORT}/`);
                }
            } else {
                console.log();
                if (messages.warnings.length) {
                    console.log(chalk.yellow('警告信息：\n'));
                    messages.warnings.forEach(warning =>
                        console.log(`${warning}\n`)
                    );
                }
                if (messages.errors.length) {
                    console.log(chalk.red('错误信息：\n'));
                    messages.errors.forEach(error => console.log(`${error}\n`));
                }
            }
        });

        return compiler;
    };

    /**
     * HMR 模块热替换
     * https://webpack.docschina.org/guides/hot-module-replacement/
     */
    WebpackDevServer.addDevServerEntrypoints(webpackConfig, mergedServerConfig);

    /**
     * 创建webpack compiler
     */
    const compiler = createCompiler();

    /**
     * 创建server
     */
    const server = new WebpackDevServer(compiler, mergedServerConfig);

    /**
     * 启动服务
     */
    server.listen(port, host, err => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        clearConsole();
        console.log();
        console.log('The service is starting.');
    });
};
