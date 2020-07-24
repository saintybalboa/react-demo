import React from 'react';
import { mount } from 'enzyme';
import Notification from '.';

describe('<Notification />', () => {
    it('should render a notification with the correct message', () => {
        const component = mount(
            <Notification
                message="Notification message"
            />
        )
        expect(component.text()).toBe('Notification message');
    });

    it('should render a notification of type success', () => {
        const component = mount(
            <Notification
                type="success"
                message="Success notification"
            />
        )
        expect(component.find('.notification--success')).toHaveLength(1);
    });

    it('should render a notification of type error', () => {
        const component = mount(
            <Notification
                type="error"
                message="Error notification"
            />
        )
        expect(component.find('.notification--error')).toHaveLength(1);
    });

    it('should render a notification of type info', () => {
        const component = mount(
            <Notification
                type="info"
                message="Info notification"
            />
        )
        expect(component.find('.notification--info')).toHaveLength(1);
    });

    it('should render a notification of type warning', () => {
        const component = mount(
            <Notification
                type="warning"
                message="Warning notification"
            />
        )
        expect(component.find('.notification--warning')).toHaveLength(1);
    });
});
