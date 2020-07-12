# Metadata

This part of the tutorial adds metadata to the head of each page in the React Demo.

[React Helmet Async](https://www.npmjs.com/package/react-helmet-async) (a fork of [React Helmet](https://github.com/nfl/react-helmet#readme)) will be used to manage and dynamically set what’s in the document’s head section both server-side and client-side. Adding metadata to the document head server-side is important for Search Engine Optimisation because it enables the content to be ingested by the major search engine bots.

Install the following dependencies:
```bash
npm install react-helmet-async --save
```

Metadata is wrapped with the Helmet component. The component then renders the content in the HTML document `<head>`.

Create `src/helpers/metadata.js`:
```js
import React from 'react';
import { Helmet } from 'react-helmet-async';

// Helper to generate page metadata using Helmet
export const getPageMetadata = ({ title, description, keywords }) => {
    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
        </Helmet>
    );
};
```

Add metadata to the homepage.

Update `src/static-data/homepage-data.json`:
```json
{
    "title": "Welcome to the React Demo",
    "content": "React demo is a universal web app built with react.",
    "metadata": {
        "description": "React demo is a universal web app built with react.",
        "keywords": "React,demo,universal,web,app"
    }
}
```

Create `src/prop-types/metadata.js`:
```js
import PropTypes from 'prop-types';

const metadata = PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    keywords: PropTypes.string.isRequired
});

export default metadata;
```

Update `src/prop-types/index.js`:
```js
...
export { default as metadata } from './metadata';
```

Update `src/prop-types/page.js`:
```js
import PropTypes from 'prop-types';
import metadata from './metadata';

const page = PropTypes.shape({
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    metadata: metadata
});

export default page;
```

Update `src/Homepage/Homepage.jsx`:
```js
...
import { getPageMetadata } from '../../helpers/metadata';

export default function Homepage() {
    ...

    // Render page metadata to generate the tags in the head
    return (
        <div className="page">
            {getPageMetadata({
                title: pageData.title,
                description: pageData.metadata.description,
                keywords: pageData.metadata.keywords
            })}

            ...
        </div>
    );
}
```

Add metadata to the service page.

Update `src/static-data/service-data.json`:
```json
[
    {
        "id": "1",
        "name": "App",
        "items": [
            "iOS",
            "Android",
            "Windows"
        ],
        "metadata": {
            "description": "Develope mobile applications across the major platforms.",
            "keywords": "iOS,Android,Windows"
        }
    },
    {
        "id": "2",
        "name": "Web",
        "items": [
            "Hosting",
            "Domain Names",
            "Maintenance"
        ],
        "metadata": {
            "description": "Host your domain with a reputable Cloud Provider.",
            "keywords": "hosting,domain,maintenance,cloud"
        }
    },
    {
        "id": "3",
        "name": "Design",
        "items": [
            "Logo",
            "Website",
            "Adverts"
        ],
        "metadata": {
            "description": "Create a brand to represent your company.",
            "keywords": "logo,website,adverts"
        }
    }
]
```

Update `src/prop-types/service.js`:
```js
import PropTypes from 'prop-types';
import metadata from './metadata';

const service = PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.string).isRequired,
    metadata: metadata
});

export default service;
```

Update `src/pages/Service/Service.jsx`:
```js
...
import { getPageMetadata } from '../../helpers/metadata';

export default function Service() {
    ...

    // Render page metadata to generate the tags in the head
    return (
        <div className="page">
            {getPageMetadata({
                title: serviceData.name,
                description: serviceData.metadata.description,
                keywords: serviceData.metadata.keywords
            })}

            ...
        </div>
    );
}
```

Configure Helmet to render metadata tags in the document head server-side.

Update `src/templates/HTMLDocument/HTMLDocument.jsx`:
```js
...

// Generate metadata tags
const generateMetadata = (helmet) => [
    helmet.title.toString(),
    helmet.meta.toString()
].join('');

// Generate tags to be injected in the head
const generateHead = (helmet, styles) => [
    helmet && generateMetadata(helmet) || '',
    generateStyles(styles)
].join('');

function HTMLDocument({ markup, scripts, styles, data, helmet }) {
    return (
        <html lang="en">
            <head dangerouslySetInnerHTML={{ __html: generateHead(helmet, styles) }} />
            ...
        </html>
    );
}

export default HTMLDocument;
```

Update `src/template.js`:
```js
...

export default function(markup, scripts, styles, data, helmet) {
    // Generate the static html document
    const htmlDocument = renderToStaticMarkup(
        <HTMLDocument
            markup={markup}
            scripts={scripts}
            styles={styles}
            data={data}
            helmet={helmet}
        />
    );

    // <!doctype html> syntax is invalid inside a react component
    return `<!DOCTYPE html>${htmlDocument}`;
}
```

Update `src/server.js`:
```js
...
import { HelmetProvider } from 'react-helmet-async';
...

// Handle all routes
router.get('/*', async (req, res) => {
    ...

    // Create helmetContext to allow the HelmetProvider to assign helmet as a property
    const helmetContext = {};

    // Generate the interactive html markup for react on the client
    // Components that are descedants of the DataProvider will be able access the data.
    // Use the StaticRouter to handle server-side routing.
    // Use HelmetProvider so that state can be encapsulated for Helmet to work server-side and client-side
    const markup = renderToString(
        <StaticRouter location={req.url} context={{}}>
            <HelmetProvider context={{}}>
                <DataProvider data={initialData}>
                    <App />
                </DataProvider>
            </HelmetProvider>
        </StaticRouter>
    );

    // Extract helmet from the context so that the HTML Document template can use it to render metadata in the head
    const { helmet } = helmetContext;

    // Render the static html page
    res.status(200).send(template(markup, config.scripts, config.styles, data, helmet));
});
...
```

Configure Helmet to render metadata client-side in the abscence of metadata rendered server-side.

Update `src/client.js`:
```js
...
import { HelmetProvider } from 'react-helmet-async';
...

// Wrap the App component with the BrowserRouter component to activate routing client-side
renderMethod(
    // Set the data that originated on the server, down to the client.
    // Use the BrowserRouter to handle client-side routing
    // Use HelmetProvider so that state can be encapsulated for Helmet to work server-side and client-side
    <BrowserRouter>
        <HelmetProvider>
            <DataProvider data={window.__INITIAL_DATA__}>
                <App />
            </DataProvider>
        </HelmetProvider>
    </BrowserRouter>,
    document.getElementById('root')
);

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

Using the browser dev tools inspect the HTML document head and validate the following tags exist for each page:
```html
<title>...</title>
<meta name="description" content="..." data-rh="true">
<meta name="keywords" content="..." data-rh="true">
```

Validate the metadata tags were rendered in the HTML document head server-side. Disable javascript, refresh the page and inspect the HTML document head.


## Testing

Running tests will cause a runtime error because the components are not wrapped inside the Helmet Provider.

Update `src/tests/utils.js`:
```js
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { DataProvider } from '../contexts/data-context';

// Use MemoryRouter to allow the router to be reset between tests.
export const Wrapper = ({ children, location, data = { page: { title: 'title', content: 'content'} } }) => {
    // Set MemoryRouter prop initialEntries to start at a specific location/route
    return (
        <MemoryRouter context={{}} initialEntries={[location]}>
            <HelmetProvider>
                <DataProvider data={data}>
                    {children}
                </DataProvider>
            </HelmetProvider>
        </MemoryRouter>
    );
};
```

Update `src/components/App/App.test.js`:
```js
...

describe('<App />', () => {
    ...

    it('should render the service page', () => {
        // Mock route params
        jest.mock("react-router-dom", () => ({
            useParams: () => ({
                id: 1
            })
        }));
        const data = {
            service: {
                id: 1,
                name: 'service',
                items: ['content'],
                metadata: {
                    description: 'Host your domain with a reputable Cloud Provider.',
                    keywords: 'hosting,domain,maintenance,cloud'
                }
            }
        };
        const component = mount(
            <Wrapper location='/services/2' data={data}>
                <App />
            </Wrapper>
        );
        expect(component.find('Service')).toHaveLength(1);
    });
});
```

Update `src/pages/Homepage/Homepage.test.js`:
```js
import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { fetchHomepage } from '../../fetchers';
import { Wrapper } from '../../tests/utils.js';
import Homepage from '.';

jest.mock('../../fetchers');

const data = {
    page: {
        title: 'Test heading',
        content: 'Test content'
    }
};

const component = mount(
    <Wrapper location='/' data={data}>
        <Homepage />
    </Wrapper>
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
            <Wrapper location='/' data={data}>
                <Homepage />
            </Wrapper>
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
                <Wrapper location='/' data={{}}>
                    <Homepage />
                </Wrapper>
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

Update `src/pages/Service/Service.test.js`:
```js
import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { fetchService } from '../../fetchers';
import { Wrapper } from '../../tests/utils.js';
import Service from '.';

// Mock fetchers to prevent network requests
jest.mock('../../fetchers');

// Mock route params
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
        id: 1
    })
}));

const data = {
    service: {
        id: 1,
        name: 'Test service',
        items: [
            'Item 1',
            'Item 2',
            'Item 3'
        ],
        metadata: {
            description: 'Test service description',
            keywords: 'test,service'
        }
    }
};

const component = mount(
    <Wrapper location='/services/1' data={data}>
        <Service />
    </Wrapper>
);

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

        let componentWithNoInitialData;
        // Use act to test first render and componentDidMount to simulate React works in the browser.
        // For example; Invoking act again would simulate componentDidUpdate
        await act(async () => {
            componentWithNoInitialData = mount(
                <Wrapper location='/services/1'>
                    <Service />
                </Wrapper>
            );
        });

        // Simulate componentDidUpdate, this event would occur once the data has been fetched
        componentWithNoInitialData.update();

        expect(componentWithNoInitialData.find('PageHeader')).toHaveLength(1);
        expect(componentWithNoInitialData.find('PageHeader').text()).toBe(data.service.name);
        expect(componentWithNoInitialData.find('PageContent')).toHaveLength(1);
        expect(componentWithNoInitialData.find('PageContent').text()).toBe(data.service.items.join(''));
    });
});
```


#### [&#8592; Previous: Routing ](./8-routing.md)


## Resources

https://github.com/nfl/react-helmet#readme

https://www.npmjs.com/package/react-helmet-async

https://medium.com/coding17/what-is-react-helmet-e62be15ba63b
