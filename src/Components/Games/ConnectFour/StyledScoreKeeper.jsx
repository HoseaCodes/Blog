import styled from "styled-components";

const StyledScoreKeeper = styled.div`
  border: 1px solid #00ffff;
  max-height: 200px;
  max-width: 300px;
  min-width: 250px;
  h4 {
    font-size: 28px;
    margin: 5px;
  }
  .score {
    display: flex;
    justify-content: space-between;
    border: 1px solid #00ffff;
    p {
      margin: 4px;
    }
  }
`;

export default StyledScoreKeeper;