import React from 'react';
import styled from 'styled-components';
import { vsTokens } from '../styled/tokens';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin-top: 16px;
  font-size: 14px;
  color: ${vsTokens.brown};
`;

const Item = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const Icon = styled.img`
  width: 20px;
  height: 20px;
  margin: 0 12px 0 12px;
`;

const Code = styled.code`
  font-family: ${vsTokens.font.mono};
`;

export default function List({ list }) {
  return (
    <Grid>
      {list && list.map((it, i) => (
        <Item key={i}>
          <Icon src={it.logo} alt={it.name} />
          <Code>{it.name}</Code>
        </Item>
      ))}
    </Grid>
  );
}
