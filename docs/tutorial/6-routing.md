# Routing

This part of the tutorial adds routing to handle page navigation in the React Demo.

Routing will be handled using the following [React Router v5](https://reacttraining.com/blog/react-router-v5/) components:
* [StaticRouter](https://reacttraining.com/react-router/web/api/StaticRouter): server-side
* [BrowserRouter](https://reacttraining.com/react-router/web/api/BrowserRouter): client-side (using the [History api](https://developer.mozilla.org/en-US/docs/Web/API/History_API))

How it works:

1. User enters the URL for the React Demo in the browser.

2. The initial page request is sent to the React Demo application server.

3. StaticRouter handles server-side routing.

4. Page content (HTML) is rendered with React server-side.

5. The browser downloads the React client-side scripts.

6. User navigates to another page.

7. BrowserRouter handles client-side page navigation (no further page requests sent to the application server).

8. Page content (HTML) is rendered with React client-side.


## Setup

A service page will be created to demonstrate dynamic routing and allow page navigation between the homepage and the service page.

Create `src/pages/Service/Service.jsx`:
```js
import React from 'react';

function Service() {
    return 'TBC...';
}

export default Service;
```

Create `src/pages/Service/index.js`:
```js
export { default } from './Service';
```

The Service page will require some initial data before it is rendered.

Create some dummy data in `src/static-data/service-data.json`:
```json
[
    {
        "id": "1",
        "name": "App",
        "items": [
            "iOS",
            "Android",
            "Windows"
        ]
    },
    {
        "id": "2",
        "name": "Web",
        "items": [
            "Hosting",
            "Domain Names",
            "Maintenance"
        ]
    },
    {
        "id": "3",
        "name": "Design",
        "items": [
            "Logo",
            "Website",
            "Adverts"
        ]
    }
]
```

Add a fetcher to get data for a service by the id.

Install the following dependency:
```bash
npm install axios --save
```

Create `src/fetchers/homepage.js`:
```js
import axios from 'axios';

const fetcher = async () => {
    const { data } = await axios.get(`/api/homepage`);
    return data;
};

export default fetcher;
```

Create `src/fetchers/service.js`:
```js
import axios from 'axios';

const fetcher = async ({ id }) => {
    const { data } = await axios.get(`/api/services/${id}`);
    return data && data[0];
};

export default fetcher;
```

Create `src/fetchers/index.js`:
```js
export { default as fetchHomepage } from './homepage';
export { default as fetchService } from './service';
```

Create the shared route config `src/routes.js`.
```js
import Homepage from './pages/Homepage';
import Service from './pages/Service';
import { fetchHomepage, fetchService } from './fetchers';

const routes =  [
  {
    path: '/',
    exact: true,
    component: Homepage,
    // Assign the service fetcher to ensure the initial data is fetched for the homepage
    fetchInitialData: fetchHomepage
  },
  {
    path: '/services/:id',
    exact: false,
    component: Service,
    // Assign the service fetcher to ensure the initial data is fetched for the service page
    fetchInitialData: fetchService
  }
];

export default routes;
```

Data will be need to be fetched server-side and client-side so it's important to do it in a secure way. Create a route (server-side) to proxy requests for data via the application server. This prevents sensitive information becoming exposed in the client-side scripts.

Update `src/server.js`:
```js
...
import { StaticRouter, matchPath } from "react-router-dom";
import axios from 'axios';
import routes from './routes';
import homepageData from './static-data/homepage-data.json';
import serviceData from './static-data/service-data.json';

const app = express();
const router = express.Router();

// Proxy requests for data from apis/databases/static data that should not be exposed in the client-side scripts
router.get('/api/homepage', async (req, res) => {
    res.status(200).send(homepageData);
});

router.get('/api/services/:id', async (req, res) => {
    res.status(200).send(serviceData.filter(service => service.id === req.params.id));
});

// Handle all routes
router.get('/*', async (req, res) => {
    // Use "matchPatch" to match the request path to a route.
    const currentRoute = routes.find((route) => matchPath(req.url, route)) || {};

    // Get request data for the matching route
    const requestData = matchPath(req.url, currentRoute);

    // Fetch initial data if the current route has been configured with a data fetcher
    let initialData = {};

    if (currentRoute.fetchInitialData) {
        initialData = await currentRoute.fetchInitialData(requestData && requestData.params);
    }

    // Generate the interactive html markup for react on the client
    // Components that are descedants of the DataProvider will be able access the data.
    // Use the StaticRouter to handle server-side routing.
    const markup = renderToString(
        <StaticRouter location={req.url} context={{}}>
            <DataProvider data={initialData}>
                <App />
            </DataProvider>
        </StaticRouter>
    );

    // Render the static html page
    res.status(200).send(template(markup, config.scripts, config.styles));
});

...

const port = 4040;
const host = 'localhost';
const baseUrl = `http://${host}:${port}`;

// Axios requires the base url when running in a NodeJs environment
axios.defaults.baseURL = baseUrl;

// Start the application server
const server = app.listen(port, host);
server.on('listening', () => console.log(`Server started at ${baseUrl}`));
```

Update `src/client.js`:
```js
...
import { BrowserRouter } from 'react-router-dom';
...
// Wrap the App component with the BrowserRouter component to activate routing client-side
renderMethod(
    // Set the data that originated on the server, down to the client.
    // Use the BrowserRouter to handle client-side routing
    <BrowserRouter>
        <DataProvider data={window.__INITIAL_DATA__}>
            <App />
        </DataProvider>
    </BrowserRouter>,
    document.getElementById('root')
);
...
```

Update `src/components/App/App.jsx`:
```js
import './App.scss';
import React from 'react';
import { Route, Switch, NavLink } from 'react-router-dom';
import routes from '../../routes';

function App() {
    // Use the Switch component to render the first route that matches the request path.
    return (
        <div className="app">
            <span>React Demo</span>
            <ul>
                <li><NavLink to="/">Home</NavLink></li>
                <li><NavLink to="/services/1">App</NavLink></li>
                <li><NavLink to="/services/2">Web</NavLink></li>
                <li><NavLink to="/services/3">Design</NavLink></li>
            </ul>

            <Switch>
                {routes.map(({ path, exact, component: PageComponent, ...rest }) => (
                    <Route
                        key={path}
                        path={path}
                        exact={exact}
                        render={(props) => (<PageComponent {...props} {...rest} />)}
                    />
                ))}
            </Switch>
        </div>
    );
}

export default App;
```

Initial data for each page is now fetched server-side; The data also needs to be fetched client-side due to page navigation being handled by React on the client.

Update `src/pages/Homepage/Homepage.jsx`:
```js
import React, { useState, useEffect } from 'react';
import { useDataContext } from '../../contexts/data-context';
import { fetchHomepage } from '../../fetchers';
import PageHeader from '../../components/PageHeader';
import PageContent from '../../components/PageContent';

export default function Homepage() {
    // Get initial data from the data context.
    // Data context wont be populated with data if the page was rendered client-side
    const initialData = useDataContext();

    // Manage page data in local state
    const [pageData, setPageData] = useState();

    // Manage page loading indicator in local state, setting initial value to true until page has data
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // useEffect() is not an async function, therefore we cannot use 'await'
        // Create an async function to use 'await' and invoke the function within useEffect()
        const getHomepageData = async () => {
            if (!initialData) {
                const data = await fetchHomepage();
                setPageData(data);
            } else {
                setPageData(initialData);
            }

            setLoading(false);
        };

        getHomepageData();
        // Leave second arg as empty array to only execute on component render (componentDidMount)
    }, []);

    if (loading) {
        // Render loading indicator until page data has been fetched
        return (<div>Page loading...</div>);
    }

    return (
        <div className="page">
            <PageHeader heading={pageData.title} />
            <PageContent>
                <p>{pageData.content}</p>
            </PageContent>
        </div>
    );
}
```

Update `src/pages/Service/Service.jsx`:
```js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDataContext } from '../../contexts/data-context';
import { fetchService } from '../../fetchers';
import PageHeader from '../../components/PageHeader';
import PageContent from '../../components/PageContent';

