import React, { Component } from 'react';
import styled from 'styled-components';
import { Parser } from 'expr-eval';
import { ubuntuTheme } from '../styled/tokens';

const parser = new Parser({
  operators: {
    add: true, concatenate: true, conditional: true, divide: true, factorial: true,
    multiply: true, power: true, remainder: true, subtract: true,
    logical: false, comparison: false, in: false, assignment: true,
  },
});

const HELP_TEXT = `Available Commands:

Operators: + - * / % ^
Functions: abs, sin, cos, tan, sqrt, ceil, floor, round, log, log10, log2, min, max, hypot, pow, roundTo
Constants: E, PI
Assignment: x = 1   (then use x in later calculations)
clear — clear the screen
exit  — close calculator
help  — this message`;

const Wrap = styled.div`
  height: 100%;
  width: 100%;
  padding: 8px;
  background: ${ubuntuTheme.bg.drkAbrgn};
  color: ${ubuntuTheme.text.grey};
  font-family: ${ubuntuTheme.font.mono};
  font-size: 0.875rem;
  overflow-y: auto;
`;

const Banner = styled.div`
  margin-bottom: 8px;
  opacity: 0.85;
`;

const Row = styled.div`
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  margin-top: 4px;
`;

const Prompt = styled.span`
  color: ${ubuntuTheme.text.green};
  margin-right: 8px;
  user-select: none;
`;

const Cmd = styled.span`
  white-space: pre-wrap;
  color: #fff;
`;

const Result = styled.div`
  white-space: pre-wrap;
  margin: 4px 0;
`;

const InputForm = styled.form`
  display: flex;
  align-items: center;
  margin-top: 4px;
`;

const InputField = styled.input`
  flex: 1;
  background: transparent;
  border: 0;
  outline: 0;
  color: #fff;
  font: inherit;
`;

export class Calc extends Component {
  constructor() {
    super();
    this.state = { history: [], value: '' };
    this.variables = {};
    this.prevCommands = [];
    this.commandsIndex = -1;
    this.wrapRef = React.createRef();
  }

  componentDidUpdate() {
    if (this.wrapRef.current) {
      this.wrapRef.current.scrollTop = this.wrapRef.current.scrollHeight;
    }
  }

  evaluate = (command) => {
    try {
      const expr = parser.parse(command);
      const value = parser.evaluate(command, this.variables);
      // detect simple assignment like `x = 1` and persist the variable
      if (
        expr.tokens.length >= 3 &&
        expr.tokens[expr.tokens.length - 1].type === 'IOP2'
      ) {
        const vars = expr.variables();
        if (vars.length) this.variables[vars[0]] = value;
      }
      return String(value);
    } catch (e) {
      return e && e.message ? e.message : 'Invalid Expression';
    }
  };

  handle = (command) => {
    const main = command.split(' ').filter(Boolean)[0];
    let result;
    switch (main) {
      case 'clear':
        this.setState({ history: [] });
        return;
      case 'exit':
        document.getElementById(`close-${this.props.id || 'calc'}`)?.click();
        return;
      case 'help':
        result = HELP_TEXT;
        break;
      default:
        result = this.evaluate(command);
    }
    this.setState((s) => ({ history: [...s.history, { input: command, result }] }));
  };

  onSubmit = (e) => {
    e.preventDefault();
    const v = this.state.value.trim();
    if (!v) return;
    this.prevCommands.push(v);
    this.commandsIndex = this.prevCommands.length;
    this.setState({ value: '' });
    this.handle(v);
  };

  onKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (this.commandsIndex > 0) this.commandsIndex--;
      this.setState({ value: this.prevCommands[this.commandsIndex] || '' });
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (this.commandsIndex < this.prevCommands.length) this.commandsIndex++;
      this.setState({ value: this.prevCommands[this.commandsIndex] || '' });
    }
  };

  render() {
    return (
      <Wrap ref={this.wrapRef} onClick={() => this.inputRef && this.inputRef.focus()}>
        <Banner>
          <div>C-style arbitrary precision calculator (HoseaCodes edition)</div>
          <div>Type "help" for help, "clear" to clear, "exit" to close.</div>
        </Banner>
        {this.state.history.map((entry, i) => (
          <React.Fragment key={i}>
            <Row>
              <Prompt>;</Prompt>
              <Cmd>{entry.input}</Cmd>
            </Row>
            <Result>{entry.result}</Result>
          </React.Fragment>
        ))}
        <InputForm onSubmit={this.onSubmit}>
          <Prompt>;</Prompt>
          <InputField
            ref={(el) => (this.inputRef = el)}
            value={this.state.value}
            onChange={(e) => this.setState({ value: e.target.value })}
            onKeyDown={this.onKeyDown}
            autoFocus
            spellCheck={false}
            autoComplete="off"
          />
        </InputForm>
      </Wrap>
    );
  }
}

export default Calc;

export const displayCalc = () => <Calc />;
