# Styling

[Sass](https://sass-lang.com/) will be used for styling throughout the web application. It enables the use of variables, nested rules, mixins, inline imports making it easier to manage, make changes and write less css.

All styles will be defined in a `.scss` file, which are processed by Sass and compiled to css to a `.css` file so they are readable by the browser. There are two levels at which `scss` files are to be created: at the global level and component.

## Global styling
Shared styling such as typhography, colours and layouts are stored in a global file. The transpiled global file is injected into the head when the page is served by the browser.

## Component styling
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

Run the Sass compiler to convert scss to css in `public/css/index.css`:
```bash
node_modules/.bin/node-sass src/assets/scss --output src/public/css
```

Importing `.scss` files within the component `.jsx` file will cause the javascript runtime to throw an error because it doesn't recognise the syntax. To solve this problem we need to configure webpack to:

- Run the Sass compiler to convert `scss` to `css`.

- Resolve the imports to and from within the `.scss` files.

- Generate the javascript that injects the css to the dom.

This can be achieved by using the following webpack [loaders](https://webpack.js.org/loaders/):

- **style-loader':** Injects CSS into the DOM. This is exists only in the browser, therefore it must only be applied to the client webpack config.

- **css-loader:** Interprets @import/url() as import/require() within the js and resolves them.

- **sass-loader:** Loads a Sass/SCSS file and compiles it to CSS using `node-sass`.

Configure webpack to client  `webpack.config.js`:

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
```

and server side builds in
```js
const serverSideConfig = {
    ...
    node: {
        // Need this when working with express, otherwise the build fails
        __dirname: false,
        __filename: false
    },
    module: {
        rules: [
            ...
            {
                test: /\.scss$/,
                use: [
                    { loader: 'css-loader' }, // Interprets @import/url() as import/require() within the js and resolves them
                    { loader: 'sass-loader' } // Loads a Sass/SCSS file and compiles it to CSS.
                ],
                exclude: [/node_modules/, /public/, /build/]
            }
        ]
    },
    target: "node"
};
```

## Resources
https://sass-lang.com/
https://www.javatpoint.com/why-use-sass
https://www.javatpoint.com/sass-advantages-and-disadvantages
https://webpack.js.org/loaders/css-loader/
https://webpack.js.org/loaders/sass-loader/
https://webpack.js.org/loaders/style-loader/
