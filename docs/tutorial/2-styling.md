# Styling

This part of the tutorial adds styling to the React Demo.

[Sass](https://sass-lang.com/) will be used for styling. It enables the use of variables, nested rules, mixins, inline imports making it easier to manage, make changes and write less css.

## Setup

Separate shared styling such as typhography, colours and layouts into reusable files.

Create `src/assets/scss/variables.scss`:
```scss
// Manage shared variables
$font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
$font-size: 12px;
$background: #f5f7fb;
$color: #495057;
```

Component specific `.scss` files are created in the same folder as the component.

Create `src/components/App/App.scss`:
```scss
@import '../../assets/scss/variables';

body {
    font-family: $font-family;
    color: $color;
    background-color: $background;
    font-size: $font-size;
}
```

Update `src/components/App/App.jsx`:
```js
import './App.scss';
...
```

Importing `.scss` files within the component `.jsx` file will cause a javascript runtime error because it does not recognise the syntax.

Install the following dev dependencies:
```bash
npm install node-sass sass-loader css-loader style-loader --save-dev
```

Update `webpack.client.config.js`:
```js
...
module.exports = {
    module: {
        rules: [
            ...
            {
                test: /\.scss$/,
                use: [
                    { loader: 'style-loader' }, // Creates the javascript to inject CSS into the DOM
                    { loader: 'css-loader' },   // Interprets @import/url() as import/require() within the js and resolves them
                    { loader: 'sass-loader' }   // Loads a Sass/SCSS file and compiles it to CSS.
                ]
            }
        ]
    },
    ...
};
```

Compile the client side scripts:
```bash
npm run build:client
```

Install the following dependencies:
```bash
npm install mini-css-extract-plugin --save-dev
```

Update `webpack.server.config.js`:
```js
...
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    ...
    module: {
        rules: [
            ...
            {
                test: /\.scss$/,
                use: [
                    { loader: MiniCssExtractPlugin.loader }, // Extracts css into a file that can be served by the web browser when js is disabled.
                    { loader: 'css-loader' }, // Interprets @import/url() as import/require() within the js and resolves them
                    { loader: 'sass-loader' } // Loads a Sass/SCSS file and compiles it to CSS.
                ],
                exclude: [/node_modules/, /public/, /build/]
            }
        ]
    },
    ...
    plugins: [
        new MiniCssExtractPlugin({
          // Save to a static css file in the public directory
          filename: '../public/css/index.css'
        })
    ]
    ...
};
```

Compile the application server:
```bash
npm run build:server
```

Validate `public/css/index.css` exists with the following styles:
```css
body{font-family:"Source Sans Pro",-apple-system,BlinkMacSystemFont,"Segoe UI","Helvetica Neue",Arial,sans-serif;color:#495057;background-color:#f5f7fb;font-size:12px}
```

Start the application server:
```bash
npm run start
```

Validate the styles have been applied in the browser:

![Image of React Demo styled page](screenshots/styling-js-enabled.png)

Now disable javascript in your browser and refresh the page. Notice the styles have not been applied:

![Image of React Demo styled page](screenshots/styling-js-disabled.png)

CSS is injected with javascript, therefore if javascript is disabled the css is not injected. Webpack server-side configuration (`webpack.server.config.js`) extracts all styles into `public/css/index.css`. The stylesheet can be injected into the head of the HTML document to ensure styles are applied when javascript is disabled.

Update `src/templates/HTMLDocument/HTMLDocument.jsx`:
```js
import React from 'react';

// Inject stylesheet when javascript is disabled
const generateStyles = styles => styles.map((href) => (`<noscript><link rel="stylesheet" href=${href} /></noscript>`)).join('');

function HTMLDocument({ markup, scripts, styles }) {
    return (
        <html lang="en">
            <head dangerouslySetInnerHTML={{ __html: generateStyles(styles) }} />
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

Update `src/template.js`:
```js
...
export default function(markup, scripts, styles) {
    // Generate the static html document
    const htmlDocument = renderToStaticMarkup(
        <HTMLDocument
            markup={markup}
            scripts={scripts}
            styles={styles}
        />
    );

    // <!doctype html> syntax is invalid inside a react component
    return `<!DOCTYPE html>${htmlDocument}`;
}
...
```

Update `src/server.js`:
```js
...
// Handle all routes
router.get('/*', async (req, res) => {
    // Generate the interactive html markup for react on the client
    const markup = renderToString(<App />);

    // Render the static html page
    res.status(200).send(template(markup, config.scripts, config.styles));
});
...
```

Update `src/config.js`:
```js
export default {
    ...
    styles: [
        '/css/index.css'
    ]
};
```

Compile the application server:
```bash
npm run build:server
```

Start the application server:
```bash
npm run start
```

Validate the styles have been applied in the browser when javascript is disabled:

![Image of React Demo styled page](screenshots/styling-js-enabled.png)

Validate the stylesheet is not injected when javascript is enabled. The network requests tab should not show an entry for index.css

### Backend development
Update babel configuration to [.babelrc](../../.babelrc) to resolve sass imports at runtime:

Install postcss dependency:
```bash
npm install babel-plugin-postcss-css-modules --save-dev
```

Create the `postcss.config.js` postcss configuration file:
```js
module.exports = (ctx) => ({
    plugins: [
      require('postcss-modules')({
        getJSON: ctx.extractModules || (() => {}),
      }),
    ],
});
```

Update `.babelrc`:
```json
{
    ...
    "plugins": [
        ...
        ["postcss-css-modules", { "extensions": [".scss"] }]
    ]
}
```

Start the application server for local development:
```bash
npm run dev:server
```

### Frontend development

Configure webpack dev server to handle `.scss` imports.

Update `webpack.dev.config.js`:
```js
...
module.exports = {
    module: {
        rules: [
            ...
            {
                test: /\.scss$/,
                use: [
                    { loader: 'style-loader' }, // Creates the javascript to inject CSS into the DOM
                    { loader: 'css-loader' },   // Interprets @import/url() as import/require() within the js and resolves them
                    { loader: 'sass-loader' }   // Loads a Sass/SCSS file and compiles it to CSS.
                ]
            }
        ]
    },
    ...
    plugins: [
        ...
        new HtmlWebpackPlugin({
            templateContent: template('', [], config.styles)
        })
    ],
};
```

Start weback dev server:
```bash
npm run dev:client
```

Change the styles in `src/assets/scss/variables.scss` to see changes automatically applied.


#### [&#8592; Previous: Setup ](./1-setup.md) | [Next: Testing &#8594;](./3-testing.md)


## Resources
https://sass-lang.com/

https://www.javatpoint.com/why-use-sass

https://www.javatpoint.com/sass-advantages-and-disadvantages

https://webpack.js.org/loaders/css-loader/

https://webpack.js.org/loaders/sass-loader/

https://webpack.js.org/loaders/style-loader/

https://webpack.js.org/plugins/mini-css-extract-plugin/

https://www.npmjs.com/package/babel-plugin-postcss-css-modules

https://stackoverflow.com/questions/46865880/react-16-warning-expected-server-html-to-contain-a-matching-div-in-div-due
