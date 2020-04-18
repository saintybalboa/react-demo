# Styling

```bash
npm install node-sass sass-mq sass-loader css-loader style-loader --save-dev
```

```bash
npm install --save-dev clean-webpack-plugin
```

Create directory:

Compile scss to css:
```bash
node_modules/.bin/node-sass src/assets/scss --output src/public/css
```


Add component styling example and show error, then add the below config to webpack


```js
const clientSideConfig = {
    ...
    module: {
        rules: [
            ...
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
    ...
}
```

```js
const serverSideConfig = {
    ...
    node: {
        // Need this when working with express, otherwise the build fails
        __dirname: false,   // if you don't put this is, __dirname
        __filename: false,  // and __filename return blank or /
    },
    module: {
        rules: [
            ...
            {
                test: /\.scss$/,
                use: [
                    { loader: 'css-loader' },
                    { loader: 'sass-loader' }
                ],
                exclude: [/node_modules/, /public/, /build/]
            }
        ]
    },
    target: "node"
};
```

Importing styles in components does have it's pitfalls:
- The styles do not get rendered in the browser when javascript is disabled.
- There can be a slight delay in the style being applied by the javascript to the client when the page is first loaded in the browser.
