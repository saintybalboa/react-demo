import React from 'react';
import PropTypes from 'prop-types';
import './PageHeader.scss';

// Deconstruct props argument "PageHeader(props)"
function PageHeader({ heading }) {
    return (
        <div className="page-header">
            <h1>{heading}</h1>
        </div>
    )
}

// Use typechecking to validate props
PageHeader.propTypes = {
    // Component must be supplied with a string value for the heading prop
    heading: PropTypes.string.isRequired
};

export default PageHeader;
