require("@babel/register"); // Required to transpile React code in template.js
const template = require("./src/template").default;
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const config = require('./src/config').default;

module.exports = {
    mode: "development",
    entry: ["react-hot-loader/patch", "./src/client.js"],
    output: {
        path: path.resolve(__dirname, "dist"),
        publicPath: "/",
        filename: "[name].bundle.js"
    },
    devtool: 'inline-source-map', // returns error details (e.g. line no.) from the source file not the file bundled by webpack
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
        new webpack.HotModuleReplacementPlugin(), // Refreshes the html changes without reloading the page in browser
        new HtmlWebpackPlugin({
            templateContent: template({}, null, [], config.styles)
        })
    ],
    module: {
        rules: [
        {
            test: /\.(js|jsx)$/,
            include: [path.resolve(__dirname, "src")],
            use: [
            {
                loader: "babel-loader",
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
        // If multiple files share the same name but have different extensions, webpack will resolve the one with the extension listed first in the array and skip the rest.
        extensions: ['.js', '.jsx', '.json', ',scss']
    }
};
