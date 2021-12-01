let proxyObj = {};
// proxyObj['/ws'] = {
//     ws: true,
//     target: "ws://localhost:8081"
// };
// 后端url
proxyObj['/'] = {
    ws: false,
    target: 'http://localhost:8081',
    changeOrigin: true,
    pathRewrite: {
        '^/': ''
    }
}

module.exports = {
    publicPath: '/', 
    outputDir: 'static', 
    assetsDir: 'static', 
    lintOnSave: process.env.NODE_ENV==='development', 
    devServer: {
        host: 'localhost',
        port: 8080,
        proxy: proxyObj
    }
}
