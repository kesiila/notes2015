"use strict";
var webpack = require('webpack'),
    path = require('path');

var APP = __dirname + '/app';

module.exports = {
    context: APP, //上下文路径
    entry: { //入口
        app: ['webpack/hot/dev-server', './core/bootstrap.js'] //入口文件
    },
    plugins: [ //插件相关
      new webpack.HotModuleReplacementPlugin()  //热替换插件,以对象形式注入
    ],
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
                test: /\.js$/,
                loader: 'babel!jshint',
                exclude: /node_modules|bower_components/
            }
        ]
    }
};
