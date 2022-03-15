import styled, {css} from 'styled-components';

export const Margin5 = styled.div`
  margin-bottom: 5rem;
  ${props => props.Primary && css`
      margin-bottom: 5rem;
  `}
`;
export const MarginTop = styled.div`
  margin-top: 4%;
  ${props => props.Whitesmoke && css`
    background: whitesmoke;
  `}
  ${props => props.RightCloumnSearch && css`
    display: flex;
    margin-top: 12%;
  `}
`;
