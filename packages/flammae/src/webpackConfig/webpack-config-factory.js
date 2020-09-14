'use strict';

/* eslint-disable no-underscore-dangle */
const webpack = require('webpack');
const merge = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const safePostCssParser = require('postcss-safe-parser');

module.exports = function webpackConfigFactory(
    {
        mode,
        entry, // 项目入口文件的路径
        outputPath, // 项目打包路径
        publicPath, // publicPath
        htmlTemplate, // html模板文件路径
        htmlTitle = 'App',
        dropConsole = true,
        dropDebugger = true,
    } = {},
    webpackConfig
) {
    const __DEV__ = mode === 'development';
    const __PROD__ = mode === 'production';

    let devtool;
    if (__PROD__) {
        devtool = 'cheap-eval-source-map';
    } else if (__DEV__) {
        devtool = 'source-map';
    } else {
        devtool = false;
    }

    const defaultConfig = {
        // 设置为true, webpack 在遇到错误时 立即停止编译
        bail: __PROD__,
        mode,
        devtool,
        // 如果传递的是字符串或字符串数组，则只会打包成一个文件（一个入口文件），默认名称为 main
        // 如果传递的是一个对象，则对象的每个key都会生成一个包（多入口）
        // Simple rule: one entry point per HTML page.
        // SPA: one entry point, MPA: multiple entry points.
        // 一般只使用一个入口就ok
        entry,
        output: {
            // 打包文件保存的文件夹路径
            path: outputPath,
            // -- 指定了每个入口文件打包输出文件的名称。入口文件跟 webpackOptions.entry配置有关
            // 如果项目只有一个入口文件， 则可以设置一个静态名 'bundle.js'
            // 如果项目有多个入口文件，则需要使用动态方式给每个包设置唯一的文件名 '[name].js'
            // 一般只有一个入口文件
            filename: `static/js/[name]${__DEV__ ? '.bundle' : '.[hash:8]'}.js`,
            // webpack 默认会将 所有的代码打包到一个文件中，但是如果使用了代码分割插件
            // 该插件就会帮助你按照配置分割代码，比如：
            // 1. 将 引入的 node_modules 中的代码提出了生成一个单独的文件 vendors.js，
            // 因为这些代码大多不会经常变动，所以单独分离出来便于浏览器进行缓存
            // 2. 一些 被异步加载包 依赖的 公用代码 会被分离出来 以节省流量
            // -- 选项就是规定 如何命名这些 分割代码文件的名称
            chunkFilename: `static/js/[name]${
                __DEV__ ? '' : '.[chunkhash:8]'
            }.chunk.js`,
            // 对于按需加载或加载外部资源（如图片、文件等）来说，
            // output.publicPath 是很重要的选项。如果指定了一个错误的值，则在加载这些资源时
            // 会收到 404 错误。

            // 此选项指定在浏览器中所引用的「此输出目录对应的公开 URL」。相对 URL会被相对于
            // HTML 页面（或 <base> 标签）解析。相对于服务的 URL，相对于协议的 URL
            // 或绝对 URL(absolute URL) 也可是可能用到的，或者有时必须用到，
            // 例如：当将资源托管到 CDN 时。

            // 该选项的值是以 runtime(运行时) 或 loader(载入时) 所创建的每个 URL 为前缀。
            // 因此，在多数情况下，此选项的值都会以/结束。默认值是一个空字符串 ""。
            publicPath,
            // 告诉webpack在打包的代码中通过注释 指明 所引入模块的信息。
            // 此选项在开发中默认为true，在生产模式中为false。
            pathinfo: __DEV__,
        },
        resolve: {
            extensions: ['.js', '.jsx', '.json'],
            // 搜索顺序， 前 => 后
            // modules: [
            //     'node_modules',
            // ],
        },
        // webpack 会根据默认的optimization 配置 自动优化代码
        // 但是我们可以自定义一些我们想要的功能
        // 文档：https://webpack.js.org/configuration/optimization/
        optimization: {
            // 只在build时，才启用minimizer
            minimize: __PROD__,
            minimizer: [
                // TerserPlugin插件 会使用 terser 来压缩 js 代码
                // 文档：https://webpack.js.org/plugins/terser-webpack-plugin/
                new TerserPlugin({
                    // terser 的设置见：https://github.com/terser-js/terser#minify-options
                    terserOptions: {
                        parse: {
                            // 不允许使用顶级 return,  即 直接在模块中 写 return
                            // 默认就是 false。
                            bare_returns: false,
                            // 让terser能够解析 es8 标准的语法. （就是让terser能看懂es8语法）
                            ecma: 8,
                        },
                        compress: {
                            warnings: false,
                            // 修改代码以优化二进制计算，例如：(a <= b) → a > b。默认为：true
                            // 但是容易导致bug，故设为false
                            // https://github.com/facebook/create-react-app/issues/2376
                            // Pending further investigation:
                            // https://github.com/mishoo/UglifyJS2/issues/2011
                            comparisons: false,
                            // 默认为 3 可能导致bug
                            inline: 2,
                            // 从代码中删掉 console.*
                            drop_console: dropConsole,
                            // 默认就是true
                            drop_debugger: dropDebugger,
                        },
                        mangle: {
                            // 绕过 safari10循环迭代器 bug, 不能连续声明变量两次
                            safari10: true,
                        },
                        output: {
                            // 使用对应ecma规范来输出代码，例如：如果设置成 es6， 将会输出 {a} 而不是 {a: a}
                            // 注意：这个选项只是设置 terer的输出模式，并不会将你代码中的 es6 7 标准代码转成 es5
                            // 转换代码靠的还是 babel
                            ecma: 5,
                            // 去掉comments
                            comments: false,
                            // 转义字符串和regexp中的Unicode字符
                            // 如果不开启，压缩后的emoji 和正则表达式 可能不正确
                            ascii_only: true,
                        },
                    },
                    // 启用多线程并发，提高打包速度
                    // 默认并发线程数 为：os.cpus().length - 1
                    parallel: true,
                    // 启用文件缓存， 提高重复打包时的速度
                    cache: true,
                    // 启用sourceMap 以将错误信息映射到对应模块。类似于 devtool: sourceMap
                    // 虽然启用会拖慢打包速度，但是非常有必要打开，便于打包后的错误调试
                    sourceMap: true,
                }),
                // 使用OptimizeCSSAssetsPlugin来压缩css 代码
                // 文档：https://github.com/NMFR/optimize-css-assets-webpack-plugin
                new OptimizeCSSAssetsPlugin({
                    cssProcessorOptions: {
                        parser: safePostCssParser,
                        map: {
                            // 设置false, 强制将 sourcemap单独输出成一个文件，毕竟放在css文件中会让css文件变大
                            inline: false,
                            // 设置为true , 会将 sourceMappingURL 放在css 文件末尾，以帮助浏览器找到 sourceMap
                            annotation: true,
                        },
                    },
                }),
            ],
            // webpack4默认使用 SplitChunksPlugin 插件进行js代码分割
            // 文档：https://webpack.js.org/plugins/split-chunks-plugin/
            // 配置规则。
            splitChunks: {
                // 提取公用代码块， 设为 'all' 意味着可以提取 异步加载模块和非异步加载的模块 的公用代码
                chunks: 'all',
                // webpack4推荐不开启：
                // > It is recommended to set splitChunks.name to false for production builds
                // > so that it doesn't change names unnecessarily.
                // 但是，开启了之后打包的js文件名称就很直观，所以还是开着
                name: true,
                // 文件名默认使用 '-' 做连接符
                automaticNameDelimiter: '-',
            },
            // webpack生成的的runtime代码块，用于加载其他代码块
            // 分离出来让浏览器进行长时间缓存
            runtimeChunk: {
                name: 'runtime',
            },
        },
        module: {
            rules: [
                {
                    parser: {
                        // 禁止使用require.ensure(), 这是个不标准的语法，不要用
                        requireEnsure: false,
                    },
                },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: htmlTemplate,
                templateParameters: Object.assign({
                    title: htmlTitle,
                    PUBLIC_URL: publicPath,
                }),
            }),

            /**
             * 定义在js中全局可用的静态变量。process.env.NODE_ENV是通用的规则。
             * 尽量少的定义全局静态变量，过多的全局静态变量会导致代码可读性变差
             */
            new webpack.DefinePlugin(
                Object.assign(
                    {},
                    {
                        'process.env.NODE_ENV': JSON.stringify(mode),
                        __DEV__: JSON.stringify(__DEV__),
                        __PROD__: JSON.stringify(__PROD__),
                    }
                )
            ),

            /**
             * 分离 CSS
             */
            __PROD__ &&
                new MiniCssExtractPlugin({
                    filename: 'static/css/[name].[contenthash:8].css',
                    chunkFilename:
                        'static/css/[name].[contenthash:8].chunk.css',
                }),

            /**
             * HMR
             */
            __DEV__ && new webpack.HotModuleReplacementPlugin(),

            /**
             * 打包后生成可视化的视图，分析打包了哪些文件
             */
            __PROD__ && new BundleAnalyzerPlugin(),
        ].filter(Boolean),
        performance: {
            hints: false,
        },
    };

    /**
     * 配置
     */
    return merge(defaultConfig, webpackConfig);
};
