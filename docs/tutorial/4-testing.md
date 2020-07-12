# Testing

This part of the tutorial sets up a test environment for the React Demo.

[Jest](https://facebook.github.io/jest/docs/en/getting-started.html) and [Enzyme](https://enzymejs.github.io/enzyme/) will be used to write tests for react components.

Install dependencies:
```bash
npm install -g jest
npm install jest babel-jest enzyme enzyme-adapter-react-16 --save-dev
```

Create `jest.config.js` with the following:
```js
module.exports = {
    setupFilesAfterEnv: [
        // Configuration file executed before tests at runtime.
        '<rootDir>/src/setup-test.js'
    ],
    moduleNameMapper: {
        // Stub out styles (sass imports) to prevent syntax errors.
        '^.+\\.(scss)$': 'babel-jest'
    }
};
```

Create `src/setup-test.js`:
```js
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// Configure Enzyme to work with React
configure({ adapter: new Adapter() });
```

Create `src/components/App/App.test.js`:
```js
import React from 'react';
import { mount } from 'enzyme';
import App from '.';

// Re-mount the component, if it is not currently mounted. Ensures the component renders it's content.
const component = mount(<App />);

describe('<App />', () => {
    it('should render a logo', () => {
        expect(component.find('Logo')).toHaveLength(1);
    });

    it('should render a page heading', () => {
        expect(component.find('h1')).toHaveLength(1);
        expect(component.find('h1').text()).toBe('React Demo');
    });
});
```

Add the following script entry to `package.json`:
```json
{
    ...
    "scripts": {
        ...
        "test:unit": "jest --coverage src",
    }
}
```

Run tests:
```bash
npm run test:unit
```


#### [&#8592; Previous: Images ](./3-images.md) | [Next: Components &#8594;](./5-components.md)


## Resources

https://enzymejs.github.io/enzyme/docs/installation/

https://enzymejs.github.io/enzyme/docs/guides/jest.html#configure-with-jest

https://stackoverflow.com/questions/46627353/where-should-the-enzyme-setup-file-be-written

https://stackoverflow.com/questions/55344422/what-is-adapter-in-enzyme
