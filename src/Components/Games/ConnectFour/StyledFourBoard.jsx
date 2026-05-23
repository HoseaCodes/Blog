import styled from 'styled-components';

const StyledFourBoard = styled.div`
display: grid;
grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
grid-gap: 0px;
margin: 0 auto;
margin-bottom: 10px;
width: 320px;
@media (min-width: 576px) {
  width: 496px;
}
@media (min-width: 768px) {
  width: 560px;
}
@media (min-width: 976px) {
  width: 816px;
}
`

export default StyledFourBoard;