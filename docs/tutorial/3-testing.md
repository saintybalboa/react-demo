# Testing

This section sets up a test environment using [Jest](https://facebook.github.io/jest/docs/en/getting-started.html) with [Enzyme](https://enzymejs.github.io/enzyme/). You will learn how to:
- Configure the test environment
- Write tests for react components

Install depedencies:
```bash
npm install babel-jest enzyme enzyme-adapter-react-16 --save-dev
```

Create `jest.config.js` with the following:
```js
module.exports = {
    setupFilesAfterEnv: [
        '<rootDir>/src/setup-test.js'
    ],
    moduleNameMapper: {
        '^.+\\.(css|less|scss)$': 'babel-jest'
    }
};
```

* `setupFilesAfterEnv`: Configuration file for tests at runtime.

* `moduleNameMapper`: Stub out styles (sass imports) to prevent syntax errors.

Create `src/setup-test.js`:
```js
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// Configure Enzyme to work with React
configure({ adapter: new Adapter() });
```





## Resources

https://enzymejs.github.io/enzyme/docs/installation/

https://enzymejs.github.io/enzyme/docs/guides/jest.html#configure-with-jest

https://stackoverflow.com/questions/46627353/where-should-the-enzyme-setup-file-be-written

https://stackoverflow.com/questions/55344422/what-is-adapter-in-enzyme
