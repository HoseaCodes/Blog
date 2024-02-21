import styled, {css, keyframes} from 'styled-components';

export const StyledDivButton = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 5rem;
  color: white;
  margin-bottom: 5rem;
  ${(props) =>
    props.Primary &&
    css`
      background: rgb(235, 183, 65);
    `}
`;

export const StyledButtonH2 = styled.h2`
  padding-bottom: 1%;
`;

const personalbtn = keyframes`
  0% {
    left: 250%;
  }
  100% {
    left: 0%;
  }
`;

export const StyledButtonATag = styled.a`
  border: 2px solid #204740;
  box-sizing: inherit;
  cursor: pointer;
  display: inline-block;
  font-size: 1.8em;
  margin-bottom: 10px;
  padding: 10px 20px;
  background-color: transparent;
  transition: all 0.5s;
  text-decoration: none;
  left: 35%;
  overflow: hidden;
  animation: ${personalbtn} 10s steps(1) -1s normal;
  color: #fff;
  border-color: #fff;
  &:hover {
    text-decoration: none;
    border-color: #206a5d;
    background-color: #204740;
    color: #fff;
  }
  ${props => props.Primary && css`
      display: flex;
      justify-content: center;
      text-transform: uppercase;
      text-align: center;
      white-space: nowrap;
      width: fit-content;
      margin: 0 auto;
      &:hover {
        transition: 0.5s color ease;
      }
      @media only screen and (min-device-width: 375px) and (max-device-width: 1180px) {
        width: fit-content;
        margin: auto;
        bottom: 0 !important;
      }
  `}
`;

export const StyledButton = styled.button`
  font-weight: 700;
  border-radius: 3em;
  line-height: 1;
  border: 2px solid #204740;
  box-sizing: inherit;
  cursor: pointer;
  display: inline-block;
  margin-bottom: 10px;
  padding: 10px 20px;
  background-color: transparent;
  transition: all 0.5s;
  text-decoration: none;
  left: 35%;
  overflow: hidden;
  animation: ${personalbtn} 10s steps(1) -1s normal;
  &:hover {
    text-decoration: none;
    border-color: #206a5d;
    background-color: #204740;
    color: #fff;
  }
  ${(props) =>
    props.Primary &&
    css`
      display: flex;
      justify-content: center;
      text-transform: uppercase;
      text-align: center;
      white-space: nowrap;
      width: fit-content;
      margin: 0 auto;
      &:hover {
        transition: 0.5s color ease;
      }
      @media only screen and (min-device-width: 375px) and (max-device-width: 1180px) {
        width: 20%;
        margin: auto;
        bottom: 0 !important;
        width: 40%;
      }
    `}
  ${(props) =>
    props.disabled &&
    css`
      border: 1px solid #999999;
      background-color: #cccccc;
      color: #666666;
    `}
`;
