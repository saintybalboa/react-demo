# Setup

This setup includes implementing React server-side rendering with client-side React taking over in the browser.

Install Express and React dependencies:
```bash
npm install express react
```

Create `src/config.js` to hold configuration:
```js
export default {
    app: {
        title: 'React Demo',
    },
    scripts: [] // Script definitions
};
```

Create `src/templates/HTMLDocument` as a template for building a static html page:
```js
import React from 'react';

function HTMLDocument({ markup, scripts }) {
    return (
        <html lang="en">
            <head />
            <body>
                <div id="root" dangerouslySetInnerHTML={{ __html: markup }} />
                {scripts && scripts.map(src => (
                    <script key={src} src={src} />
                ))}
            </body>
        </html>
    );
}

export default HTMLDocument;
```

Create `src/template.js` to generate the static html using the `HTMLDocument`:
```js
import React from "react";
import { renderToStaticMarkup } from 'react-dom/server';
import HTMLDocument from './components/HTMLDocument';

export default function(markup, scripts) {
    // render the static html document
    const htmlDocument = renderToStaticMarkup(
        <HTMLDocument
            markup={markup}
            scripts={scripts}
        />
    );

    // Prepend the html document with <!doctype html> here as react throws an error when it is embedded in a component
    return `<!DOCTYPE html>${htmlDocument}`;
}
```

Create `src/server.js` to run the application server and render pages using the static html generatein `template.js`:
```js
import express from "express";
import path from 'path';
import React from "react";
import { renderToString } from 'react-dom/server';
import App from "./components/App";
import template from './template';
import config from './config';

const app = express();

// make public assets accessible over the network
app.use(express.static(path.join(__dirname, '../public')));

// handle all routes
app.all('/*', async (req, res) => {
    // render react components to the HTML with attributes required for interactive markup
    const markup = renderToString(<App />);

    res.status(200).send(template(markup, config.scripts));
});

const port = 4040;
const host = 'localhost';

// Start the server
const server = app.listen(port, host);
server.on('listening', () => console.log(`Server started at http://${host}:${port}`));
```

Create `src/client.js` to hydrate server-side rendered react components:
```js
import React from "react";
import { hydrate } from "react-dom";
import App from './components/App';

hydrate(<App />, document.getElementById("root"));
```

```bash
npm install @babel/register @babel/preset-env @babel/preset-react --save-dev
```

### Configuring Babel
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
    ],
    "plugins": [
        ["@babel/plugin-proposal-object-rest-spread"]
    ]
}
```

- **@babel/preset-env:** preset that allows you to use the latest JavaScript without needing to micromanage which syntax transforms. This is targeted at the current node version specified in the [.nvmrc](../../.nvmrc) file.

- **@babel/preset-react:** preset that allows you to use react with jsx syntax.

- **@babel/plugin-proposal-object-rest-spread:** plugin for transpiling [spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)


Install `nodemon`:
```bash
npm instal nodemon
```

### Configuring Webpack
In production for better performance we want transpile the code to another directory and start the server. using Webpack and Babel.

Install Webpack and Babel dev dependencies:
```bash
npm install -g webpack webpack-cli
```

```bash
npm install webpack webpack-cli --save-dev
```

Create a `webpack.prod.config.js` file in the root directory. This file will be used compile the code for production.

Add the following webpack config for compiling the client side javascript to the `public` directory:
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
    target: "web", // compile for usage in the browser, catering for use of window and document objects
    resolve: {
        extensions: ['.js', '.jsx', '.json']
    }
};
```

Add the following webpack config for transpiling the server side javascript to a `build` directory:

```js
const serverSideConfig = {
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
};
```

Export configs to ensure webpack executes them separatley:
```js
module.exports = [clientSideConfig, serverSideConfig];
```

Run webpack:
```bash
webpack --config webpack.prod.config.js
```

This generate a `public/js` directory with the following scripts:
- client.js
- vendor.js

These will need to be added as a scripts rendered server-side to allow react to work in the browser.

We've already setup our template to iterate over scripts defined in `config.js` and generate the script tags. Add the scripts to `src/config.js`:
```js
export default {
    ...
    scripts: [
        '/js/client.js',
        '/js/vendor.js'
    ]
};
```

Add a script entry to `package.json` for starting the server in production:
```bash
{
    ...
    "scripts": {
        "dev:server-start": "nodemon --exec babel-node src/server.js"
    }
}
```

Startup the application server:
```bash
npm run dev:server-start
```

Add a script entry to `package.json` for starting the server in development:
```bash
{
    ...
    "scripts": {
        "start": "node build/server.js"
    }
}
```


## Local development
Each time we make a change to the codebase we need to build and a refresh the webpage, which can be very time consuming for local  development. Using the [webpack-dev-server](https://webpack.js.org/configuration/dev-server/) with [react-hot-loader](https://www.npmjs.com/package/react-hot-loader) we can speed up local development. Webpack dev server is a mini node express server that listens to when files were changed, and triggers events such as webpack builds and browser reloads. We are using the hot module replacement plugin, so that whenever we make a change to the code, webpack will replace the module on the page without reloading it in the browser. This does mean that for local development our webpack server will be used to serve our page NOT the react demo application server.

Install `webpack-dev-server` and `react-hot-loader` dependencies:
```bash
npm install -g webpack-dev-server
npm install webpack-dev-server react-hot-loader html-webpack-plugin --save-dev
```

Create a `webpack.dev.config.js` file in the root directory. This file will be used to run `webpack-dev-server` in local development:

```js
require("@babel/register"); // Required to transpile React code in template.js
const template = require("./src/template").default;
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

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
        port: 4040,
        proxy: {
            // Proxy all client-side api requests from the webpack dev server to the application server in local development
            '/api': 'http://localhost:4040',
            //'/js/*': 'http://localhost:4040/js/',
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
         // Reload the page on changes are made to public assets such as css, js, images etc
        contentBase: 'public',
        watchContentBase: true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(), // Refreshes the html changes without reloading the page in browser
        new HtmlWebpackPlugin({
            templateContent: template({}, '/', '')
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
            }
        ]
    },
    resolve: {
        // If multiple files share the same name but have different extensions, webpack will resolve the one with the extension listed first in the array and skip the rest.
        extensions: ['.js', '.jsx', '.json', ',scss']
    }
};
```

Add a script entry to `package.json` for starting the webpack dev server in development:
```bash
{
    ...
    "scripts": {
        ...
        "dev:client-start": "webpack-dev-server --config webpack.dev.config.js"
    }
}
```

Startup the webpack dev server and the application server in local development:
```bash
npm run dev
```

#### [Tutorial part 2: Testing &#8594;](./2-testing.md)


## Resources

https://alligator.io/react/server-side-rendering/

https://www.npmjs.com/package/react-helmet-async

https://www.freecodecamp.org/news/server-side-rendering-your-react-app-in-three-simple-steps-7a82b95db82e/

https://medium.com/@firasd/quick-start-tutorial-universal-react-with-server-side-rendering-76fe5363d6e

https://medium.com/@binyamin/get-nodemon-to-restart-after-webpack-re-build-8746db80548e

https://webpack.js.org/concepts/targets/

https://webpack.js.org/api/hot-module-replacement/

https://thoughtbot.com/blog/setting-up-webpack-for-react-and-hot-module-replacement

https://www.youtube.com/watch?v=020RYEP4jo8&feature=youtu.be
