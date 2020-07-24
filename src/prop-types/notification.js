import PropTypes from 'prop-types';
import config from '../config';

const notification = PropTypes.shape({
    message: PropTypes.string.isRequired,
    type: PropTypes.oneOf(config.notification.types)
});

export default notification;
