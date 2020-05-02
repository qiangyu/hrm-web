let proxyObj = {};
// proxyObj['/ws'] = {
//     ws: true,
//     target: "ws://localhost:8081"
// };
// proxyObj['/'] = {
//     ws: false,
//     target: 'http://47.106.99.53:8081',
//     changeOrigin: true,
//     pathRewrite: {
//         '^/': ''
//     }
// }
proxyObj['/'] = {
    ws: false,
    target: 'http://localhost:8081',
    changeOrigin: true,
    pathRewrite: {
        '^/': ''
    }
}
module.exports = {
    publicPath: '', 
    outputDir: 'dist', 
    assetsDir: 'static', 
    lintOnSave: process.env.NODE_ENV==='development', 
    devServer: {
        host: 'localhost',
        port: 8080,
        proxy: proxyObj
        // proxy: {
        //     '/api': {
        //         target: 'http://47.106.99.53:8081/',
        //         changeOrigin: true,
        //         pathRewrite: {
        //             '^/api': ''
        //         }
        //     }
        // }, 
    }
}