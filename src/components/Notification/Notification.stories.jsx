import React from 'react';
import { text, select } from '@storybook/addon-knobs';
import config from '../../config';
import Notification from '.';

export default {
    title: 'Notification',
    component: Notification,
    parameters: {
        componentSubtitle: 'Used to display a notification',
        notes: 'notification error success info warning'
    }
};

// Use the text knob to define a text input for updating the notification message within Storybook
// Use the select knob to define a select box for changing the notification type within Storybook
export const notification = () => (
    <Notification
        type={select('Type', config.notification.types, '-')}
        message={text('Message', 'Example notification message...')}
    />
);
