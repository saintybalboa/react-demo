# Testing

Jest test runner is used to run the unit tests.

Install dependencies:

```bash
npm install babel-jest
```

Create `setup-test.js` in `src` with the following:

```js
// eslint-disable-next-line import/no-extraneous-dependencies
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
```

## Configuration
Jest is configured in `package.json` with the following options:

* `moduleNameMapper`: Stub out styles (sass imports) with a single module. This also requires `babel-jest` in order to transpile the code so that the test runner doesn't throw any syntax errors caused by es6 code.

* `setupFilesAfterEnv`: Configuration of tests at runtime occurs in `setup-test.js`. The configuration of an enzyme adapter for react and creation of global mocks is done in this file.

Add Jest configuration to `package.json`:

```json
{
  "jest": {
    "setupFilesAfterEnv": [
      "<rootDir>/src/setup-test.js"
    ],
    "moduleNameMapper": {
      "^.+\\.(css|less|scss)$": "babel-jest"
    }
  }
}
```

## Resources
https://enzymejs.github.io/enzyme/docs/installation/

https://enzymejs.github.io/enzyme/docs/guides/jest.html#configure-with-jest

https://stackoverflow.com/questions/46627353/where-should-the-enzyme-setup-file-be-written
