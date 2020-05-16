var path = require('path');

module.exports = {
    mode: 'production',
    entry: {
        // Client side javascript files bundled with React
        vendor: ['@babel/polyfill', 'react'],
        client: ['./src/client.js']
    },
    output: {
        path: path.resolve(__dirname, './', 'public/js'), // Destination folder for the bundled client-side scripts
        filename: '[name].js' // Saves the following bundled files to the destination folder: client.js, vendor.js
    },
    devtool: 'inline-source-map',
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
                    { loader: 'style-loader' },
                    { loader: 'css-loader'},
                    { loader: 'sass-loader' }
                ]
            }
        ]
    },
    target: 'web', // Compile for usage in the browser, catering for use of window and document objects
    resolve: {
        // Resolve extensions of files with the same name in the following order:
        extensions: ['.js', '.jsx', '.json']
    }
};
