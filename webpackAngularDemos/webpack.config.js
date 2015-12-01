"use strict";
var webpack = require('webpack'),
    path = require('path');

var APP = __dirname + '/app';

module.exports = {
    context: APP, //上下文路径
    entry: { //入口
        app: ['webpack/hot/dev-server', './core/bootstrap.js'] //入口文件
    },
    output: {
        path: APP,
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.scss$/,
                loader: 'style!css!sass'
            },
            {
                test: /\.css$/,
                loader: 'style!css'
            },
            {
                test: /\.html$/,
                loader: 'raw'
            },
            {
                test: /\.json$/,
                loader: 'json'
            },
            {
                test: /\.js$/,
                loader: 'babel!jshint',
                exclude: /node_modules|bower_components/
            }, {
                test: /\.(woff|woff2|ttf|eot|svg)(\?]?.*)?$/,
                loader: 'file-loader?name=res/[name].[ext]?[hash]'
            }
        ]
    },
    plugins: [ //插件相关
        new webpack.HotModuleReplacementPlugin(), //热替换插件,以对象形式注入
        new webpack.DefinePlugin({
            MODE: {
                production: process.env.NODE_ENV === 'production'
            }
        })
    ],
    resolve: {
        root: __dirname + '/app'
    }
};
