"use strict";
exports.__esModule = true;
var webpack = require("webpack");
var path = require("path");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var target = (function () {
    // libraryTarget: "commonjs2"    
    return process.NODE_ENV === 'production' ? "window" : "umd";
}());
var config = {
    // entry: './src/example/log.ts',
    // entry: ['./src/example/data.ts', './src/example/log.ts'],
    entry: {
        main: "./src/example/login/login.tsx",
        vendor: ['react', 'react-dom', 'prop-types']
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].bundle.js',
        publicPath: 'build',
        libraryTarget: target,
        sourceMapFilename: '[name].[chunkhash].map'
    },
    resolve: {
        extensions: ['.ts', '.js', '.tsx', '.json']
    },
    // devtool: "source-map",
    module: {
        //configuration regarding modules,
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            {
                test: /\.tsx?$/,
                include: [path.resolve(__dirname, 'src')],
                exclude: [],
                enforce: "pre",
                loader: "ts-loader"
            },
            {
                test: /\.jsx?$/,
                enforce: "pre",
                loader: "babel-loader"
            }
        ]
    },
    plugins: [
        // new ExtractTextPlugin('style.css')
        new HtmlWebpackPlugin({
            template: './index.html',
            inject: 'body'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            names: [
                'vendor'
            ],
            minChunks: 1
        }),
        new ExtractTextPlugin({
            filename: "style.css"
        })
    ]
};
exports["default"] = config;
