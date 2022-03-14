import styled, {css} from 'styled-components';

export const AlertP = styled.div`
  background-color: whitesmoke;
  padding: 2%;
  border-radius: 4px;
  color: dimgray;
  font-size: 1.85rem;
  width: 100%;
  ${props => props.Primary && css`
  `}
`;
