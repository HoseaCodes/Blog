import styled, {css} from 'styled-components';

export const StyledH2 = styled.h2`
  background-color: #1a1e23;
  margin: 0;
  color: white;
  font-size: 3rem;
  text-transform: uppercase;
  text-align: center;
  padding-top: 8rem;
  letter-spacing: 0.5rem;
  border-color: #fff;

  ${props => props.Primary && css`

  `}
`;
