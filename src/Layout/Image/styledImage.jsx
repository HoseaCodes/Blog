import styled, {css, } from 'styled-components';

export const LogoImage= styled.img`
  height: auto;
  width: 8rem;
  margin-top: 25%;
  ${props => props.Primary && css`
    border-radius: 50%;
    width: 5rem;
    margin-Right: 4%;
  `}
`;
export const CircleImage= styled.img`
  height: auto;
  border-radius: 50%;
  width: 8rem;
  margin-right: 4%;
  ${props => props.Primary && css`
  marginTop: 25%;
  width: 8rem;
    margin-Right: 4%;
  `}
  ${props => props.Secondary && css`
  width: 7rem;
  `}
`;

export const SquareImage= styled.img`
  width: 90px;
  margin-right: 4%;
  height: auto;
  ${props => props.Primary && css`
  marginTop: 25%;
  width: 8rem;
    margin-Right: 4%;
  `}
`;
export const BlogDisplayImage= styled.img`
  max-height: 90rem;
  margin: 0 auto;
  padding-top: 5rem;
  display: flex;
  width: 100%;
  ${props => props.Primary && css`

  `}
`;
