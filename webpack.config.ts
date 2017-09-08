import * as webpack from 'webpack';
import * as path from 'path';
import * as ExtractTextPlugin from 'extract-text-webpack-plugin';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
declare var __dirname;
declare var process;

const target = (function () {
    // libraryTarget: "commonjs2"    
    return process.NODE_ENV === 'production' ? "window" : "umd"
}());

const config: webpack.Configuration = {
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
                loader: "babel-loader",
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

export default config;