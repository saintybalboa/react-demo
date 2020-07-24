import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import config from '../../config';
import './Notification.scss';

const { types } = config.notification;

// Deconstruct props argument "Notification(props)"
function Notification({ message, type }) {
    // classnames enables the use of arrays/objects of class names and booleans to determine whether to render them
    return (
        <div className={classNames({
            'notification': true,
            [`notification--${type}`]: types.includes(type)
        })}>
            {message}
        </div>
    )
}

// Use typechecking to validate props
Notification.propTypes = {
    message: PropTypes.string.isRequired,
    type: PropTypes.oneOf(types)
};

// Set default values for optional props
Notification.defaultProps = {
    theme: types[0]
};

export default Notification;
