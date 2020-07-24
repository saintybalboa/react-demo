import React from 'react';
import { mount } from 'enzyme';
import { Wrapper } from '../../tests/utils.js';
import App from '.';

const mockHomepageData = {
    page: {
        title: 'title',
        content: 'content',
        metadata: {
            description: "React demo is a universal web app built with react.",
            keywords: "React,demo,universal,web,app"
        }
    }
};

const mockServiceData = {
    service: {
        id: 1,
        name: 'service',
        items: ['content'],
        metadata: {
            description: 'Host your domain with a reputable Cloud Provider.',
            keywords: 'hosting,domain,maintenance,cloud'
        }
    }
};

describe('<App />', () => {
    it('should render a logo', () => {
        const component = mount(
            <Wrapper location='/' data={mockHomepageData}>
                <App />
            </Wrapper>
        );
        expect(component.find('Logo')).toHaveLength(1);
    });

    it('should render the homepage', () => {
        const component = mount(
            <Wrapper location='/' data={mockHomepageData}>
                <App />
            </Wrapper>
        );
        expect(component.find('Homepage')).toHaveLength(1);
    });

    it('should render the service page', () => {
        // Mock route params
        jest.mock("react-router-dom", () => ({
            useParams: () => ({
                id: 1
            })
        }));

        const component = mount(
            <Wrapper location='/services/2' data={mockServiceData}>
                <App />
            </Wrapper>
        );
        expect(component.find('Service')).toHaveLength(1);
    });
});
