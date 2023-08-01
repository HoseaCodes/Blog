import styled from 'styled-components';

export const ProjectCardWrapper = styled.section`
  padding: 80px 0;
  position: relative;
`;
export const CardMask = styled.div`
  left: 0;
  width: 100%;
  z-index: -1;
  background-color: #1a1e23;
  position: absolute;
  top: 0;
  height: 100%;
  &:after {
    content: "";
  z-index: 20;
  width: 65%;
  max-width: 920px;
  left: 50%;
  -webkit-transform: translate3d(-50%, 0, 0);
  transform: translate3d(-50%, 0, 0);
  background: linear-gradient(
    90deg,
    rgba(28, 29, 37, 0.05) 0,
    rgba(28, 29, 37, 0.05) 1px,
    transparent 1px,
    transparent calc(50% - 1px),
    rgba(28, 29, 37, 0.05) calc(50% - 1px),
    rgba(28, 29, 37, 0.05) 50%,
    transparent 50%,
    transparent calc(100% - 1px),
    rgba(28, 29, 37, 0.05) calc(100% - 1px),
    rgba(28, 29, 37, 0.05) 100%);
  }
`;
export const CardList = styled.div`
  font-family: LibreBaskerville-Regular, Palatino Linotype, Times New Roman,
  serif;
  font-weight: 400;
  font-style: italic;
  margin-bottom: 20px;
`;

export const CardIcon = styled.span`
  position: absolute;
  top: 3px;
  right: -25px;
  width: 35px;
  height: 35px;
  -webkit-transform: translateX(0);
  transform: translateX(0);
  transition: -webkit-transform 0.3s cubic-bezier(0.694, 0.048, 0.335, 1);
  transition: transform 0.3s cubic-bezier(0.694, 0.048, 0.335, 1);
  transition: transform 0.3s cubic-bezier(0.694, 0.048, 0.335, 1),
    -webkit-transform 0.3s cubic-bezier(0.694, 0.048, 0.335, 1);
`;

export const CardStyledMask = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
  &::after {
    content: "";
  position: absolute;
  top: 0;
  opacity: 1;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(28, 29, 37, 0.9);
  background: linear-gradient(
    270deg,
    rgb(32, 106, 93, 0.9),
    rgb(11, 39, 34, 0.9)
  );
  -webkit-transform: translateX(-100%);
  transform: translateX(-100%);
  transition: opacity 0.2s,
    -webkit-transform 0.35s cubic-bezier(0.694, 0.048, 0.335, 1) 0.2s;
  transition: transform 0.35s cubic-bezier(0.694, 0.048, 0.335, 1) 0.2s,
    opacity 0.2s;
  transition: transform 0.35s cubic-bezier(0.694, 0.048, 0.335, 1) 0.2s,
    opacity 0.2s,
    -webkit-transform 0.35s cubic-bezier(0.694, 0.048, 0.335, 1) 0.2s;
  z-index: 9;
  }
`;

export const CardNumber = styled.div`
  display: block;
  position: absolute;
  top: -40px;
  right: -45px;
  width: 265px;
  height: 198px;
  font-size: 11.5625em;
  overflow: hidden;
  font-family: League Spartan, Helvetica, Arial, sans-serif;
  color: #99999d;
  -webkit-transform: translateY(15px);
  transform: translateY(15px);
  opacity: 0;
  transition: opacity 0.3s,
    -webkit-transform 0.45s cubic-bezier(0.694, 0.048, 0.335, 1);
  transition: opacity 0.3s,
    transform 0.45s cubic-bezier(0.694, 0.048, 0.335, 1);
  transition: opacity 0.3s,
    transform 0.45s cubic-bezier(0.694, 0.048, 0.335, 1),
    -webkit-transform 0.45s cubic-bezier(0.694, 0.048, 0.335, 1);
  z-index: 90;
  &:hover {
    opacity: 1;
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }
`;

export const CardCover = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

export const CardOverlay = styled.div`
  overflow: hidden;
  position: relative;
  -webkit-transform: translate3d(0, 100%, 0);
  transform: translate3d(0, 100%, 0);
  color: transparent;
  transition: -webkit-transform 0.6s cubic-bezier(0.694, 0.048, 0.335, 1) 0s;
  transition: transform 0.6s cubic-bezier(0.694, 0.048, 0.335, 1) 0s;
  transition: transform 0.6s cubic-bezier(0.694, 0.048, 0.335, 1) 0s,
    -webkit-transform 0.6s cubic-bezier(0.694, 0.048, 0.335, 1) 0s;
  transition-delay: 0.4s;
    -webkit-transform: translateZ(0);
  transform: translateZ(0);
  &:before {
    content: attr(data-index);
    position: absolute;
    top: 0;
    left: 0;
    color: #fff;
    text-shadow: 5px 5px 11px rgba(74, 74, 74, 0.5);
    width: 100%;
    height: 100%;
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
  }
