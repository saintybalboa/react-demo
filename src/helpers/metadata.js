import React from 'react';
import { Helmet } from 'react-helmet-async';

// Helper to generate page metadata using Helmet
export const getPageMetadata = ({ title, description, keywords }) => {
    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
        </Helmet>
    );
};
