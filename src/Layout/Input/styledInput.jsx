import styled, {css, } from 'styled-components';

export const NewsletterInput= styled.input`
  background: transparent;
  border: none;
  border-bottom: solid;
  width: 60%;
  font-size: 1.5rem;
  ${props => props.Primary && css`

  `}
`;
