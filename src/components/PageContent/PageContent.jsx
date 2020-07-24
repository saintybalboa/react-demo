import React from 'react';
import PropTypes from 'prop-types';
import './PageContent.scss';

// Deconstruct children (components/elements wrapped within <PageContent> ... </PageContent>)
function PageContent({ children }) {
    return (
        <div className="page-content">
            {children}
        </div>
    )
}

// Use typechecking to validate props
PageContent.propTypes = {
    // Components must be supplied with children
    children: PropTypes.node.isRequired
};

export default PageContent;
