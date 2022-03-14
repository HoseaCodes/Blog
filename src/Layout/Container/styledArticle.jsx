import styled, {css}  from 'styled-components';

export const StyledLeftContainer = styled.section`
  width: 12rem;
  display: flex;
  flex-direction: column;
  height: 100vh;
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
`;

export const JustifyContentSpaceAround = styled.div`
  display: flex;
  justify-content: space-between;
  ${props => props.PaddingRight && css`
  padding: 0 6% 0 0;
  `}
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
  overflowX: hidden;
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

export const BlogCard = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: auto;
`;

export const BlogPost = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 1%;
`;

export const BlogNewsletter = styled.div`
  background-color: whitesmoke;
  padding: 4%;
  margin-top: 8%;
  border-top: solid;
  border-color: green;
`;
