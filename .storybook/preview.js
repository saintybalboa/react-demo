import { addDecorator } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import '../src/components/App/App.scss'; // Import global styles

// Use the addons/knobs decorator to allow properties of components to be updated with forms within Storybook
addDecorator(withKnobs);
