'use strict';

module.exports = {
    // 对生成的文件启用gzip压缩
    compress: false,
    // 关闭WebPackDevServer自己的日志，因为它们通常没啥用。
    // 使用此设置时，它仍将显示编译警告和错误。
    clientLogLevel: 'none',

    // 告诉服务器从哪个目录中提供内容。只有在你想要提供静态文件时才需要。
    // devServer.publicPath 将用于确定应该从哪里提供 bundle，并且此选项优先。
    // 推荐使用绝对路径。默认情况下，将使用当前工作目录作为提供内容的目录，但是你可以修改为其他目录
    // 也可以从多个目录提供内容：
    // contentBase: [
    //      path.join(__dirname, 'public'),
    //      path.join(__dirname, 'assets')
    // ]
    // -----------------------------------------------------
    // contentBase: '',

    // 告知服务器，观察 devServer.contentBase 下的文件。文件修改后，会触发一次完整的页面重载。
    watchContentBase: true,
    // 启用热重载服务，
    hot: true,

    // It is important to tell WebpackDevServer to use the same "root" path
    // as we specified in the config. In development, we always serve from /.
    publicPath: '/',

    // public: true,

    // webpackDevServer的默认配置会在控制台输出太多信息，所以设置quiet: true 来禁用
    // 同时，我们通过node.js api方式开启服务，并在 `compiler.hooks[...].tap` 钩子被调用时，自定义日志信息
    quiet: true,
    // 是否使用https协议
    https: false,
    // 当路由模式 使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html。
    // 当路径中使用点(dot)（常见于 Angular），你可能需要使用：
    // historyApiFallback: {
    //   disableDotRule: true
    // }
    historyApiFallback: true,
    // 当出现编译器错误或警告时，禁止在浏览器中显示全屏覆盖层
    // 如果想要显示警告和错误  overlay: { warnings: true, errors: true }
    overlay: false,

    port: 8090,
};
