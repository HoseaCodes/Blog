import styled, {css, } from 'styled-components';

export const StyledContainer = styled.section`
  padding: 4%;
  background-color: #1a1e23;
  ${props => props.Primary && css`
  `}
`;

