# Context

This part of the tutorial makes data accessible to all of the React components using the React Context.

> Context provides a way to pass data through the component tree without having to pass props down manually at every level.

The React Demo application will use a Context to make data available to the Homepage Component.

Create some dummy data in `src/static-data/homepage-data.json`:
```json
{
    "title": "Welcome to the React Demo",
    "content": "React demo is a universal web app built with react."
}
```

Create `src/contexts/data-context.jsx`:
```js
import React, { createContext, useContext } from 'react';
import { notification, page } from '../prop-types';

const DataContext = createContext({});

// Create a Context Provider React component to allow consuming components to subscribe to context changes.
// The value property represents the data accessible to all consuming component that are descendants of the Provider.
// The Provider will re-render whenever the Provider’s value prop changes.
const DataProvider = ({ data, children }) => (
  <DataContext.Provider value={data}>{children}</DataContext.Provider>
);

DataProvider.propTypes = {
  page: page,
  notification: notification
};

// The useContext hook accepts a context object and returns the value set in the Context Provider.
// Create a wrapper function to get the value from the DataContext.Provider.
const useDataContext = () => useContext(DataContext);

export {
  DataContext,
  DataProvider,
  useDataContext
};
```

Initial data is fetched server-side because the browser makes the first request to the application server.

Update `src/server.js`:
```js
...
import { DataProvider } from './contexts/data-context';
import homepageData from './static-data/homepage-data.json';

...

// Handle all routes
router.get('/*', async (req, res) => {
    const data = {
        page: homepageData,
        notification: {
            type: 'info',
            message: 'Example page notification.'
        }
    };
    // Generate the interactive html markup for react on the client.
    // Components that are descendants of the DataProvider will be able access the data.
    const markup = renderToString(
        <DataProvider data={data}>
            <App />
        </DataProvider>
    );

    // Render the static html page
    res.status(200).send(template(markup, config.scripts, config.styles));
});
...
```

Remove redundant props from the component tree.

Update `src/components/App/App.jsx`:
```js
...
function App() {
    return (
        <div className="app">
            <span>React Demo</span>
            <Homepage />
        </div>
    );
}
...
```

Update `src/pages/Homepage/Homepage.jsx`:
```js
import React from 'react';
import Notification from '../../components/Notification';
import PageHeader from '../../components/PageHeader';
import PageContent from '../../components/PageContent';
import { useDataContext } from '../../contexts/data-context';

function Homepage() {
    // Get initial data stored in the data context
    const { page, notification } = useDataContext();

    return (
        <div className="page">
            {notification &&
                <Notification
                    type={notification.type}
                    message={notification.message}
                />
            }
            <PageHeader heading={page.title} />
            <PageContent>
                <p>{page.content}</p>
            </PageContent>
        </div>
    );
}

export default Homepage;
```

Update `src/pages/Homepage/Homepage.test.js`:
```js
import React from 'react';
import { mount } from 'enzyme';
import { DataProvider } from '../../contexts/data-context';
import Homepage from '.';

const data = {
    page: {
        title: 'Test heading',
        content: 'Test content'
    }
};

const component = mount(
    <DataProvider data={data}>
        <Homepage />
    </DataProvider>
);

describe('<Homepage />', () => {
    it('should render the homepage with a page header', () => {
        expect(component.find('PageHeader')).toHaveLength(1);
        expect(component.find('PageHeader').text()).toBe(data.page.title);
    });

    it('should render the homepage with page content', () => {
        expect(component.find('PageContent')).toHaveLength(1);
        expect(component.find('PageContent').text()).toBe(data.page.content);
    });

        it('should render the homepage without notification when notification prop is not populated', () => {
        expect(component.find('Notification')).toHaveLength(0);
    });

    it('should render the homepage with notification when notification prop is populated', () => {
        data.notification = {
            type: 'success',
            message: 'Test message'
        };
        const componentWithNotification = mount(
            <DataProvider data={data}>
                <Homepage />
            </DataProvider>
        );
        expect(componentWithNotification.find('Notification')).toHaveLength(1);
    });
});
```

> React expects that the rendered content is identical between the server and the client.

At this point client-side React doesn't have access to the data object. Consequently, the client will throw a javascript error because the data is undefined.

Create a global javascript variable to store the initial data from the server; thus making the data object accessible to the client.

Update `src/templates/HTMLDocument/HTMLDocument.jsx`
```js
...
function HTMLDocument({ markup, scripts, styles, data }) {
    return (
        <html lang="en">
            <head dangerouslySetInnerHTML={{ __html: generateStyles(styles) }} />
            <body>
                <div id="root" dangerouslySetInnerHTML={{ __html: markup }} />
                <script
                    // Store the data in the global windows object to make it accessible to the client-side scripts
                    dangerouslySetInnerHTML={{
                        __html: `window.__INITIAL_DATA__=${JSON.stringify(data)};`
                    }}
                />
                {scripts && scripts.map(src => (
                    <script key={src} src={src} />
                ))}
            </body>
        </html>
    );
}
...
```

Update `src/template.js`:
```js
...
export default function(markup, scripts, styles, data) {
    // Generate the static html document
    const htmlDocument = renderToStaticMarkup(
        <HTMLDocument
            markup={markup}
            scripts={scripts}
            styles={styles}
            data={data}
        />
    );

    // <!doctype html> syntax is invalid inside a react component
    return `<!DOCTYPE html>${htmlDocument}`;
}
```

Update `src/server.js`:
```js
...
// Handle all routes
router.get('/*', async (req, res) => {
    ...

    // Render the static html page
    res.status(200).send(template(markup, config.scripts, config.styles, data));
});
...
```

Update `src/client.js`:
```js
...
import { DataProvider } from './contexts/data-context';

// Hot reload is only enabled when running the web-pack-dev server for local frontend development
const renderMethod = module.hot ? render : hydrate;

renderMethod(
    // Set the data that originated on the server, down to the client.
    <DataProvider data={window.__INITIAL_DATA__}>
        <App />
    </DataProvider>,
    document.getElementById('root')
);
...
```

Run tests:
```bash
npm run test:unit
```

Validate all tests pass.

Compile the application server:
```bash
npm run build:server
```

Compile the client-side scripts:
```bash
npm run build:client
```

Start the application server:
```bash
npm run start
```

Validate the correct content is rendered.


### Frontend development
To speed up frontend development, the Webpack Dev Server delivers the page; not the application server. The Webpack Dev Server needs to be updated to send the data to the client.

Update `webpack.dev.config`:
```js
...
const homepageData = require('./src/static-data/homepage-data.json');

// Configuration for webpack-dev-server
module.exports = {
    ...
    plugins: [
        new webpack.HotModuleReplacementPlugin(), // Refresh html changes without reloading the page in browser
        new HtmlWebpackPlugin({
            templateContent: template('', [], config.styles, homepageData)
        })
    ],
    ...
};
```

Start webpack dev server:
```bash
npm run dev:client
```

Validate the correct content is rendered.

As data requirements grow, it is not ideal to manage data in both `src/server.js` and `webpack.dev.config`. The next part of the tutorial provides a solution to this problem.


#### [&#8592; Previous: Storybook ](./6-storybook.md) | [Next: Routing &#8594;](./8-routing.md)


## Resources

https://reactjs.org/docs/context.html

https://www.freecodecamp.org/news/react-context-in-5-minutes/

https://itnext.io/jest-tests-with-react-context-api-90f3d2e06c8f
