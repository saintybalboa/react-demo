import React from 'react';
import { mount } from 'enzyme';
import PageHeader from '.';

describe('<PageHeader />', () => {
    it('should render a h1 with the correct text', () => {
        const component = mount(<PageHeader heading="Test Page Heading" />);

        expect(component.find('h1')).toHaveLength(1);
        expect(component.find('h1').text()).toBe('Test Page Heading');
    });
});
