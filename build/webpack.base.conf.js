var path = require('path');
var utils = require('./utils');
var config = require('../config');
var vueLoaderConfig = require('./vue-loader.conf');
var webpack = require('webpack');

function resolve(dir) {
    return path.join(__dirname, '..', dir);
}

module.exports = {
    entry: {
        app: ['babel-polyfill', './src/main.js'],
    },
    output: {
        path: config.build.assetsRoot,
        filename: '[name].js',
        publicPath: process.env.NODE_ENV === 'production'
            ? config.build.assetsPublicPath
            : config.dev.assetsPublicPath
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src'),
            '@static': resolve('static'),
            // '$': resolve(__dirname, '../static/lib/jquery/jquery.min.js')
        }
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor",
            minChunks: function (module) {
                return module.context && module.context.includes("node_modules");
            }
        }),
        // new webpack.optimize.CommonsChunkPlugin('common.js'),
        new webpack.ProvidePlugin({
            jQuery: 'jquery',
            $: 'jquery',
            // Core: 'mizhi-ui-core/core',
            // Btbs: 'mizhi-ui-core/btbs',
            // Decimal: 'mizhi-ui-core/decimal',
            // DigestUtils: 'mizhi-ui-core/core.hash',
            Constant: '@/constant/Constant.js',
            VueHttp: '@/utils/VueHttp.js',
            ApiDataParse: '@/utils/ApiDataParse.js',
            Loading: '@/utils/Loading.js',
            UserAgent:'@/utils/UserAgent',
        })
    ],
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: vueLoaderConfig
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [
                    resolve('src'),
                    resolve('test'),
                    //resolve('node_modules/vue-select')
                    resolve('/node_modules/_element-ui@2.0.11@element-ui/src'),
                    resolve('/node_modules/_element-ui@2.0.11@element-ui/packages')
                ]
            },
            {
                test: /\.(png|jpe?g|gif|jpg|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('media/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            }
        ]
    }
};
