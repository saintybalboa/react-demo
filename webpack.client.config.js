const path = require('path');

module.exports = {
    mode: 'production',
    entry: {
        // Client side javascript files bundled with React
        vendor: ['@babel/polyfill', 'react'],
        client: ['./src/client.js']
    },
    output: {
        path: path.resolve(__dirname, './'), // Set to root of project
        filename: 'public/js/[name].js' // Saves the following bundled files to the destination folder /public/js/: client.js, vendor.js
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
    target: "web", // Compile for usage in the browser, catering for use of window and document objects
    resolve: {
        extensions: ['.js', '.jsx', '.json']
    }
};
