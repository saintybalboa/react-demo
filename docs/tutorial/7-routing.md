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

Add fetchers to retrieve page specific data.

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

// Get data for a service by the id.
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

    // Fetch initial page data if the current route has been configured with a data fetcher
    let pageData = {};

    if (currentRoute.fetchInitialData) {
        pageData = await currentRoute.fetchInitialData(requestData && requestData.params);
    }

    const data = {
        page: pageData,
        notification: {
            type: 'info',
            message: 'Example page notification.'
        }
    };

    // Generate the interactive html markup for react on the client
    // Components that are descedants of the DataProvider will be able access the data.
    // Use the StaticRouter to handle server-side routing.
    const markup = renderToString(
        <StaticRouter location={req.url} context={{}}>
            <DataProvider data={data}>
                <App />
            </DataProvider>
        </StaticRouter>
    );

    // Render the static html page
    res.status(200).send(template(markup, config.scripts, config.styles, data));
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
import Notification from '../../components/Notification';
import PageHeader from '../../components/PageHeader';
import PageContent from '../../components/PageContent';

export default function Homepage() {
    // Get initial data from the data context.
    // Data context wont be populated with data if the page was rendered client-side
    const initialData = useDataContext();

    // Set notification when one is sent down from the server
    const notification = initialData && initialData.notification;

    // Manage page data in local state, setting initial value if has been data sent down from the server
    const [pageData, setPageData] = useState(initialData && initialData.page);

    useEffect(() => {
        // useEffect() is not an async function, therefore we cannot use 'await'
        // Create an async function to use 'await' and invoke the function within useEffect()
        const getHomepageData = async () => {
            if (initialData && initialData.page) {
                setPageData(initialData.page);
            } else {
                const data = await fetchHomepage();
                setPageData(data.page);
            }
        };

        getHomepageData();
        // Leave second arg as empty array to only execute on component render (componentDidMount)
    }, []);

    if (!pageData) {
        // Render loading indicator until page data has been fetched
        return (<div>Page loading...</div>);
    }

    return (
        <div className="page">
            {notification &&
                <Notification
                    type={notification.type}
                    message={notification.message}
                />
            }
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

    // Manage service data in local state, setting initial value if has been data sent down from the server
    const [serviceData, setServiceData] = useState(initialData && initialData.service);

    useEffect(() => {
        // useEffect() is not an async function, therefore we cannot use 'await'
        // Create an async function to use 'await' and invoke the function within useEffect()
        const getServiceData = async () => {
            // Fetch service data if it does not already exist for the service with the specified id
            if (!initialData || (initialData.service && initialData.service.id !== id)) {
                const serviceData = await fetchService({ id });
                setServiceData(serviceData.service);
            } else {
                setServiceData(initialData.service);
            }
        };

        getServiceData();
        // Execute each time the service id changes to fetch & render that service page (componentDidMount & componentDidUpdate)
    }, [id]);

    if (!serviceData) {
        // Render loading indicator until service data has been fetched
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

Create `src/prop-types/service.js`:
```js
import PropTypes from 'prop-types';

const service = PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.string).isRequired
});

export default service;
```

Update `src/prop-types/index.js`:
```js
export { default as page } from './page';
export { default as service} from './service';
export { default as notification } from './notification';
```

Update `src/contexts/data-context.jsx`:
```js
import React, { createContext, useContext } from 'react';
import { notification, page, service } from '../prop-types';

...

DataProvider.propTypes = {
  page: page,
  service: service,
  notification: notification
};

...
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

Start the application server:
```bash
npm run dev:server
```

Start webpack dev server:
```bash
npm run dev:client
```

Validate page navigation works and the correct content is rendered.


## Tests

Running tests will cause an error because the `<NavLink>`, `<Switch>` and `<Route>` components are not wrapped inside a React Router. Add a helper function to wrap the necessary components with a React Router.

Create `src/tests/utils.js`:
```js
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { DataProvider } from '../contexts/data-context';

// Use MemoryRouter to allow the router to be reset between tests.
export const Wrapper = ({ children, location, data = { page: { title: 'title', content: 'content'} } }) => {
    // Set MemoryRouter prop initialEntries to start at a specific location/route
    return (
        <MemoryRouter context={{}} initialEntries={[location]}>
            <DataProvider data={data}>
                {children}
            </DataProvider>
        </MemoryRouter>
    );
};
```

Update `src/components/App/App.test.js`:
```js
import React from 'react';
import { mount } from 'enzyme';
import { Wrapper } from '../../tests/utils.js';
import App from '.';

describe('<App />', () => {
    it('should render the app name', () => {
        const component = mount(
            <Wrapper location='/'>
                <App />
            </Wrapper>
        );
        expect(component.find('span')).toHaveLength(1);
        expect(component.find('span').text()).toBe('React Demo');
    });

    it('should render the homepage', () => {
        const component = mount(
            <Wrapper location='/'>
                <App />
            </Wrapper>
        );
        expect(component.find('Homepage')).toHaveLength(1);
    });

    it('should render the service page', () => {
        const component = mount(
            <Wrapper location='/services/2'>
                <App />
            </Wrapper>
        );
        expect(component.find('Service')).toHaveLength(1);
    });
});
```

The page components have been updated to fetch data when the page is rendered client-side. Add tests to validate data is fetched by the page component.

Update `src/pages/Homepage/Homepage.test.js`:
```js
import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { DataProvider } from '../../contexts/data-context';
import { fetchHomepage } from '../../fetchers';
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

jest.mock('../../fetchers');

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

    // Set callback to an async function as await is used
    it('should fetch homepage data when data context does not have page data', async () => {
        // Mock api response
        fetchHomepage.mockReturnValue(data);

        let component;

        // Use act to test first render and componentDidMount to simulate React works in the browser.
        // For example; Invoking act again would simulate componentDidUpdate
        await act(async () => {
            component = mount(
                <DataProvider data={{}}>
                    <Homepage />
                </DataProvider>
            );
        });

        component.update();

        expect(component.find('PageHeader')).toHaveLength(1);
        expect(component.find('PageHeader').text()).toBe(data.page.title);
        expect(component.find('PageContent')).toHaveLength(1);
        expect(component.find('PageContent').text()).toBe(data.page.content);
    });
});
```

Create `src/pages/Service/Service.test.js`:
```js
import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { DataProvider } from '../../contexts/data-context';
import { fetchService } from '../../fetchers';
import Service from '.';

const data = {
    service: {
        id: 1,
        name: 'Test service',
        items: [
            'Item 1',
            'Item 2',
            'Item 3'
        ]
    }
};

const component = mount(
    <DataProvider data={data}>
        <Service />
    </DataProvider>
);

// Mock fetchers to prevent network requests
jest.mock('../../fetchers');

// Mock route params
jest.mock("react-router-dom", () => ({
    useParams: () => ({
        id: 1
    })
}));

describe('<Service />', () => {
    it('should render the service with a page header', () => {
        expect(component.find('PageHeader')).toHaveLength(1);
        expect(component.find('PageHeader').text()).toBe(data.service.name);
    });

    it('should render the service with page content', () => {
        expect(component.find('PageContent')).toHaveLength(1);
        expect(component.find('PageContent').text()).toBe(data.service.items.join(''));
    });

    // Set callback to an async function as await is used
    it('should fetch service data when data context does not have page data', async () => {
        // Mock api response
        fetchService.mockReturnValue(data);

        // Use act to test first render and componentDidMount to simulate React works in the browser.
        // For example; Invoking act again would simulate componentDidUpdate
        const componentWithNotification = await act(async () => {
            mount(
                <DataProvider data={{}}>
                    <Service />
                </DataProvider>
            );
        });

        expect(component.find('PageHeader')).toHaveLength(1);
        expect(component.find('PageHeader').text()).toBe(data.service.name);
        expect(component.find('PageContent')).toHaveLength(1);
        expect(component.find('PageContent').text()).toBe(data.service.items.join(''));
    });
});
```

Run tests:
```bash
npm run test:unit
```

Validate all tests pass.


#### [&#8592; Previous: Context ](./6-context.md)


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

https://reacttraining.com/react-router/web/guides/testing

https://medium.com/@antonybudianto/react-router-testing-with-jest-and-enzyme-17294fefd303

https://reactjs.org/docs/test-utils.html

https://jestjs.io/docs/en/manual-mocks
