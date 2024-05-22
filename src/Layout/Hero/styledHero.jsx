import styled, {css} from 'styled-components';
const wireframe = 'https://hoseacodes-blog.s3.amazonaws.com/Assets/Images/wireframe-min.jpg';
const houston = 'https://hoseacodes-blog.s3.amazonaws.com/Assets/Images/besomeone-min.jpg';

const HeroContainer = styled.div`
  background-size: cover;
  background-position: top;
  background-repeat: no-repeat;
  background-attachment: fixed;
  position: relative;
  height: 70vh;
  padding-bottom: 55px;
  ${props => props.Home && css`
  background-image: linear-gradient(
    to right bottom,
    rgba(119, 119, 119, 0.6),
    rgba(119, 119, 119, 0.6)
  ),
  url(${wireframe});  `}
  ${props => props.Contact && css`
  background-image: linear-gradient(
    to right bottom,
    rgba(119, 119, 119, 0.6),
    rgba(119, 119, 119, 0.6)
  ), url(${houston});
  background-size: cover;
  background-position: center;
  position: relative;
  height: 40vh;
  margin: 0;
  `}
  ${props => props.About && css`
    background-image: linear-gradient(
        to right bottom,
        rgba(119, 119, 119, 0.6),
        rgba(119, 119, 119, 0.6)
      ),
      url(${houston});
      background-position: center;
    height: 60vh;
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    `}
`;
const HeroPositioning = styled.div `
  position: absolute;
  left: 50%;
  top: 15%;
  transform: translateX(-50%);
`;
const HeroText = styled.span`
  color: white;
  display: block;
  font-family: Lato, sans-serif;
  font-weight: bold;
  text-align: center;
  text-transform: uppercase;
  position: relative;
  font-size: 7rem;
  letter-spacing: 2.5rem;
  line-height: 100px;
  padding: 1rem;

  @keyframes leftIn {
    0% {
      right: 250%;
    }
    100% {
      right: 0%;
    }
  }

  @keyframes rightIn {
    0% {
      left: 250%;
    }
    100% {
      left: 0%;
    }
  }

  ${props => props.Left && css`
  animation: leftIn 5s ease-in -1s normal;
  `}
    ${props => props.Right && css`
    animation: rightIn 5s ease-in -1s normal;
  `}
`;

const HeroCircleImage = styled.img.attrs({src: `${'https://i.imgur.com/dj1vhqzm.png?1'}`})`
  border-radius: 50%;
`;

export {HeroContainer, HeroPositioning, HeroText, HeroCircleImage};
