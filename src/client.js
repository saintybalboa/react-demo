import React from 'react';
import { hydrate, render } from 'react-dom';
import App from './components/App';
import { DataProvider } from './contexts/data-context';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Hot reload is only enabled when running the web-pack-dev server for local frontend development
const renderMethod = module.hot ? render : hydrate;

// Wrap the App component with the BrowserRouter component to activate routing client-side
renderMethod(
    // Set the data that originated on the server, down to the client.
    // Use the BrowserRouter to handle client-side routing
    // Use HelmetProvider so that state can be encapsulated for Helmet to work server-side and client-side
    <BrowserRouter>
        <HelmetProvider>
            <DataProvider data={window.__INITIAL_DATA__}>
                <App />
            </DataProvider>
        </HelmetProvider>
    </BrowserRouter>,
    document.getElementById('root')
);

if (module.hot) {
    // Accept updates for the given dependencies and fire a callback to react to those updates.
    module.hot.accept();
}
