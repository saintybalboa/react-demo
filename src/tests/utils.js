import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { DataProvider } from '../contexts/data-context';

// Use MemoryRouter to allow the router to be reset between tests.
export const Wrapper = ({ children, location, data = { page: { title: 'title', content: 'content'} } }) => {
    // Set MemoryRouter prop initialEntries to start at a specific location/route
    return (
        <MemoryRouter context={{}} initialEntries={[location]}>
            <HelmetProvider>
                <DataProvider data={data}>
                    {children}
                </DataProvider>
            </HelmetProvider>
        </MemoryRouter>
    );
};
