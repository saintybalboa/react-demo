import React from 'react';
import { text } from '@storybook/addon-knobs';
import PageContent from '.';

export default {
    title: 'PageContent',
    component: PageContent,
    parameters: {
        componentSubtitle: 'Used to display page content',
        notes: 'page content'
    }
};

// Use the text knob to define a text input for updating the page content within Storybook
export const pageContent = () => (
    <PageContent>
        <p>{text('Content', 'Example page content...')}</p>
    </PageContent>
);
