# Rendering
React is used to render content from both the server and the client.

## Server side rendering
Server side rendering takes place in [server.js](../src/server.js).

- **renderToString**: Render a React element to its initial HTML, creating extra DOM attributes that React uses internally, such as data-reactroot. This makes the markup interactive.

- **renderToStaticMarkup**: Similar to renderToString, except this doesn’t create extra DOM attributes that React uses internally. This is used to render the HTML document template, for example:

```html
<html>
    <head></head>
    <body>
        <!-- To output the interactice html markup (react dom) generated using renderToString -->
        <div id="root" dangerouslySetInnerHTML={{ __html: body }} />
        <script src="/index.js"></script>
        <script src="/vendor.js"></script>
    </body>
</html>
```

## Client side rendering
Client side rendering takes place in [client.js](../src/client.js).

- **hydrate**:

## Resources
https://reactjs.org/docs/react-dom-server.html#rendertostring
https://reactjs.org/docs/react-dom-server.html#rendertostaticmarkup
