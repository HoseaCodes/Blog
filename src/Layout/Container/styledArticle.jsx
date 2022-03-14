import styled, {css}  from 'styled-components';

export const StyledLeftContainer = styled.section`
  width: 12rem;
  display: flex;
  flex-direction: column;
  height: 100vh;

`;

export const JustifyContent = styled.div`
  display: flex;
  justify-content: center;
  ${props => props.AlignCenter && css`
    align-items: center;
    padding: 4% 0;
    justify-content: flex-start;
  `}
`;

export const PaddingContent = styled.div`
  padding: 8%;
  padding-top: 4%;
`;

export const StyledMainContainer = styled.article`
  display: flex;
  flex-direction: column;
  margin: auto;
  width: 100%;
  border: 1px solid #ccc;
  position: relative;
  height: calc(105vh - 4rem);
  overflow: auto;
  overflowX: hidden;
  WebkitOverflowScrolling: touch;
`;

export const PageLinks = styled.article`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  color: dimgray;
  padding-bottom: 8%;
  margin-top: 20%;
`;
