import React from 'react';
import PropTypes from 'prop-types';
import { Button as BootstrapButton } from 'react-bootstrap';

function Button({variant, label, ...props}) {
    return (<>
        <BootstrapButton variant={variant} {...props}>{label}</BootstrapButton>
    </>);
}

Button.propTypes = {
    /**
     * Bootstrap button variant
     */
    variant: PropTypes.string,

    /**
     * ButtonExample contents
     */
    label: PropTypes.string.isRequired,

    /**
     * Optional click handler
     */
    onClick: PropTypes.func,
};

export default Button;