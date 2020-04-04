import express from "express";
import React from "react";
<<<<<<< HEAD
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
=======
import {renderToString} from "react-dom/server"
import Index from "../components/pages/index"

const router = express.Router();

router.get('/', async (req, res) => {
    const reactComp = renderToString(<Index/>);
    res.status(200).render('pages/index', {reactApp: reactComp});
>>>>>>> dc30f591dceae3d7638fbf421dc4c6ed5397f296
});

export default router;
