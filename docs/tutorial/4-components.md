# Components

This part of the tutorial creates React Components to build parts of the React Demo page.

> Components let you split the UI into independent, reusable pieces, and think about each piece in isolation.

Install dependencies:
```bash
npm install --save prop-types
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

Build a React Component to render page content.

Create `src/components/PageContent/PageContent.scss`:
```scss
@import '../../assets/scss/variables';

.page-content {
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

Build a React Component to render the homepage using the PageHeader and PageContent components already created.

Create `src/pages/Homepage/Homepage.jsx`:
```js
import React from 'react';
import PageHeader from '../../components/PageHeader';
import PageContent from '../../components/PageContent';

// Deconstruct props argument "Homepage(props)"
function Homepage({ title, content }) {
    return (
        <div className="page">
            <PageHeader heading={title} />
            <PageContent>
                <p>{content}</p>
            </PageContent>
        </div>
    )
}

export default Homepage;
```

Create `src/pages/Homepage/index.js`:
```js
export { default } from './Homepage';
```

Update `src/components/App/App.jsx`:
```js
...
import Homepage from '../../pages/Homepage';

function App() {
    return (
        <>
            <span>React Demo</span>
            <Homepage
                title="Welcome to the React Demo"
                content="React demo is a universal web app built with react."
            />
        </>
    );
}
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


#### [&#8592; Previous: Testing](./3-testing.md) | [Next: Context &#8594;](./5-context.md)


## Resources

https://reactjs.org/docs/components-and-props.html

https://www.npmjs.com/package/prop-types

https://reactjs.org/docs/typechecking-with-proptypes.html
