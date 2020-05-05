import express from "express";
import path from 'path';
import React from "react";
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from "./components/App";
import template from './template';
import config from './config';

const app = express();

// make public assets accessible over the network
app.use(express.static(path.join(__dirname, '../public')));

// handle all routes
app.all('/*', async (req, res) => {
    const routerContext = {};
    const helmetContext = {};

    // render react components to the HTML with attributes required for interactive markup
    const markup = renderToString(
        <StaticRouter context={routerContext} location={req.url}>
            <HelmetProvider context={helmetContext}>
                <App />
            </HelmetProvider>
        </StaticRouter>
    );

    const { helmet } = helmetContext;

    res.status(200).send(template(markup, helmet, config.scripts, config.styles));
});

const port = 4040;
const host = 'localhost';

// Start the server
const server = app.listen(port, host);
server.on('listening', () => console.log(`Server started at http://${host}:${port}`));
