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

export const Font2= styled.div`
  font-size: 2.5rem;
  ${props => props.Primary && css`
  `}
`;
export const NoMargin= styled.h5`
  margin: 0;
  ${props => props.Primary && css`
  `}
`;

export const PostText= styled.p`
  font-size: 1.8rem;
  font-weight: 500;
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
`;

export const BlogTitle= styled.h2`
  text-transform: capitalize;
  margin-top: 2rem;
  font-size: 6rem;
  ${props => props.Green && css`
  `}
  @media only screen and (min-device-width: 375px) and (max-device-width: 1180px) {
    font-size: 4rem;
  }
`;

export const Subtitle= styled.h6`
  color: dimgray;
  ${props => props.Primary && css`
    margin: 2% 0 0 0;
  `}
`;

export const BlogSubTitle= styled.h3`
  text-transform: capitalize;
  margin-top: 2rem;
  font-size: 6rem;
  color: dimgray;
  font-size: 2.5rem;
  ${props => props.Green && css`
  `}
`;
export const BlogPhotoCredit= styled.p`
  display: flex;
  justify-content: center;
  color: dimgray;
  ${props => props.Green && css`
  `}
`;

export const BlogContent= styled.p`
  font-size: 2rem;
${props => props.Markdown && css`
  width: fit-content;
  `}
${props => props.Author && css`
  font-size: 1.5rem;
  padding-bottom: 1.5%;
  `}
${props => props.Newsletter && css`
  font-size: 1.8rem;
  width: 80%;
  `}
`;
export const UserInfo= styled.div`
  font-size: 1.8rem;
${props => props.Padding4 && css`
  padding: 4% 0 0 0;
  `}
${props => props.GrayWPadding && css`
    font-size: 1.4rem;
    color: dimgray;
  `}
`;
