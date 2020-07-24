import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { fetchHomepage } from '../../fetchers';
import { Wrapper } from '../../tests/utils.js';
import Homepage from '.';

jest.mock('../../fetchers');

const data = {
    page: {
        title: 'Test heading',
        content: 'Test content',
        metadata: {
            description: "React demo is a universal web app built with react.",
            keywords: "React,demo,universal,web,app"
        }
    }
};

const component = mount(
    <Wrapper location='/' data={data}>
        <Homepage />
    </Wrapper>
);

describe('<Homepage />', () => {
    it('should render the homepage with a page header', () => {
        expect(component.find('PageHeader')).toHaveLength(1);
        expect(component.find('PageHeader').text()).toBe(data.page.title);
    });

    it('should render the homepage with page content', () => {
        expect(component.find('PageContent')).toHaveLength(1);
        expect(component.find('PageContent').text()).toBe(data.page.content);
    });

    it('should render the homepage without notification when notification prop is not populated', () => {
        expect(component.find('Notification')).toHaveLength(0);
    });

    it('should render the homepage with notification when notification prop is populated', () => {
        data.notification = {
            type: 'success',
            message: 'Test message'
        };
        const componentWithNotification = mount(
            <Wrapper location='/' data={data}>
                <Homepage />
            </Wrapper>
        );
        expect(componentWithNotification.find('Notification')).toHaveLength(1);
    });

    // Set callback to an async function as await is used
    it('should fetch homepage data when data context does not have page data', async () => {
        // Mock api response
        fetchHomepage.mockReturnValue(data);

        let component;

        // Use act to test first render and componentDidMount to simulate React works in the browser.
        // For example; Invoking act again would simulate componentDidUpdate
        await act(async () => {
            component = mount(
                <Wrapper location='/' data={{}}>
                    <Homepage />
                </Wrapper>
            );
        });

        component.update();

        expect(component.find('PageHeader')).toHaveLength(1);
        expect(component.find('PageHeader').text()).toBe(data.page.title);
        expect(component.find('PageContent')).toHaveLength(1);
        expect(component.find('PageContent').text()).toBe(data.page.content);
    });
});
