# Build scripts

The official npm run-script command cannot run multiple scripts, so if we want to run multiple scripts, it's redundant a bit. Let's shorten it by glob-like patterns.

**Before:** `npm run clean && npm run build:css && npm run build:js && npm run build:html`

**After:** `npm-run-all clean build:*`

Install package:
```bash
npm install npm-run-all --save-dev
```

Add the following scripts to package.json
```json
{
    "scripts": {
        "test": "jest test --env=jsdom",
        "build:static": "node_modules/.bin/node-sass src/assets/scss --output public/css",
        "build:scripts": "webpack -wd",
        "build": "run-s clean build:*",
        "clean": "rm -rf build public",
        "dev": "nodemon --exec node build/server.js"
    }
}
```
