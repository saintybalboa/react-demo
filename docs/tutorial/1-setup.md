# Setup

This setup will guide you through the process of implementing React server-side rendering but with client-side React taking over after the page is first loaded in the browser.

In order for the react web app to run, we need to install a web server and the React library. The code then needs to be transpiled and compiled using Webpack and Babel.

Install Express and React dependencies:
```bash
npm install express react
```

Install Webpack and Babel dev dependencies:

```bash
npm install webpack webpack-cli @babel/register @babel/preset-env @babel/preset-react --save-dev
```

Create a `.babelrc` file in the root directory with the following babel configuration:
```json
{
    "presets": [
        [
            "@babel/preset-env",
            {
                "targets": {
                    "node": "current"
                }
            }
        ],
        [
            "@babel/preset-react"
        ]
    ]
}
```

- **@babel/preset-env:** preset that allows you to use the latest JavaScript without needing to micromanage which syntax transforms. This is targeted at the current node version specified in the [.nvmrc](../../.nvmrc) file.

- **@babel/preset-react:** preset that allows you to use react with jsx syntax.


Add the following webpack config for compiling the client side javascript:
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
    target: "node", // compile for usage in a Node.js like environment.
    resolve: {
        extensions: ['.js', '.jsx', '.json']
    }
```

Export both config separate to ensure webpack executes them separatley

```js
module.exports = [clientSideConfig,  serverSideConfig];
```

Run the webpack cli command to transpile client-side scripts to the `public/js` directory and server-side code to the `build` directory:

```bash
webpack
```


## Hot reloading

The current setup requires us to build and a refresh the page each time we make a change. This can very time consuming for development. Using the [webpack-dev-server](https://webpack.js.org/configuration/dev-server/) and the [react-hot-loader](https://www.npmjs.com/package/react-hot-loader) we can set up hot module replacement. This means whenever we make a change to the code, webpack will replace the module on the page without reloading.

Install `webpack-dev-server` dev dependencies globally and locally:

```bash
npm install -g webpack-dev-server
npm install webpack-dev-server react-hot-loader --save-dev
```


### [Tutorial part 2: Testing &#8594;](./2-testing.md)


## Resources

https://alligator.io/react/server-side-rendering/

https://www.freecodecamp.org/news/server-side-rendering-your-react-app-in-three-simple-steps-7a82b95db82e/

https://medium.com/@firasd/quick-start-tutorial-universal-react-with-server-side-rendering-76fe5363d6e

https://webpack.js.org/concepts/targets/

https://thoughtbot.com/blog/setting-up-webpack-for-react-and-hot-module-replacement
