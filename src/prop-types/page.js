import PropTypes from 'prop-types';
import metadata from './metadata';

const page = PropTypes.shape({
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    metadata: metadata
});

export default page;
