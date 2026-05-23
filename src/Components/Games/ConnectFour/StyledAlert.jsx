import styled from "styled-components";
  
const StyledAlert = styled.div`
  border: 1px solid ${(props) => props.color};
  border-radius: 10px;
  color: ${(props) => props.color};
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 2px;
  min-height: 50px;
  opacity: ${(props) => (props.visible ? 1 : 0)};
  padding: 10px;
  transition: opacity 0.3s ease-out;
`;
export default StyledAlert;