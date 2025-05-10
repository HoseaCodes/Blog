import React from 'react';

import StyledFourSquare from './StyledFourSquare';

const FourSquare = ({props, onSelect}) => {


  /**
   * Individual square on Connect Four Board
   * * Props control selective CSS styling to display selected vs. unselected state.
   * * Onclick handles player select
   */
  return (
    <StyledFourSquare 
    onClick={() => onSelect(props.indexArray[0], props.indexArray[1])} 
    available={props.available} 
    selected={props.selected} >
      <div id="circle" className={`${props.indexArray[0]}${props.indexArray[1]}`} />
    </StyledFourSquare>
  )
};

export default FourSquare;