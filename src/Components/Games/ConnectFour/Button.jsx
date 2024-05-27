// Framework Imports
import React from 'react';

// CSS Imports
import StyledButton from './StyledButton';

const Button = ({onClick, message}) => {

  console.log(message);

  /**
   * Button Component
   */
  return (
    <StyledButton>
      <button onClick={onClick}>{message}</button>
    </StyledButton>
  )
};

export default Button;