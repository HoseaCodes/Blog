import React from 'react';

// CSS Imports
import StyledAlert from './StyledAlert';

const Alert = ({visible, message, color}) => {

  /**
   * Alert Component for displaying game errors and warnings
   */
  return (
    <StyledAlert color={color} visible={visible}>
      <p>{message}</p>
    </StyledAlert>
  )
};

export default Alert;