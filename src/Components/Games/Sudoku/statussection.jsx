import React from 'react';
import { Difficulty } from './difficulty';
import { Timer } from './timer';
import { Numbers } from './numbers';
import { Action } from './action';
import { Mode } from './mode';

/**
 * React component for the Status Section.
 */
export const StatusSection = (props) => {
  return (
    <section className="sudoku-status">
      <Difficulty onChange={props.onChange} />
      <Timer />
      <Numbers onClickNumber={(number) => props.onClickNumber(number)} />
      <div className="sudoku-status__actions">
        <Action action='undo' onClickAction={props.onClickUndo} />
        <Action action='erase' onClickAction={props.onClickErase} />
        <Action action='hint' onClickAction={props.onClickHint} />
        <Mode mode='mistakes' onClickMode={props.onClickMistakesMode} />
        <Mode mode='fast' onClickMode={props.onClickFastMode} />
      </div>
    </section>
  )
}
