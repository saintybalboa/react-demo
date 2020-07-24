import React from 'react';
import { mount } from 'enzyme';
import PageContent from '.';

describe('<PageContent />', () => {
    it('should render the page content with the correct data', () => {
        const component = mount(
            <PageContent>
                <p>test content</p>
            </PageContent>
        );
        expect(component.find('p')).toHaveLength(1);
    });
});
