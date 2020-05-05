import React from "react";
import { render, hydrate } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import App from './components/App';

// Hot reload is only enabled when running the web-pack-dev server for local frontend development
const renderMethod = module.hot ? render : hydrate;

renderMethod(
    <BrowserRouter>
        <HelmetProvider>
            <App />
        </HelmetProvider>
    </BrowserRouter>,
    document.getElementById("root")
);

if (module.hot) {
    module.hot.accept();
}
