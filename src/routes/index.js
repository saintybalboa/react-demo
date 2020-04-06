import express from "express";
import React from "react";
import { StaticRouter } from "react-router-dom";
import { renderToString } from "react-dom/server";
import App from "../components/App";

const router = express.Router();

router.get('/*', async (req, res) => {
    const context = {};

    if (req.path === '/about') {
        context.data = 'about the page';
    }

    const reactDom = renderToString(
        <StaticRouter context={ context } location={ req.url }>
            <App />
        </StaticRouter>
    );

    res.status(200).render('pages/index', { reactDom });
});

export default router;
