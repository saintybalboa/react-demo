# Setup

```bash
npm install @babel/register @babel/preset-env @babel/preset-react
```


```bash
npm install webpack
```

Add the following webpack config for transpiling the client side javascript:
```js
const clientSideConfig = {
    entry: {
        // Client side javascript files bundled with React
        vendor: ['@babel/polyfill', 'react'],
        client: ['./src/client.js']
    },
    output: {
        path: path.resolve(__dirname, './', 'public/js'), // Destination folder for the client side bundled output is /public/js/
        filename: '[name].js' // Saves the following bundled files to the destination folder: client.js, vendor.js
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
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json']
    }
};
```


Add the following webpack config for transpiling the server side javascript:
```js
const serverSideConfig = Object.assign({}, baseConfig, {
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
                    loader: 'babel-loader', // asks bundler to use babel loader to transpile es2015 code
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                },
                exclude: [/node_modules/]
            }
        ]
    },
    target: "node", // explain why need this for server side
    resolve: {
        extensions: ['.js', '.jsx', '.json']
    }
```

Adding target:node to prevent webpack error
https://stackoverflow.com/questions/40959835/webpack-express-cannot-resolve-module-fs-request-dependency-is-expression

```js
module.exports = [clientSideConfig,  serverSideConfig];
```
