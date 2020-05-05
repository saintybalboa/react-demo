const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const clientSideConfig = {
    mode: "production",
    entry: {
        // Client side javascript files bundled with React
        vendor: ['@babel/polyfill', 'react'],
        client: ['./src/client.js']
    },
    output: {
        path: path.resolve(__dirname, './', 'public/js'), // Destination folder for the client side bundled output is /public/js/
        filename: '[name].js' // Saves the following bundled files to the destination folder: client.js, vendor.js
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: {
                    loader: 'babel-loader', // Asks bundler to use babel loader to transpile es2015 code
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                },
                exclude: [/node_modules/]
            },
            {
                test: /\.scss$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader'},
                    { loader: 'sass-loader' }
                ]
            }
        ]
    },
    target: "web", // compile for usage in the browser, catering for use of window and document objects
    resolve: {
        // If multiple files share the same name but have different extensions, webpack will resolve the one with the extension listed first in the array and skip the rest.
        extensions: ['.js', '.jsx', '.json']
    }
};

const serverSideConfig = {
    mode: "production",
    entry: {
        // Server side javascript file (entry point for starting the express server)
        server: ['./src/server.js']
    },
    output: {
        path: path.resolve(__dirname, './', 'build'), // Destination for the server side bundled output is under ./build
        filename: '[name].js' // Saves the following bundled file to the destination folder
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: {
                    loader: 'babel-loader', // Asks bundler to use babel loader to transpile es2015 code
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                },
                exclude: [/node_modules/]
            },
            {
                test: /\.scss$/,
                use: [
                    { loader: MiniCssExtractPlugin.loader },
                    { loader: 'css-loader' },
                    { loader: 'sass-loader' },
                ],
                exclude: [/node_modules/]
            }
        ]
    },
    target: 'node',
    node: {
        // Need this when working with express, otherwise the build fails
        __dirname: false,
        __filename: false
    },
    resolve: {
        // If multiple files share the same name but have different extensions, webpack will resolve the one with the extension listed first in the array and skip the rest.
        extensions: ['.js', '.jsx', '.json']
    },
    plugins: [
        new MiniCssExtractPlugin({
          // Save to a static css file in the public directory
          filename: "../public/css/components.css"
        }),
    ]
};


module.exports = [clientSideConfig, serverSideConfig];
