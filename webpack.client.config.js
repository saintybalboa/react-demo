var path = require('path');

module.exports = {
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
