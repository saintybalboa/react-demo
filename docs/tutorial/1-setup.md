# Setup

This part of the tutorial sets up the React Demo project for production and local development.

The react demo project requires a `package.json` to:
- List project dependencies
- Manage automated scripts

Initialise the project:
```bash
npm init

package name: (react-demo-tutorial) react-demo-tutorial
version: (1.0.0)
description: React demo tutorial
entry point: (index.js) build/server.js
test command: echo \"Error: no test specified\" && exit 1
git repository:
keywords: react,demo,tutorial
author:
license: (ISC)

...

Is this OK? (yes) yes
```

Validate `package.json` exists.


Setup React for server-side and client-side rendering.

Install dependencies:
```bash
npm install express react react-dom react-router-dom
```

Create `src/config.js`:
```js
// Shared configuration
export default {
    scripts: [] // Script relative url paths
};
```

Create `src/templates/HTMLDocument/HTMLDocument.jsx`:
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

Create `src/templates/HTMLDocument/index.js`:
```js
export { default } from './HTMLDocument';
```

Create `src/template.js`:
```js
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import HTMLDocument from './templates/HTMLDocument';

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

Create `src/components/App/App.jsx`:
```js
import React from 'react';

function App() {
    return (
       <h1>React Demo</h1>
    );
}

export default App;
```

Create `src/components/App/index.js`:
```js
export { default } from './App';
```

Create `src/server.js`:
```js
import express from 'express';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './components/App';
import template from './template';
import config from './config';

const app = express();
const router = express.Router();

// Handle all routes
router.get('/*', async (req, res) => {
    // Generate the interactive html markup for react on the client
    const markup = renderToString(<App />);

    // Render the static html page
    res.status(200).send(template(markup, config.scripts));
});

// Make public assets accessible over the network
app.use('/', express.static(path.resolve('public')));

app.use(router);

const port = 4040;
const host = 'localhost';

// Start the application server
const server = app.listen(port, host);
server.on('listening', () => console.log(`Server started at http://${host}:${port}`));
```

Create `src/client.js`:
```js
import React from 'react';
import { hydrate } from 'react-dom';
import App from './components/App';

// Client side react hydrates server-side rendered html attaching event listeners s
hydrate(<App />, document.getElementById('root'));
```

### Setup Babel

Install dependencies:
```bash
npm install @babel/register @babel/cli @babel/core @babel/node @babel/polyfill @babel/preset-env @babel/preset-react babel-loader --save-dev
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
        ["@babel/plugin-proposal-object-rest-spread"],
        ["@babel/plugin-transform-runtime"]
    ]
}
```

- **@babel/preset-env:** Transpile the latest javascript syntax to the targeted node version in [.nvmrc](../../.nvmrc).

- **@babel/preset-react:** Accomodate React with JSX syntax.

- **@babel/plugin-proposal-object-rest-spread:** Cater for [spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)

- **@babel/plugin-transform-runtime:** Enables the re-use of Babel's injected helper code to save on codesize.

### Setup Webpack

Install the following dependencies:
```bash
npm install -g webpack webpack-cli
npm install webpack webpack-cli --save-dev
```

Create `webpack.client.config.js`:
```js
const path = require('path');

module.exports = {
    mode: 'production',
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
                    loader: 'babel-loader', // Ask bundler to use babel loader to transpile es2015 code
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                },
                exclude: [/node_modules/]
            }
        ]
    },
    target: "web", // Compile for usage in the browser, catering for use of window and document objects
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

Compile the client side scripts with webpack:
```bash
npm run build:client
```

Validate the following script files were created in `public/js`:
- client.js
- vendor.js

Add the relative script url paths to `src/config.js`:
```js
export default {
    ...
    scripts: [
        '/js/client.js',
        '/js/vendor.js'
    ]
};
```

Create `webpack.server.config.js`:
```js
const path = require('path');

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
            }
        ]
    },
    target: "node", // Compile for usage in a Node.Js environment.
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
        "build:server": "webpack --config webpack.server.config.js"
    }
}
```

