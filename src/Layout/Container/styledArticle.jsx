import styled, {css}  from 'styled-components';

export const StyledLeftContainer = styled.section`
  width: 12rem;
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

export const Inherit = styled.span`
  width: max-content;
`;

export const StyledRightContainer = styled.section`
  width: 45rem;
  padding: 2% 2% 0% 2%;
  border: 1px solid #ccc;
  margin: 0;
  max-height: calc(105vh - 4rem);
  overflow-Y: scroll;
  position: sticky;
  top: 0;
  right: 0;
`;

export const GrayDiv = styled.section`
  color: dimgray;

`;


export const JustifyContent = styled.div`
  display: flex;
  justify-content: center;
  ${props => props.AlignCenter && css`
    align-items: center;
    padding: 4% 0;
    justify-content: flex-start;
  `}
  ${props => props.Font2 && css`
    font-size: 2rem;
  `}
  ${props => props.MarginRight && css`
    margin-right: 4%;
  `}
  ${props => props.SpaceAround && css`
    justify-content: space-between;
    `}
  ${props => props.MiniPost && css`
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-top: 4%;
    `}
    ${props => props.SpaceAroundPaddingRight && css`
    justify-content: space-between;
    padding: 0 6% 0 0;
  `}
`;

export const AlignContent = styled.div`
  display: flex;
  align-items: center;
  ${props => props.Center && css`
  justify-content: space-between;
  flex-direction: row;
  margin-right: 12%;
`}
  ${props => props.CenterBtn && css`
  justify-content: center;
  padding-bottom: 16%;

`}
  ${props => props.Inherit && css`
  flex-direction: row;
  width: inherit;
`}
  ${props => props.Gray && css`
  color: dimgray;
`}
  ${props => props.Column && css`
  @media only screen and (min-device-width: 375px) and (max-device-width: 1180px) {
    flex-direction: column;
  }`}
`;

export const Tag = styled.div`
  background: #ccc;
  border-radius: 20px;
  text-align: center;
  padding: 1%;
  margin-right: 2%;
`;

export const PaddingContent = styled.div`
  padding: 8%;
  padding-top: 4%;
`;

export const StyledMainContainer = styled.article`
  display: flex;
  flex-direction: column;
  margin: auto;
  width: 100%;
  border: 1px solid #ccc;
  position: relative;
  height: calc(105vh - 4rem);
  overflow: auto;
  overflow-X: hidden;
  WebkitOverflowScrolling: touch;
`;

export const PageLinks = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  color: dimgray;
  padding-bottom: 8%;
  margin-top: 20%;
`;

export const BlogCard = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: auto;
  ${props => props.RelatedPost && css`
    padding: 6%;
    margin: 0;
  `}
`;

export const BlogPost = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 1%;
`;

export const BlogNewsletter = styled.form`
  background-color: whitesmoke;
  padding: 4%;
  margin-top: 8%;
  border-top: solid;
  border-color: green;
`;

export const SideUserContainer = styled.div`
  display: flex;
  flex-direction: column;
  ${props => props.Primary && css`
    margin-top: 12%;
  `}
  ${props => props.ButtonGroup && css`
    flex-direction: row;
    margin-top: 8%;
    justify-content: space-evenly;
  `}
  ${props => props.Main && css`
  padding: 6%;
  width: 100%
`}
`;

export const PostContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 5%;
  ${props => props.Secondary && css`
  margin-top: 15%;
  `}
`;

export const BlogContent = styled.main`
  display: flex;
  background-color: white;
  width: 100%;
  font-family: sans-serif;
`;
