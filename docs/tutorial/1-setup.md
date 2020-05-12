# Setup

Install Express and React dependencies:
```bash
npm install express react
```

Create `src/config.js` with the following shared configuration:
```js
export default {
    app: {
        title: 'React Demo',
    },
    scripts: [] // Script definitions
};
```

Create `src/templates/HTMLDocument.jsx`:
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

Create `src/template.js`:
```js
import React from "react";
import { renderToStaticMarkup } from 'react-dom/server';
import HTMLDocument from './components/HTMLDocument';

export default function(markup, scripts) {
    // Generate the static html document
    const htmlDocument = renderToStaticMarkup(
        <HTMLDocument
            markup={markup}
            scripts={scripts}
        />
    );

    // <!doctype html> syntax is invalid inside a react component
    return `<!DOCTYPE html>${htmlDocument}`;
}
```

Create `src/server.js`:
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
    // Generate the interactive html markup for react on the client
    const markup = renderToString(<App />);

    // Render the static html page
    res.status(200).send(template(markup, config.scripts));
});

const port = 4040;
const host = 'localhost';

// Start the application server
const server = app.listen(port, host);
server.on('listening', () => console.log(`Server started at http://${host}:${port}`));
```

Create `src/client.js`:
```js
import React from "react";
import { hydrate } from "react-dom";
import App from './components/App';

// Client side react hydrates server-side rendered html attaching event listeners s
hydrate(<App />, document.getElementById("root"));
```

### Configure Babel

Install dependencies:
```bash
npm install @babel/register @babel/preset-env @babel/preset-react --save-dev
```

Create `.babelrc` with the following:
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

- **@babel/preset-env:** Transpile the latest javascript syntax to the targeted node version in [.nvmrc](../../.nvmrc).

- **@babel/preset-react:** Accomodate React with JSX syntax.

- **@babel/plugin-proposal-object-rest-spread:** Cater for [spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)


### Configure Webpack

Install the following dependencies:
```bash
npm install -g webpack webpack-cli
npm install webpack webpack-cli --save-dev
```

Create `webpack.client.config.js`:
```js
const path = require('path');

module.exports = {
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

Add the following script entry to `package.json`:
```bash
{
    ...
    "scripts": {
        ...
        "build:client": "webpack --config webpack.client.config.js"
    }
}
```

Compile the client side scripts:
```bash
npm run build:client
```

Validate the following script files were created in `public/js`:
- client.js
- vendor.js

Create `webpack.server.config.js`:
```js
const path = require('path');

module.exports = {
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

Add the script uris to `src/config.js`:
```js
export default {
    ...
    scripts: [
        '/js/client.js',
        '/js/vendor.js'
    ]
};
```

Add the following script entry to `package.json`:
```bash
{
    ...
    "scripts": {
        ...
        "build:server": "webpack --config webpack.server.config.js"
    }
}
```

Compile the application server code:
```bash
npm run build:server
```

Validate `server.js` exists in the `build` directory.

Add the following script entry to `package.json`:
```bash
{
    ...
    "scripts": {
        ...
        "prod:start": "node build/server.js"
    }
}
```

Start the application server:
```bash
npm run start
```


## Local development
Each time we make a change to the codebase we need to build and a refresh the webpage, which can be very time consuming for local development.

### Backend development
Use nodemon to restart the application server each time a change is made to the code.

Install `nodemon`:
```bash
npm install nodemon -g
```

Add as a script entry to `package.json`:
```bash
{
    ...
    "scripts": {
        "dev:server-start": "nodemon --exec babel-node src/server.js"
    }
}
```

Startup the application server for local development:
```bash
npm run dev:server
```

### Frontend development
Using the [webpack-dev-server](https://webpack.js.org/configuration/dev-server/) with [react-hot-loader](https://www.npmjs.com/package/react-hot-loader) we can speed up local development. Webpack dev server (a mini node express server) listens for file changes and triggers events such as webpack builds and page reloads. The hot module replacement plugin replaces the module within the page without reloading the entire page in the browser. This does mean that for local development our webpack server will be used to serve our page NOT the react demo application server.

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

Add the following script entry to `package.json`:
```bash
{
    ...
    "scripts": {
        ...
        "dev:client": "webpack-dev-server --config webpack.dev.config.js"
    }
}
```

Start the webpack dev server:
```bash
npm run dev:client
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
