import express from "express";
import path from 'path';
import React from "react";
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import HTMLDocument from './components/HTMLDocument';
import App from "./components/App";

const app = express();

// make public assets accessible over the network
app.use(express.static(path.join(__dirname, '../public')));

// handle all routes
app.all('/*', async (req, res) => {
    const context = {};

    // render react components to the HTML with attributes required for interactive markup
    const reactDom = renderToString(
        <StaticRouter context={context} location={req.url}>
            <App />
        </StaticRouter>
    );

    // render the static html document with the react dom in the body
    const htmlDocument = renderToStaticMarkup(
        <HTMLDocument body={reactDom} />
    );

    // Prepend the html document with <!doctype html> here as react throws an error when it is embedded in a component
    res.status(200).send(`<!DOCTYPE html>${htmlDocument}`);
});

const port = process.env.PORT || 3000;
const host = 'localhost';

// Start the server
const server = app.listen(port, host);
server.on('listening', () => console.log(`Server started at http://${host}:${port}`));
