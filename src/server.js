import express from 'express';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './components/App';
import template from './template';
import config from './config';
import { DataProvider } from './contexts/data-context';
import { StaticRouter } from "react-router-dom/server";
import { matchRoutes } from "react-router";
import homepageData from './static-data/homepage-data.json';
import axios from 'axios';
import routes from './routes';
import serviceData from './static-data/service-data.json';
import { HelmetProvider } from 'react-helmet-async';

const app = express();
const router = express.Router();

// Proxy requests for data from apis/databases/static data that should not be exposed in the client-side scripts
router.get('/api/homepage', async (req, res) => {
    res.status(200).send(homepageData);
});

router.get('/api/services/:id', async (req, res) => {
    res.status(200).send(serviceData.filter(service => service.id === req.params.id));
});

// Handle all routes
router.get('/*', async (req, res) => {
    // Use "matchRoutes" to get the current route config
    const matchingRoutes = matchRoutes(routes, req.url);
    // Set to first matching route
    const currentRoute = (matchingRoutes && matchingRoutes[0]) || {};

    // Fetch initial page data if the current route has been configured with a data fetcher
    let pageData = {};

    if (currentRoute.route && currentRoute.route.fetchInitialData) {
        pageData = await currentRoute.route.fetchInitialData(currentRoute.params);
    }

    const data = {
        ...pageData,
        notification: {
            type: 'info',
            message: 'Example page notification.'
        }
    };

    // Create helmetContext to allow the HelmetProvider to assign helmet as a property
    const helmetContext = {};

    // Generate the interactive html markup for react on the client
    // Components that are descedants of the DataProvider will be able access the data.
    // Use the StaticRouter to handle server-side routing.
    // Use HelmetProvider so that state can be encapsulated for Helmet to work server-side and client-side
    const markup = renderToString(
        <StaticRouter location={req.url} context={{}}>
            <HelmetProvider context={helmetContext}>
                <DataProvider data={data}>
                    <App />
                </DataProvider>
            </HelmetProvider>
        </StaticRouter>
    );

    // Extract helmet from the context so that the HTML Document template can use it to render metadata in the head
    const { helmet } = helmetContext;

    // Render the static html page
    res.status(200).send(template(markup, config.scripts, config.styles, data, helmet));
});

// Make public assets accessible over the network
app.use('/', express.static(path.resolve('public')));

app.use(router);

const port = 4040;
const host = 'localhost';
const baseUrl = `http://${host}:${port}`;

// Axios requires the base url when running in a NodeJs environment
axios.defaults.baseURL = baseUrl;

// Start the application server
const server = app.listen(port, host);
server.on('listening', () => console.log(`Server started at ${baseUrl}`));
