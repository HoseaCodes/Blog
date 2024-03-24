import React from 'react';
import PropTypes from 'prop-types';
import { StyledButton } from '../../Layout/Button/styledButton';
import './Button.css';

export const Button = ({ primary, backgroundColor, size, shape, label, icon, ...props }) => {
  const mode = primary ? 'button--primary' : 'button--secondary';
  return (
    <StyledButton
      type="button"
      className={[`button--${size}`, `button--${shape}`, mode].join(" ")}
      style={backgroundColor && { backgroundColor }}
      {...props}
    >
      {label && icon ? <>{icon} {label}</> : label ? label : icon}
    </StyledButton>
  );
};

Button.propTypes = {
  primary: PropTypes.bool,
  backgroundColor: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  icon: PropTypes.element,
  shape: PropTypes.oneOf(['round', 'oval'])
};

Button.defaultProps = {
  backgroundColor: null,
  primary: false,
  size: 'medium',
  onClick: undefined,
  icon: null,
  shape: 'oval'
};
