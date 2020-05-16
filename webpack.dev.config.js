require('@babel/register'); // Required to transpile React code in template.js
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('./src/config').default;
const template = require('./src/template').default;

// Configuration for webpack-dev-server
module.exports = {
    mode: 'development',
    entry: ['react-hot-loader/patch', './src/client.js'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        filename: '[name].bundle.js'
    },
    devtool: 'inline-source-map', // Returns error details (e.g. line no.) from the source file not the file bundled by webpack
    devServer: {
        host: 'localhost',
        compress: true,
        port: 4000,
        proxy: {
            // Proxy all client-side api requests from the webpack dev server to the application server in local development
            '/api': 'http://localhost:4040',
            '/js': 'http://localhost:4040',
            '/css': 'http://localhost:4040'
        },
        historyApiFallback: true, // Use the HTML5 History API to forward all routes to index.html page
        disableHostCheck: true, // Allow any domain hosted on this machine to be used
        hot: true, // Enable hot reloads
        open: true, // Open page in browser on start
        overlay: {
            // Full-screen overlay in the browser for compiler errors only
            warnings: false,
            errors: true
        },
         // Reload the page on changes made to public assets such as css, js, images etc
        contentBase: 'public',
        watchContentBase: true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(), // Refresh html changes without reloading the page in browser
        new HtmlWebpackPlugin({
            templateContent: template({}, null, [], config.styles)
        })
    ],
    module: {
        rules: [
        {
            test: /\.(js|jsx)$/,
            include: [path.resolve(__dirname, 'src')],
            use: [
            {
                loader: 'babel-loader',
                options: { cacheDirectory: false }
            }
            ]
        },
        {
            test: /\.scss$/,
            use: [
                { loader: 'style-loader' },
                { loader: 'css-loader' },
                { loader: 'sass-loader' }
            ]
        }
        ]
    },
    resolve: {
        // Resolve extensions of files with the same name in the following order:
        extensions: ['.js', '.jsx', '.json']
    }
};
