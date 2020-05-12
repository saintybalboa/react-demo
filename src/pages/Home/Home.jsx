import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function Home() {
    return (
        <>
            <Helmet>
                <title>Home</title>
            </Helmet>
            <h1>React demo</h1>
        </>
    );
}