Compile the application server:
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
        "start": "node build/server.js"
    }
}
```

Start the application server:
```bash
npm run start
```

Open the React Demo in a browser: http://localhost:4040/

## Local development
Each code change requires a rebuild and a page refresh, which slows down local development. There are tools available to speed up both backend and frontend development.

### Backend development
Use nodemon to restart the application server each time a change is made to the server-side code.

Install `nodemon`:
```bash
npm install nodemon -g
npm install nodemon --save-dev
```

Add as a script entry to `package.json`:
```bash
{
    ...
    "scripts": {
        ...
        "dev:server": "nodemon --exec babel-node src/server.js"
    }
}
```

Start the application server for local development:
```bash
npm run dev:server
```

Make a change to `src/server.js` and view the log output in the terminal:
```js
...
server.on('listening', () => console.log(`Server restarted at http://${host}:${port}`));
...
```


### Frontend development
Speed up frontend development by utilising the following:

- [webpack-dev-server](https://webpack.js.org/configuration/dev-server/): A mini express server that listens for file changes to trigger an automated rebuild and page reload.

- [react-hot-loader](https://www.npmjs.com/package/react-hot-loader): A hot module replacemet plugin that refreshes the changed module within the page without refreshing the entire page.

> Important: The webpack dev server delivers the page; The application server does NOT. Therefore, content is rendered client-side only.

Install `webpack-dev-server` and `react-hot-loader` dependencies:
```bash
npm install -g webpack-dev-server
npm install webpack-dev-server react-hot-loader html-webpack-plugin --save-dev
```

Create `webpack.dev.config.js`

```js
require('@babel/register'); // Required to transpile React code in template.js
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('./src/config').default;
const template = require('./src/template').default;

// Configuration for webpack-dev-server
module.exports = {
    mode: 'development',
    entry: ['react-hot-loader/patch', './src/client.js'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        filename: '[name].bundle.js'
    },
    devtool: 'inline-source-map', // Return error details (e.g. line no.) from the source file not the file bundled by webpack
    devServer: {
        host: 'localhost',
        compress: true,
        port: 4000,
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
        new webpack.HotModuleReplacementPlugin(), // Refresh html changes without reloading the page in browser
        new HtmlWebpackPlugin({
            templateContent: template('', [])
        })
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                include: [path.resolve(__dirname, 'src')],
                use: [
                    {
                        loader: 'babel-loader',
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

Enable hot reloading in `src/client.js`:
```js
import React from 'react';
import { hydrate, render } from 'react-dom';
import App from './components/App';

// Hot reload is only enabled when running the web-pack-dev server for local frontend development
const renderMethod = module.hot ? render : hydrate;

renderMethod(<App />, document.getElementById('root'));

if (module.hot) {
    // Accept updates for the given dependencies and fire a callback to react to those updates.
    module.hot.accept();
}
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

Start webpack dev server:
```bash
npm run dev:client
```

The React Demo should automatically be opened in the browser: http://localhost:4000/

Change the text to `React Demo Tutorial` in `src/components/App/App.jsx` to see changes automatically applied.


#### [Tutorial part 2: Styling &#8594;](./2-styling.md)


## Resources

https://docs.npmjs.com/creating-a-package-json-file

https://alligator.io/react/server-side-rendering/

https://www.freecodecamp.org/news/server-side-rendering-your-react-app-in-three-simple-steps-7a82b95db82e/

https://medium.com/@firasd/quick-start-tutorial-universal-react-with-server-side-rendering-76fe5363d6e

https://medium.com/@binyamin/get-nodemon-to-restart-after-webpack-re-build-8746db80548e

https://webpack.js.org/concepts/targets/

https://webpack.js.org/api/hot-module-replacement/

https://thoughtbot.com/blog/setting-up-webpack-for-react-and-hot-module-replacement

https://www.youtube.com/watch?v=020RYEP4jo8&feature=youtu.be
