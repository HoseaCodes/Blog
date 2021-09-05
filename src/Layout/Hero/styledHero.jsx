import styled, {css} from 'styled-components';
import breakpoint from '../../Utils/breakpoints.js';

const HeroContainer = styled.div`
  background-image: linear-gradient(
      to right bottom,
      rgba(119, 119, 119, 0.6),
      rgba(119, 119, 119, 0.6)
    ),
    url("../../icons/wireframe.jpg");
  background-size: cover;
  background-position: top;
  background-repeat: no-repeat;
  background-attachment: fixed;
  position: relative;
  height: 70vh;
  padding-bottom: 55px;

  @media only screen and ${breakpoint.devicemin.xs} and ${breakpoint.devicemax.lg} {
    height: 40vh;
    width: 100%;
    padding-bottom: 35px;
  }
  @media only screen and ${breakpoint.devicemin.xs} and ${breakpoint.devicemax.sm} {
    display: none;
  }
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

  @media only screen and ${breakpoint.devicemin.xs} and ${breakpoint.devicemax.lg} {
    font-size: 3rem;
    line-height: 50px;
    margin-left: 35px;
  }
`;

export {HeroContainer, HeroPositioning, HeroText};
