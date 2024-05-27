import styled from "styled-components";

const StyledConnectFour = styled.section`
  display: flex;
  flex-direction: column;
  padding: 10px;
  #game-wrapper {
    border: 1px solid #00ffff;
    margin-bottom: 10px;
    padding: 10px;
    text-align: center;
    h4 {
      font-size: 28px;
      margin: 10px;
    }
    h6 {
      font-size: 24px;
      margin-bottom: 5px;
    }
  }
  #scoreboard-wrapper {
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }
  #setup-wrapper {
    button {
      margin-bottom: 5px;
    }
  }
  @media (min-width: 978px) {
    margin: 0 auto;
    width: 1000px;
  }
`;

export default StyledConnectFour;