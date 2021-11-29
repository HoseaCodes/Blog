import styled from 'styled-components';

export const StyledQuoteContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 25px;
  background-color: #fff;
`;

export const StyledQuoteAuthor = styled.p`
  margin-top: 30px;
  color: #000;
  font-size: 2rem;
`;

export const StyledQuote = styled.q`
  line-height: 2;
  font-size: 1.8em;
  width: 40%;
  color: #000;
  @media only screen and (max-width: 480px) {
    line-height: 1;
    font-size: 2.1em;
    width: 80%;
  }
`;
