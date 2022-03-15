import styled, {css} from 'styled-components';

export const AlertLink = styled.a`
  text-decoration: underline;
  color: #31323b;
  font-weight: normal;
  ${props => props.Primary && css`
  `}
`;
export const ArticleLink = styled.a`
  color: dimgray;
  padding-right: 2%;
  font-size: 1.2rem;
  ${props => props.Primary && css`
  `}
`;
export const ArticleLinkColor = styled.a`
  color: dimgray;
  ${props => props.Green && css`
    color: green;
  `}
`;
