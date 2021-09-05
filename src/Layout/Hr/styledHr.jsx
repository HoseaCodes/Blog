import styled, {css} from 'styled-components';

export const StyledHr = styled.hr`
  background: white;
  width: 100%;
  height: 0.3rem !important;
  opacity: 1;
  margin: 0;
  ${props => props.Primary && css`
      background: rgb(235, 183, 65);
  `}
`;
