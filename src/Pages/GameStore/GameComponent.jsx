import styled from 'styled-components';
import React from 'react';
import "react-slideshow-image/dist/styles.css";

const GameComponent = props => {

  const GameComponentContainer = styled.div`
  background: whitesmoke;
  border-radius: 12px;
  height: 90%;
  width: 85%;
`;

  return (
        <GameComponentContainer>
          {props.game}
        </GameComponentContainer>
  );
}

export default GameComponent;