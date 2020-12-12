// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path');

var server1 = "http://127.0.0.1";
var server2 = "http://121.40.245.205";
var server3 = "http://121.40.236.55";

module.exports = {
    build: {
        env: require('./prod.env'),
        index: path.resolve(__dirname, '../dist/index.html'),
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: '',
        assetsPublicPath: '/',
        productionSourceMap: true,
        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],
        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        bundleAnalyzerReport: process.env.npm_config_report,
    },
    release: {
        env: require('./release.env'),
        index: path.resolve(__dirname, '../dist/index.html'),
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: '',
        assetsPublicPath: '/',
        productionSourceMap: true,
        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],
        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        bundleAnalyzerReport: process.env.npm_config_report,
    },
    dev: {
        env: require('./dev.env'),
        port: 8083,
        autoOpenBrowser: false,
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {
            // '/api/zuul': {
            //     target: server + ':8002',
            //     changeOrigin: true,
            //     pathRewrite: {
            //         '^/api/zuul': '',
            //     },
            // },
/*            '/api': {
                target: server2 + ':8081',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '',
                },
            },*/
            '/api/merchant': {
                target: server2 + ':8031',
                changeOrigin: true,
                pathRewrite: {
                    '^/api/merchant': '',
                },
            },
            '/api/stat': {
                target: server2 + ':8032',
                changeOrigin: true,
                pathRewrite: {
                    '^/api/stat': '',
                },
            },
            '/api/system': {
                target: server3 + ':8041',
                changeOrigin: true,
                pathRewrite: {
                    '^/api/system': '',
                },
            },
        },
        // CSS Sourcemaps off by default because relative paths are "buggy"
        // with this option, according to the CSS-Loader README
        // (https://github.com/webpack/css-loader#sourcemaps)
        // In our experience, they generally work as expected,
        // just be aware of this issue when enabling this option.
        cssSourceMap: false,
    },
};
