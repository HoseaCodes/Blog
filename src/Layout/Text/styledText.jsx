import styled, {css, } from 'styled-components';

export const NamePlate= styled.div`
  padding: 4% 0;
  font-size: 1.8rem;
  ${props => props.Primary && css`
    border-radius: 50%;
    width: 5rem;
    margin-Right: 4%;
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
`;
