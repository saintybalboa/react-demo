# React Demo

React Demo is a universal web app built with [React](https://reactjs.org/).

## Setup

Supports the node version specified in [.nvmrc](.nvmrc)

Install global dependencies:
```bash
npm install -g webpack webpack-cli
```

Install package dependencies:
```bash
npm install
```

Build application source code:
```bash
npm run build:client
npm run build:server
```

Start the application:
```bash
npm run start
```

Open the React Demo in a browser: http://localhost:4040/

### Local development

Install global dependencies:
```bash
npm install nodemon webpack-dev-server -g
```

Start the application server for local development:
```bash
npm dev:server
```

Open another terminal and startup Webpack dev server for local frontend development:
```bash
npm dev:client
```

The React Demo should automatically be opened in the browser: http://localhost:4000/

### Tests

Install global dependencies:
```bash
npm install jest -g
```

Run unit tests:
```bash
npm run test
```

### Storybook

Install global dependencies:
```bash
npm install @storybook/cli -g
```

Run storybook:
```bash
npm run storybook
```

## Tutorial

This tutorial takes you through the process of building a react universal web app. It assumes that you have some basic knowledge of React and JavaScript (es6). The tutorial covers the following areas:

- [Setup](docs/tutorial/1-setup.md)

- [Styling](docs/tutorial/2-styling.md)

- [Images](docs/tutorial/3-images.md)

- [Testing](docs/tutorial/4-testing.md)

- [Components](docs/tutorial/5-components.md)

- [Storybook](docs/tutorial/6-storybook.md)

- [Context](docs/tutorial/7-context.md)

- [Routing](docs/tutorial/8-routing.md)

- [Metadata](docs/tutorial/9-metadata.md)


### [Start the tutorial &#8594;](./docs/tutorial/1-setup.md)



