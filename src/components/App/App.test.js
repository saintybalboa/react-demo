import React from 'react';
import { mount } from 'enzyme';
import App from '.';

const component = mount(<App />);

describe('<App />', () => {
    it('should render a page heading', () => {
        expect(component.find('h1')).toHaveLength(1);
        expect(component.find('h1').text()).toBe('React Demo');
    });
});
