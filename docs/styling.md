

# Styling

[Sass](https://sass-lang.com/) will be used for styling throughout the web application. It enables the use of variables, nested rules, mixins, inline imports making it easier to manage, make changes and write less css.

All styles are defined in a `.scss` file, which are processed by Sass and compiled to css to a `.css` file so they are readable by the browser. The majority of react components will each have a dedicated `.scss` file to make it easier to find and manage styles that are directly related. These `.scss` files are imported within the component `.jsx` file, which will cause the the javascript transpiler to throw an error because it doesn't recognise the syntax. To solve this problem we configured webpack with the following [loaders](https://webpack.js.org/loaders/):

Add the following rule to `webpack.config.js`:
```js
{
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    { loader: 'style-loader' }, // Inject CSS into the DOM
                    { loader: 'css-loader' }, // Interprets @import/url() as import/require() within the js and resolves them
                    { loader: 'sass-loader' } // Loads a Sass/SCSS file and compiles it to CSS.
                ]
            }
        ]
    }
}
```



## Resources
https://sass-lang.com/
https://www.javatpoint.com/why-use-sass
https://www.javatpoint.com/sass-advantages-and-disadvantages
https://webpack.js.org/loaders/css-loader/
https://webpack.js.org/loaders/sass-loader/
https://webpack.js.org/loaders/style-loader/
