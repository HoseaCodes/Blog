import styled, {css} from 'styled-components';

export const ArticleInput= styled.input`
  background: transparent;
  border: none;
  border-bottom: solid;
  width: 60%;
  font-size: 1.5rem;
  ${props => props.Search && css`
    border: 1px solid #ccc;
    width: 90%;
    fontSize: 1.5rem;
    padding: 2% 8%;
    border-radius: 20px;
  `}
`;
