const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'production',
    entry: {
        // Server side javascript file (entry point for starting the express server)
        server: ['./src/server.js']
    },
    output: {
        path: path.resolve(__dirname, './'), // Set to root of project
        filename: 'build/[name].js' // Saves the following bundled files to the destination folder build/server.js
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
                exclude: [/node_modules/, /public/, /build/]
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
                        outputPath: './public/images' // Relative folder path to store generated image files
                    }
                }
            },
            {
                test: /\.svg$/,
                use: { loader: '@svgr/webpack' } // Inlines the images as data URLs to elminate the added the network request
            }
        ]
    },
    target: "node", // Compile for usage in a Node.Js environment.
    resolve: {
        extensions: ['.js', '.jsx', '.json']
    },
    plugins: [
        new MiniCssExtractPlugin({
          // Save to a static css file in the public directory
          filename: './public/css/index.css'
        })
    ]
};
