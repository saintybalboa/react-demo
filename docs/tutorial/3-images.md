# Images

This part of the tutorial adds a logo, a background image and a banner image to the React Demo page.

The background image has been created as a jpg.

Download [background.jpg](./assets/background.jpg) to `src/assets/images/background.jpg`.

Set the background image for the page.

Update `src/components/App/App.scss`:
```scss
...

body {
    ...
    background: url('../../assets/images/background.jpg');
}
```

The banner image has been created as a png.

Download [banner.png](./assets/banner.png) to `src/assets/images/banner.png`.

Add the banner image to the page.

Update `src/components/App/App.jsx`:
```js
import './App.scss';
import React from 'react';
import BannerImage from '../../assets/images/banner.png';

function App() {
    return (
        <>
            <h1>React Demo</h1>
            <img src={BannerImage} alt="React Demo banner" />
        </>
    );
}

export default App;
```

Configure webpack to handle jpg and png file imports.

Install the following dev dependencies:
```bash
npm install url-loader file-loader babel-plugin-file-loader --save-dev
```

Configure Babel to resolve image file imports at runtime:

Update `.babelrc`:
```json
{
    ...
    "plugins": [
        ...
        ["file-loader", {
            "extensions": ["png", "jpg", "jpeg"],
            "publicPath" : "/images",
            "outputPath": "./public/images"
        }]
    ]
}
```

Update `webpack.client.config.js`:
```js
...

module.exports = {
    ...
    module: {
        rules: [
            ...
            {
                test: /\.(jpg|jpeg|png)$/,
                use: {
                    loader: 'url-loader', // Inline the images as data URLs to elminate the added the network request.
                    options: {
                        // Fall back to file-loader if the data URL increases the bundle size larger than limit (bytes)
                        // Generates image file and specifies URL path to image in the src when the limit is exceeded.
                        limit: 10000,
                        publicPath: '/images', // Relative URL path for images
                        outputPath: './public/images' // Relative folder path to store generated image files
                    }
                }
            }
        ]
    }
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
                test: /\.(jpg|jpeg|png)$/,
                use: {
                    loader: 'url-loader', // Inline the images as data URLs to elminate the added the network request.
                    options: {
                        // Fall back to file-loader if the data URL increases the bundle size larger than limit (bytes)
                        // Generates image file and specifies URL path to image in the src when the limit is exceeded.
                        limit: 10000,
                        publicPath: '/images', // Relative URL path for images
                        outputPath: './public/images' // Relative folder path to store generated image files
                    }
                }
            }
        ]
    }
    ...
};
```

The logo has been created as an svg file. SVGs are useful for low-intensity images such as; logos, icons, & less-complex images. They can also be scaled in size without causing pixelation.

Download [logo.svg](./assets/logo.svg) to `src/assets/images/logo.svg`.

Add the logo to the page.

Update `src/components/App/App.jsx`:
```js
import './App.scss';
import React from 'react';
import BannerImage from '../../assets/images/banner.png';
import Logo from '../../assets/images/logo.svg';

function App() {
    return (
        <>
            <Logo className="logo" />
            <h1>React Demo</h1>
            <img src={BannerImage} alt="React Demo banner" />
        </>
    );
}

export default App;
```

Add some styling to the logo.

Update `src/components/App/App.scss`:
```scss
...

.logo {
    fill: $color;
    height: 3rem;
}
```

Configure webpack to handle svg file imports.

Install the following dev dependencies:
```bash
npm install @svgr/webpack --save-dev
```

Update `webpack.client.config.js`:
```js
...

module.exports = {
    ...
    module: {
        rules: [
            ...
            {
                test: /\.svg$/,
                use: { loader: '@svgr/webpack' } // Inlines the images as data URLs to elminate the added the network request
            }
        ]
    }
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
                test: /\.svg$/,
                use: { loader: '@svgr/webpack' } // Inlines the images as data URLs to elminate the added the network request
            }
        ]
    }
    ...
};
```

Compile the client-side scripts:
```bash
npm run build:client
```

Compile the application server:
```bash
npm run build:server
```

Start the application server:
```bash
npm run start
```

Validate the logo, banner and background images are rendered on the page.

### Backend development
Configure Babel to resolve svg file imports at runtime:

Install the following dev dependencies:
```bash
npm install babel-plugin-inline-react-svg --save-dev
```

Update `.babelrc`:
```json
{
    ...
    "plugins": [
        ...
        ["inline-react-svg"]
    ]
}
```

Start the application server for local development:
```bash
npm run dev:server
```

Validate the logo, banner and background images are rendered on the page.

### Frontend development

Configure webpack dev server to handle image file imports.

Update `webpack.dev.config.js`:
```js
...
module.exports = {
    module: {
        rules: [
            ...
            {
                test: /\.(jpg|jpeg|png)$/,
                use: {
                    loader: 'url-loader', // Inline the images as data URLs to elminate the added the network request.
                    options: {
                        // Fall back to file-loader if the data URL increases the bundle size larger than limit (bytes)
                        // Generates image file and specifies URL path to image in the src when the limit is exceeded.
                        limit: 1000,
                        publicPath: '/images', // Relative URL path for images
                        outputPath: 'images' // Relative folder path to store image files to (webpack dev server in memory)
                    }
                }
            },
            {
                test: /\.svg$/,
                use: { loader: '@svgr/webpack' }
            }
        ]
    },
    ...
};
```

Start weback dev server:
```bash
npm run dev:client
```

Validate the logo, banner and background images are rendered on the page.

Change the logo style in `src/components/App/App.scss` to see changes automatically applied.


#### [&#8592; Previous: Styling ](./2-styling.md) | [Next: Testing &#8594;](./4-testing.md)


## Resources

https://webpack.js.org/guides/asset-management/

https://www.robinwieruch.de/webpack-images

https://stackoverflow.com/questions/49080007/url-loader-vs-file-loader-webpack#:~:text=file%2Dloader%20will%20copy%20files,media%20assets%20such%20as%20images.

https://www.pluralsight.com/guides/how-to-load-svg-with-react-and-webpack

https://github.com/airbnb/babel-plugin-inline-react-svg

