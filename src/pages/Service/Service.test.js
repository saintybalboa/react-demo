import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { fetchService } from '../../fetchers';
import { Wrapper } from '../../tests/utils.js';
import Service from '.';

// Mock fetchers to prevent network requests
jest.mock('../../fetchers');

// Mock route params
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
        id: 1
    })
}));

const data = {
    service: {
        id: 1,
        name: 'Test service',
        items: [
            'Item 1',
            'Item 2',
            'Item 3'
        ],
        metadata: {
            description: 'Test service description',
            keywords: 'test,service'
        }
    }
};

const component = mount(
    <Wrapper location='/services/1' data={data}>
        <Service />
    </Wrapper>
);

describe('<Service />', () => {
    it('should render the service with a page header', () => {
        expect(component.find('PageHeader')).toHaveLength(1);
        expect(component.find('PageHeader').text()).toBe(data.service.name);
    });

    it('should render the service with page content', () => {
        expect(component.find('PageContent')).toHaveLength(1);
        expect(component.find('PageContent').text()).toBe(data.service.items.join(''));
    });

    // Set callback to an async function as await is used
    it('should fetch service data when data context does not have page data', async () => {
        // Mock api response
        fetchService.mockReturnValue(data);

        let componentWithNoInitialData;
        // Use act to test first render and componentDidMount to simulate React works in the browser.
        // For example; Invoking act again would simulate componentDidUpdate
        await act(async () => {
            componentWithNoInitialData = mount(
                <Wrapper location='/services/1'>
                    <Service />
                </Wrapper>
            );
        });

        // Simulate componentDidUpdate, this event would occur once the data has been fetched
        componentWithNoInitialData.update();

        expect(componentWithNoInitialData.find('PageHeader')).toHaveLength(1);
        expect(componentWithNoInitialData.find('PageHeader').text()).toBe(data.service.name);
        expect(componentWithNoInitialData.find('PageContent')).toHaveLength(1);
        expect(componentWithNoInitialData.find('PageContent').text()).toBe(data.service.items.join(''));
    });
});
