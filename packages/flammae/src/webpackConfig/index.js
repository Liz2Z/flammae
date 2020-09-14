'use strict';

/* eslint-disable no-underscore-dangle */
const { sepToModuleSystem } = require('@flammae/helpers');
const webpackConfigFactory = require('./webpack-config-factory');
const getStyleLoader = require('./style-loader');
const getResolveApp = require('../shared/getResolveApp');
const schema = require('../schema');
const paths = require('../paths');

const { appTemplateHtml, templates, nodeModule } = paths;

module.exports = function flammaeWebpackConfigFactory({
    mode,
    entry,
    style,
    cwd,
    publicPath = './',
    ...baseOptions
}) {
    // const __DEV__ = mode === 'development';
    const __PROD__ = mode === 'production';
    const resolveApp = getResolveApp(cwd);

    const flammaeJsFile = resolveApp(schema.flammaeJsFile);
    const appDefaultDist = resolveApp(schema.appDistDir);
    const appFlammae = resolveApp(schema.appFlammaeDir);
    const nodeModules = [
        'node_modules',
        resolveApp('node_modules'),
        nodeModule,
    ];

    const stylesLoader = getStyleLoader({
        mode,
        style,
        publicPath,
        paths: nodeModules,
    });

    const config = {
        resolve: {
            alias: {
                flammae: sepToModuleSystem(flammaeJsFile),
            },
            modules: nodeModules,
        },
        module: {
            rules: [
                // 代码静态语法检测, 在根目录的 .eslintrc.js 中配置规则
                {
                    test: /\.(js|jsx)$/,
                    enforce: 'pre',
                    include: appFlammae,
                    use: [
                        {
                            options: {
                                eslintPath: require.resolve('eslint'),
                                baseConfig: {
                                    extends: 'eslint:recommended',
                                },
                            },
                            loader: require.resolve('eslint-loader'),
                        },
                    ],
                },
                {
                    oneOf: [
                        {
                            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                            loader: require.resolve('url-loader'),
                            options: {
                                limit: 10000,
                                name: 'static/media/[name].[hash:8].[ext]',
                            },
                        },
                        {
                            test: /\.md$/,
                            loader: require.resolve('@flammae/markdown-loader'),
                            options: {
                                publicPath,
                            },
                        },
                        {
                            test: /\.(js|jsx)$/,
                            include: [appFlammae, templates],
                            loader: require.resolve('babel-loader'),
                            options: {
                                presets: [
                                    require.resolve('babel-preset-react-app'),
                                ],
                                // import() 动态语法支持
                                plugins: [
                                    require.resolve(
                                        '@babel/plugin-syntax-dynamic-import'
                                    ),
                                ],
                                // 启用缓存，这是webpack针对“babel-loader”的特性(不是babel本身的)。
                                // 将会在./node_Module/.cache/babel-loader/目录中保存缓存结果
                                // 对于多次的run build 会节省大量时间
                                cacheDirectory: true,
                                cacheCompression: __PROD__,
                                compact: __PROD__,
                            },
                        },
                        ...stylesLoader,
                        {
                            loader: require.resolve('file-loader'),
                            exclude: [/\.(js|jsx)$/, /\.html$/, /\.json$/],
                            options: {
                                name: 'static/media/[name].[hash:8].[ext]',
                            },
                        },
                    ],
                },
            ],
        },
    };

    return webpackConfigFactory(
        {
            mode,
            entry,
            publicPath,
            htmlTemplate: appTemplateHtml, // html模板文件路径
            outputPath: appDefaultDist,
            ...baseOptions,
        },
        config
    );
};
