import PropTypes from 'prop-types';
import metadata from './metadata';

const service = PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.string).isRequired,
    metadata: metadata
});

export default service;
