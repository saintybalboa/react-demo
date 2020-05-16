const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'production',
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
                    loader: 'babel-loader', // Ask bundler to use babel loader to transpile es2015 code
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                },
                exclude: [/node_modules/]
            },
            {
                test: /\.scss$/,
                use: [
                    { loader: MiniCssExtractPlugin.loader }, // Extracts css into a file that can be served by the web browser when js is disabled.
                    { loader: 'css-loader' }, // Interprets @import/url() as import/require() within the js and resolves them
                    { loader: 'sass-loader' } // Loads a Sass/SCSS file and compiles it to CSS.
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
        // Resolve extensions of files with the same name in the following order:
        extensions: ['.js', '.jsx', '.json']
    },
    plugins: [
        new MiniCssExtractPlugin({
          // Save to a static css file in the public directory
          filename: '../public/css/index.css'
        })
    ]
};
