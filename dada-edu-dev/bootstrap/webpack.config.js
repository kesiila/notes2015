"use strict";
var webpack = require("webpack"),
    path = require("path");
var APP = __dirname + '/webapp';

module.exports = {
    context: APP,
    entry: {
        index: ['build/index/bootstrap.js']
    },
    output: {
        path: APP,
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.scss/,
                loader: 'style!css!sass'
            },
            {
                test: /\.css/,
                loader: 'style!css'
            },
            {
                test: /\.html/,
                loader: 'raw'
            },
            {
                test: /\.json/,
                loader: 'json'
            },
            {
                test: '/\.js/',
                loader: 'babel!jshint',
                exclude: /node_modules|bower_components/
            },
            {
                test: /\.(woff|woff2|ttf|eot|svg|png|jpg)(\?]?.*)?$/,
                loader: 'file-loader?name=res/[name].[ext]?[hash]'
            }
        ]
    },
    plugins: [

    ],
    resolve: {
        root: APP,
        modulesDirectories: ["node_modules", "bower_components"]
    }
}
