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
        path: path.resolve(__dirname, './'),
        publicPath: '/',
        filename: 'dist/[name].bundle.js'
    },
    devtool: 'inline-source-map', // Return error details (e.g. line no.) from the source file not the file bundled by webpack
    devServer: {
        host: 'localhost',
        compress: true,
        port: 4000,
        historyApiFallback: true, // Use the HTML5 History API to forward all routes to index.html page
        disableHostCheck: true, // Allow any domain hosted on this machine to be used
        hot: true, // Enable hot reloads
        open: true, // Open page in browser on start
        overlay: {
            // Full-screen overlay in the browser for compiler errors only
            warnings: false,
            errors: true
        },
         // Reload the page on changes are made to public assets such as css, js, images etc
        contentBase: 'public',
        watchContentBase: true,
        proxy: {
            // Proxy any requests for /api/* to the local application server http://localhost:4040/api/*
            '/api': 'http://localhost:4040'
        }
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(), // Refresh html changes without reloading the page in browser
        new HtmlWebpackPlugin({
            templateContent: template('', [], config.styles, null)
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
                    { loader: 'style-loader' }, // Creates the javascript to inject CSS into the DOM
                    { loader: 'css-loader' },   // Interprets @import/url() as import/require() within the js and resolves them
                    { loader: 'sass-loader' }   // Loads a Sass/SCSS file and compiles it to CSS.
                ]
            },
            {
                test: /\.(jpg|jpeg|png)$/,
                use: {
                    loader: 'url-loader', // Inline the images as data URLs to elminate the added the network request.
                    options: {
                        // Fall back to file-loader if the data URL increases the bundle size larger than limit (bytes)
                        // Generates image file and specifies URL path to image in the src when the limit is exceeded.
                        limit: 10000,
                        publicPath: '/images', // Relative URL path for images
                        outputPath: 'images' // Relative folder path to store image files to (webpack dev server in memory)
                    }
                }
            },
            {
                test: /\.svg$/,
                use: { loader: '@svgr/webpack' }
            }
        ]
    },
    resolve: {
        // If multiple files share the same name but have different extensions, webpack will resolve the one with the extension listed first in the array and skip the rest.
        extensions: ['.js', '.jsx', '.json', '.scss']
    }
};
