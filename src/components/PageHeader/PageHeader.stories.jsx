import React from 'react';
import { text } from '@storybook/addon-knobs';
import PageHeader from '.';

export default {
    title: 'PageHeader',
    component: PageHeader,
    parameters: {
        componentSubtitle: 'Used to display page heading',
        notes: 'page header heading h1'
    }
};

// Use the text knob to define a text input for updating the page header within Storybook
export const pageHeader = () => (
    <PageHeader
        heading={text('Heading', 'Example Page Heading')}
    />
);
