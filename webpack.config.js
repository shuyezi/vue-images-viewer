/**
 * Created by jimmy on 2017/6/5.
 */
const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: ['./examples/index.js'],
    output: {
        path: path.resolve(__dirname, 'examples', 'dist'),
        filename: 'build.js'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        js: 'babel-loader'
                    }
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    }
}