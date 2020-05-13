# Styling

This part of the tutorial adds styling to the react demo.

[Sass](https://sass-lang.com/) will be used for styling throughout the web application. It enables the use of variables, nested rules, mixins, inline imports making it easier to manage, make changes and write less css.

## Setup

Separate shared styling such as typhography, colours and layouts into reusable files.

Create the following directory:
```bash
mkdir -p src/assets/scss
```

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
// Import shared variables
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
```

Importing `.scss` files within the component `.jsx` will cause a javascript runtime error because it does not recognise the syntax.

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

Update `webpack.server.config.js`:
```js
...
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

### Local development
For debugging purposes, in local development we're running the server directly from the source code i.e. the `src/server.js`. This is executed using `babel-node`, which will through an error because it doesn't know how to handle sass imports in js. Add the following plugin to the babel configuration to [.babelrc](../../.babelrc) to resolve sass imports at runtime:

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

```bash
npm run dev:server
```

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
