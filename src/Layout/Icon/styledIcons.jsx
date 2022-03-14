import styled, {css, } from 'styled-components';

export const StackedAlignn= styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  height: inherit;
  font-size: 2.5rem;
  ${props => props.Primary && css`
  `}
`;

