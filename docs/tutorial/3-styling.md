# Styling

[Sass](https://sass-lang.com/) will be used for styling throughout the web application. It enables the use of variables, nested rules, mixins, inline imports making it easier to manage, make changes and write less css.

All styles are defined in a `.scss` file, which are then trasnformed to css so they are readable by the browser. There are two levels at which `scss` files are to be created: at the global level and component.

### Global styling
Shared styling such as typhography, colours and layouts are stored in a global file. The transpiled global file is injected into the head when the page is served by the browser.

### Component styling
The majority of react components will each have a dedicated `.scss` file to make it easier to find and manage styles that are directly related. These files are imported within the component `.jsx` file and applied by javascript in the browser. Styles applied with javascript does have it's pitfalls:

- The styles do not get rendered in the browser when javascript is disabled.

- There can be a slight delay in the style being applied by the javascript to the client when the page is first loaded in the browser.


## Setup
Create a `scss` directory in the `assets` folder to hold the global styles:
```bash
mkdir -p assets/scss
```

Install the following dev dependencies:
```bash
npm install node-sass sass-loader css-loader style-loader --save-dev
```

Run the Sass compiler to convert the global scss file to `public/css/index.css`:
```bash
node_modules/.bin/node-sass src/assets/scss --output src/public/css
```

Importing `.scss` files within the component `.jsx` file will cause the javascript runtime to throw an error because it doesn't recognise the syntax. To solve this problem we need to:

- Run the Sass compiler to convert `scss` to `css`.

- Resolve the imports to and from within the `.scss` files.

- Generate the javascript that injects the css to the dom.

This can be achieved by using the following webpack [loaders](https://webpack.js.org/loaders/):

- **style-loader:** Injects CSS into the DOM. This is exists only in the browser, therefore it must only be applied to the client webpack config.

- **css-loader:** Interprets `@import/url()` as `import/require()` within the js and resolves them.

- **sass-loader:** Loads a Sass/SCSS file and compiles it to CSS using `node-sass`.

- **mini-css-extract-plugin:** Extracts all component level css into a static css file. The static css file can be served by the web browser when javscript is disabled.

Update `webpack.prod.config.js` with the following configuration to compile sass imports at the component level:

```js
const clientSideConfig = {
    ...
    module: {
        rules: [
            ...
            {
                test: /\.scss$/,
                use: [
                    { loader: 'style-loader' }, // Injects CSS into the DOM
                    { loader: 'css-loader' }, // Interprets @import/url() as import/require() within the js and resolves them
                    { loader: 'sass-loader' } // Loads a Sass/SCSS file and compiles it to CSS.
                ]
            }
        ]
    },
    ...
};

const serverSideConfig = {
    ...
    module: {
        rules: [
            ...
            {
                test: /\.scss$/,
                use: [
                    { loader: MiniCssExtractPlugin.loader },
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
            filename: "../public/css/components.css"
        })
    ]
};
```

### Local development
For debugging purposes, in local development we're running the server directly from the source code i.e. the `src/server.js`. This is executed using `babel-node`, which will through an error because it doesn't know how to handle sass imports in js. Add the following plugin to the babel configuration to [.babelrc](../../.babelrc) to resolve sass imports at runtime:

Install dev dependency:
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

Add plugin to the babel configuration:
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
babel-node ./src/server.js
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
