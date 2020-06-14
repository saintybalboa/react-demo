# Components

This part of the tutorial creates React Components to build parts of the React Demo page.

> Components let you split the UI into independent, reusable pieces, and think about each piece in isolation.

Each React Component accepts a properties (props) argument. The [props](https://reactjs.org/docs/components-and-props.html) argument is specified as an object of key value pairs, allowing data to be passed down from other components and rendered. Each prop may require a specific type, e.g. (number, string, object) and having [type-checking](https://reactjs.org/docs/typechecking-with-proptypes.html) in place logs a warning in the console.

Install the following dependencies:
```bash
npm install --save prop-types classnames
```

Build a React Component to render a page header.

Create `src/components/PageHeader/PageHeader.scss`:
```scss
@import '../../assets/scss/variables';

.page-header {
    color: $color;
    border-bottom: 1px solid $color;
}
```

Create `src/components/PageHeader/PageHeader.jsx`:
```js
import React from 'react';
import PropTypes from 'prop-types';
import './PageHeader.scss';

// Deconstruct props argument "PageHeader(props)"
function PageHeader({ heading }) {
    return (
        <div className="page-header">
            <h1>{heading}</h1>
        </div>
    )
}

// Use typechecking to validate props
PageHeader.propTypes = {
    // Component must be supplied with a string value for the heading prop
    heading: PropTypes.string.isRequired
};

export default PageHeader;
```

Create `src/components/PageHeader/index.js`:
```js
export { default } from './PageHeader';
```

Create `src/components/PageHeader/PageHeader.test.jsx`:
```js
import React from 'react';
import { mount } from 'enzyme';
import PageHeader from '.';

describe('<PageHeader />', () => {
    it('should render a h1 with the correct text', () => {
        const component = mount(<PageHeader heading="Test Page Heading" />);

        expect(component.find('h1')).toHaveLength(1);
        expect(component.find('h1').text()).toBe('Test Page Heading');
    });
});
```

Build a React Component to render page content.

Create `src/components/PageContent/PageContent.scss`:
```scss
@import '../../assets/scss/variables';

.page-content {
    margin-top: 1rem;
    border-bottom: 1px solid $color;
}
```

Create `src/components/PageContent/PageContent.jsx`:
```js
import React from 'react';
import PropTypes from 'prop-types';
import './PageContent.scss';

// Deconstruct children (components/elements wrapped within <PageContent> ... </PageContent>)
function PageContent({ children }) {
    return (
        <div className="page-content">
            {children}
        </div>
    )
}

// Use typechecking to validate props
PageContent.propTypes = {
    // Components must be supplied with children
    children: PropTypes.node.isRequired
};

export default PageContent;
```

Create `src/components/PageContent/index.js`:
```js
export { default } from './PageContent';
```

Create `src/components/PageContent/PageContent.test.js`:
```js
import React from 'react';
import { mount } from 'enzyme';
import PageContent from '.';

describe('<PageContent />', () => {
    it('should render the page content with the correct data', () => {
        const component = mount(
            <PageContent>
                <p>test content</p>
            </PageContent>
        );
        expect(component.find('p')).toHaveLength(1);
    });
});
```

Build a React Component to render a notification.

Manage notification types in configuration.

Upate `src/config.js`:
```js
// Shared configuration
export default {
    ...
    notification: {
        types: [
            'default',
            'success',
            'error',
            'info',
            'warning'
        ]
    }
};
```

Add colours that can be used to change the appearance for each notification type.

Update `src/assets/scss/variables`:
```scss
...
$colors: (
    success: #31A745,
    error: #DC3545,
    info: #34A2B8,
    warning: #F9C109
);
$lighter: 40%;
$darker: 20%;
```

Create `src/components/Notification/Notification.scss`:
```scss
@import '../../assets/scss/variables';

.notification {
    position: relative;
    padding: .5rem 1rem;
    margin-bottom: 1rem;
    border: 1px solid transparent;
    border-radius: .10rem;
    background: lighten($color, $lighter);
    color: darken($color, $darker);

    &--success {
        background: lighten(map-get($colors, 'success'), $lighter);
        color: darken(map-get($colors, 'success'), $darker);
    }
    &--error {
        background: lighten(map-get($colors, 'error'), $lighter);
        color: darken(map-get($colors, 'error'), $darker);
    }
    &--info {
        background: lighten(map-get($colors, 'info'), $lighter);
        color: darken(map-get($colors, 'info'), $darker);
    }
    &--warning {
        background: lighten(map-get($colors, 'warning'), $lighter);
        color: darken(map-get($colors, 'warning'), $darker);
    }
}
```

Create `src/components/Notification/Notification.jsx`:
```js
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import config from '../../config';
import './Notification.scss';

const { types } = config.notification;

// Deconstruct props argument "Notification(props)"
function Notification({ message, type }) {
    // classnames enables the use of arrays/objects of class names and booleans to determine whether to render them
    return (
        <div className={classNames({
            'notification': true,
            [`notification--${type}`]: types.includes(type)
        })}>
            {message}
        </div>
    )
}

// Use typechecking to validate props
Notification.propTypes = {
    message: PropTypes.string.isRequired,
    type: PropTypes.oneOf(types)
};

// Set default values for optional props
Notification.defaultProps = {
    theme: types[0]
};

export default Notification;
```

Create `src/components/Notification/index.js`:
```js
export { default } from './Notification';
```

Create `src/pages/Notification/Notification.test.js`:
```js
import React from 'react';
import { mount } from 'enzyme';
import Notification from '.';

describe('<Notification />', () => {
    it('should render a notification with the correct message', () => {
        const component = mount(
            <Notification
                message="Notification message"
            />
        )
        expect(component.text()).toBe('Notification message');
    });
    it('should render a notification of type success', () => {
        const component = mount(
            <Notification
                type="success"
                message="Success notification"
            />
        )
        expect(component.find('.notification--success')).toHaveLength(1);
    });
    it('should render a notification of type error', () => {
        const component = mount(
            <Notification
                type="error"
                message="Error notification"
            />
        )
        expect(component.find('.notification--error')).toHaveLength(1);
    });
    it('should render a notification of type info', () => {
        const component = mount(
            <Notification
                type="info"
                message="Info notification"
            />
        )
        expect(component.find('.notification--info')).toHaveLength(1);
    });
    it('should render a notification of type warning', () => {
        const component = mount(
            <Notification
                type="warning"
                message="Warning notification"
            />
        )
        expect(component.find('.notification--warning')).toHaveLength(1);
    });
});
```

Build a React Component to render the homepage.

The Homepage component accepts a page and notification prop. Both props are defined as an object and each requires a specific set properties. Create prop types and use type-checking to validate the page and notification props.

Create `src/prop-types/page.js`:
```js
import PropTypes from 'prop-types';

const page = PropTypes.shape({
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired
});

export default page;
```

Create `src/prop-types/notification.js`:
```js
import PropTypes from 'prop-types';
import config from '../config';

const notification = PropTypes.shape({
    message: PropTypes.string.isRequired,
    type: PropTypes.oneOf(config.notification.types)
});

export default notification;
```

Create `src/prop-types/index.js`:
```js
export { default as page } from './page';
export { default as notification } from './notification';
```

Create `src/pages/Homepage/Homepage.jsx`:
```js
import React from 'react';
import PropTypes from 'prop-types';
import Notification from '../../components/Notification';
import PageHeader from '../../components/PageHeader';
import PageContent from '../../components/PageContent';
import { page, notification } from '../../prop-types';

// Deconstruct props argument "Homepage(props)"
function Homepage({ page, notification }) {
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
    )
}

Homepage.propTypes = {
    page: page,
    notification: notification
};

Notification.defaultProps = {
    notification: undefined
};

export default Homepage;
```

Create `src/pages/Homepage/index.js`:
```js
export { default } from './Homepage';
```

Create `src/pages/Homepage/Homepage.test.js`:
```js
import React from 'react';
import { mount } from 'enzyme';
import Homepage from '.';

const component = mount(
    <Homepage page={{
        title: 'Test heading',
        content: 'Test content'
    }}/>
);

describe('<Homepage />', () => {
    it('should render the homepage with a page header', () => {
        expect(component.find('PageHeader')).toHaveLength(1);
        expect(component.find('PageHeader').text()).toBe('Test heading');
    });

    it('should render the homepage with page content', () => {
        expect(component.find('PageContent')).toHaveLength(1);
        expect(component.find('PageContent').text()).toBe('Test content');
    });

    it('should render the homepage without notification when notification prop is not populated', () => {
        expect(component.find('Notification')).toHaveLength(0);
    });

    it('should render the homepage with notification when notification prop is populated', () => {
        const componentWithNotification = mount(
            <Homepage
                page={{
                    title: 'Test heading',
                    content: 'Test content'
                }}
                notification={{
                    type: 'success',
                    message: 'Test message'
                }}
            />
        );
        expect(componentWithNotification.find('Notification')).toHaveLength(1);
    });
});
```

Update `src/components/App/App.jsx`:
```js
import './App.scss';
import React from 'react';
import Homepage from '../../pages/Homepage';

function App() {
    return (
        <>
            <span>React Demo</span>
            <Homepage
                page={{
                    title: 'Welcome to the React Demo',
                    content: 'React demo is a universal web app built with react.'
                }}
                notification={{
                    type: 'info',
                    message: 'Example page notification.'
                }}
            />
        </>
    );
}

export default App;
```

Update `src/components/App/App.test.js`:
```js
import React from 'react';
import { mount } from 'enzyme';
import App from '.';

// Re-mount the component, if it is not currently mounted. Ensures the component renders it's content.
const component = mount(<App />);

describe('<App />', () => {
    it('should render the app name', () => {
        expect(component.find('span')).toHaveLength(1);
        expect(component.find('span').text()).toBe('React Demo');
    });

    it('should render the homepage', () => {
        expect(component.find('Homepage')).toHaveLength(1);
    });
});
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

Validate the content is rendered on the page.


#### [&#8592; Previous: Testing](./3-testing.md) | [Next: Storybook &#8594;](./5-storybook.md)


## Resources

https://dev.to/gkhan205/use-componentwillunmount-with-react-hooks-4be2

https://reactjs.org/docs/components-and-props.html

https://www.npmjs.com/package/prop-types

https://reactjs.org/docs/typechecking-with-proptypes.html

https://www.npmjs.com/package/classnames
