import React from 'react';
import Button from '../../components/Button'
import { Helmet } from 'react-helmet-async';

export default function About() {
    return (
        <>
            <Helmet>
                <title>About</title>
            </Helmet>
            <h1>About me</h1>
            <Button />
        </>
    );
}