export default function Service() {
    // Get initial data from the data context.
    // Data context wont be populated with data if the page was rendered client-side
    const initialData = useDataContext();

    // Get service id from URL parameters.
    const { id } = useParams();

    // Manage service data in local state
    const [serviceData, setServiceData] = useState();

    // Manage page loading indicator in local state, setting initial value to true until page has data
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // useEffect() is not an async function, therefore we cannot use 'await'
        // Create an async function to use 'await' and invoke the function within useEffect()
        const getServiceData = async () => {
            // Fetch service data if it does not already exist for the service with the specified id
            if (!initialData || initialData.id !== id) {
                const serviceData = await fetchService({ id });
                setServiceData(serviceData);
            } else if (initialData) {
                setServiceData(initialData);
            }

            setLoading(false);
        };

        getServiceData();
        // Execute each time the service id changes to fetch & render that service page (componentDidMount & componentDidUpdate)
    }, [id]);

    if (loading) {
        // Render loading indicator until page data has been fetched
        return (<div>Page loading...</div>);
    }

    return (
        <div className="page">
            <PageHeader heading={serviceData.name} />
            <PageContent>
                <ul>
                    {serviceData.items.map(value => (
                        // Set key to unique value to allow React identify and manage each instance/sibling of a component/element
                        <li key={value}>{value}</li>
                    ))}
                </ul>
            </PageContent>
        </div>
    );
}
```

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

Validate page navigation works and the correct content is rendered.

### Frontend development
In the previous part of the tutorial Webpack Dev Server was updated to replicate the application server by fetching the data server-side. Data is now fetched client-side in the absence of data sent down from the server, therefore the logic can be removed. However, the client still needs to fetch the data from the application server.

Remove the redundant logic and update Webpack Dev Server to proxy requests for data to the application server.

Update `webpack.dev.config.js`:
```js
require('@babel/register'); // Required to transpile React code in template.js
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('./src/config').default;
const template = require('./src/template').default;

// Configuration for webpack-dev-server
module.exports = {
    ...
    devServer: {
        ...
        proxy: {
            // Proxy any requests for /api/* to the local application server http://localhost:4040/api/*
            '/api': 'http://localhost:4040'
        }
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(), // Refresh html changes without reloading the page in browser
        new HtmlWebpackPlugin({
            templateContent: template('', [], config.styles, null)
        })
    ],
    ...
};
```

Ensure the application server is running.

Start webpack dev server:
```bash
npm run dev:client
```

Validate page navigation works and the correct content is rendered.


#### [&#8592; Previous: Context ](./5-context.md)


## Resources

https://medium.com/the-andela-way/understanding-the-fundamentals-of-routing-in-react-b29f806b157e

https://reacttraining.com/react-router/web/api/BrowserRouter

https://reacttraining.com/react-router/web/api/StaticRouter

https://tylermcginnis.com/react-router-server-rendering/

https://reactjs.org/docs/hooks-intro.html

https://reacttraining.com/blog/reach-react-router-future/

https://reacttraining.com/react-router/web/api/Hooks

https://www.npmjs.com/package/axios

https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/Switch.md

https://kentcdodds.com/blog/understanding-reacts-key-prop

https://medium.com/swlh/using-react-router-navlink-to-specify-the-active-element-in-a-navigation-bar-38700ffd4900

https://webpack.js.org/configuration/dev-server/#devserverproxy