`;

export const CardTextWrapper = styled.div`
  position: absolute;
  left: 90px;
  bottom: 90px;
  color: #fff;
  z-index: 10;
  max-width: 550px;
  -webkit-transform: scale(1) translateX(0);
  transform: scale(1) translateX(0);
  transition: opacity 0.25s, -webkit-transform 0.45s;
  transition: transform 0.45s, opacity 0.25s;
  transition: transform 0.45s, opacity 0.25s, -webkit-transform 0.45s;
  @media only screen and (max-width: 41.25em) {
    left: 45px;
    bottom: 60px;
    max-width: 500px;
  }
  @media only screen and (max-width: 25em) {
    left: 25px;
    bottom: 50px;
  }
`;

export const CardTitle = styled.h3`
  margin-bottom: 0.2652050919em;
  font-size: 4.414em;
  font-weight: 800;
  line-height: 1.3260254597;
  font-family: League Spartan, Helvetica, Arial, sans-serif;
  color: inherit;
  margin-top: 0;
  padding-top: 0;
  padding-bottom: 0;
  @media only screen and (min-device-width: 375px) and (max-device-width: 1180px) {
    font-size: 3.5rem;
  }
`;

export const CardSubtitle = styled.h5`
  font-family: LibreBaskerville-Regular, Palatino Linotype, Times New Roman,
    serif;
  font-weight: 400;
  font-style: italic;
  margin-bottom: 20px;
  font-size: 2em;
  line-height: 1.5;
`;

export const CardBtn = styled.button`
  cursor: pointer;
  text-decoration: none;
  border: 0;
  touch-action: manipulation;
  white-space: nowrap;
  display: inline-block;
  vertical-align: middle;
  font-family: League Spartan, Helvetica, Arial, sans-serif;
  font-size: 1.5em;
  font-weight: 800;
  letter-spacing: 3px;
  padding: 12px 20px;
  text-align: center;
  background-color: #d0a93a;
  background: linear-gradient(270deg, #d0a93a, #63511b);
  color: #fff;
  position: relative;
  transition: all 0.3s;
`;

export const CardBtnMask = styled.div`
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    -webkit-transform: translateX(-110%);
    transform: translateX(-110%);
    width: 100%;
    background-color: #1b2e63;
    background: linear-gradient(270deg, #235aa6, #101b3b);
    transition: -webkit-transform 0.6s cubic-bezier(0.694, 0.048, 0.335, 1) 0.05s;
    transition: transform 0.6s cubic-bezier(0.694, 0.048, 0.335, 1) 0.05s;
    transition: transform 0.6s cubic-bezier(0.694, 0.048, 0.335, 1) 0.05s,
      -webkit-transform 0.6s cubic-bezier(0.694, 0.048, 0.335, 1) 0.05s;
    z-index: 1;
    will-change: transform;
  }
  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    -webkit-transform: translateX(-110%);
    transform: translateX(-110%);
    will-change: transform;
    width: 80%;
    background-color: #26408b;
    background: linear-gradient(270deg, #235aa6, #213777);
    transition: -webkit-transform 0.6s cubic-bezier(0.694, 0.048, 0.335, 1);
    transition: transform 0.6s cubic-bezier(0.694, 0.048, 0.335, 1);
    transition: transform 0.6s cubic-bezier(0.694, 0.048, 0.335, 1),
      -webkit-transform 0.6s cubic-bezier(0.694, 0.048, 0.335, 1);
    z-index: 2;
  }
`;
export const CardSVG = styled.svg`
  width: 35px;
  height: 35px;
`;
export const CardSVGPath = styled.path`
  fill: #fff;
`;
