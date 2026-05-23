import styled, {css, } from 'styled-components';

export const NoMargin= styled.h5`
  margin: 0;
  ${props => props.Primary && css`
  `}
`;

export const WarppedDate= styled.div`
  display: flex;
  transform: scaleY(1.2);
  ${props => props.Primary && css`
    border-radius: 50%;
    width: 5rem;
    margin-Right: 4%;
  `}
`;
export const GrayText= styled.div`
  color: dimgray;
  ${props => props.Primary && css`
    border-radius: 50%;
    width: 5rem;
    margin-Right: 4%;
  `}
`;

export const DisplayItem= styled.div`
  display: flex;
  align-items: center;
  color: dimgray;
  ${props => props.Green && css`
    color: green;
  `}
  ${props => props.Red && css`
    color: red;
  `}
`;


export const Subtitle= styled.h6`
  color: dimgray;
  ${props => props.Primary && css`
    margin: 2% 0 0 0;
  `}
`;
