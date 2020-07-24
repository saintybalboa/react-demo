import PropTypes from 'prop-types';

const metadata = PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    keywords: PropTypes.string.isRequired
});

export default metadata;
