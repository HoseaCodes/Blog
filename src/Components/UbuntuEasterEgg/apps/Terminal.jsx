import React, { Component } from 'react';
import styled from 'styled-components';
import { ubuntuTheme } from '../styled/tokens';

const PROMPT_USER = 'dominique@hoseacodes';

const DIR_TREE = {
  root: ['blog', 'projects', 'about', 'skills', 'languages', 'contact', 'interests'],
  blog: ['react-rewrites.md', 'why-design-tokens.md', 'shipping-fast.md'],
  projects: ['HoseaCodes-Blog', 'CareerConnect', 'CalorieKitchen', 'SneakerAPI', 'Writemind'],
  about: ['bio.txt', 'resume.pdf', 'photo.png'],
  skills: ['react', 'node.js', 'aws', 'mongodb', 'styled-components', 'devops'],
  languages: ['javascript', 'python', 'java', 'go'],
  contact: ['email.txt', 'linkedin.url', 'github.url'],
  interests: ['full-stack', 'cloud-native', 'design-systems', 'tea ☕'],
};

const NAV_COMMANDS = {
  code: 'vscode',
  vscode: 'vscode',
  chrome: 'chrome',
  trash: 'trash',
  settings: 'settings',
  calc: 'calc',
  about: 'profile',
  profile: 'profile',
};

const AVAILABLE = '[ cd, ls, pwd, echo, whoami, clear, exit, help, sudo, code, chrome, trash, settings, calc, profile ]';

const Wrap = styled.div`
  height: 100%;
  width: 100%;
  padding: 8px;
  background: ${ubuntuTheme.bg.drkAbrgn};
  color: #fff;
  font-family: ${ubuntuTheme.font.mono};
  font-size: 0.875rem;
  font-weight: 700;
  overflow-y: auto;
`;

const Row = styled.div`
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
`;

const PromptUser = styled.span`
  color: ${ubuntuTheme.text.green};
`;
const PromptPath = styled.span`
  color: ${ubuntuTheme.text.blue};
  margin-right: 2px;
`;
const PromptSym = styled.span`
  color: #fff;
  margin: 0 6px 0 2px;
`;
const Cmd = styled.span`
  color: #fff;
  white-space: pre-wrap;
`;

const Result = styled.div`
  white-space: pre-wrap;
  margin: 4px 0 8px;
  color: #fff;
  font-weight: 400;
`;

const Inline = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 4px 0 8px;
  span { color: ${ubuntuTheme.text.blue}; font-weight: 700; }
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

export class Terminal extends Component {
  constructor() {
    super();
    this.state = { history: [], value: '' };
    this.current_directory = '~';
    this.curr_dir_name = 'root';
    this.prevCommands = [];
    this.commandsIndex = -1;
    this.wrapRef = React.createRef();
  }

  componentDidUpdate() {
    if (this.wrapRef.current) {
      this.wrapRef.current.scrollTop = this.wrapRef.current.scrollHeight;
    }
  }

  push = (entry) => this.setState((s) => ({ history: [...s.history, entry] }));

  handle = (command) => {
    const words = command.split(' ').filter(Boolean);
    const main = words[0];
    const args = words.slice(1);
    const rest = args.join(' ').trim();
    const path = this.current_directory;

    let resultNode = null;
    let inlineDir = null;

    switch (main) {
      case 'cd':
        if (!rest) {
          this.current_directory = '~';
          this.curr_dir_name = 'root';
        } else if (args.length > 1) {
          resultNode = 'too many arguments, arguments must be <1.';
        } else if (rest === '.' || rest === '..' || rest === '../') {
          resultNode = "Type 'cd' to go back.";
        } else if (DIR_TREE[this.curr_dir_name].includes(rest)) {
          this.current_directory += '/' + rest;
          this.curr_dir_name = rest;
        } else {
          resultNode = `bash: cd: ${rest}: No such file or directory`;
        }
        break;
      case 'ls': {
        const target = args[0] || this.curr_dir_name;
        if (args.length > 1) {
          resultNode = 'too many arguments, arguments must be <1.';
        } else if (DIR_TREE[target]) {
          inlineDir = DIR_TREE[target];
        } else {
          resultNode = `ls: cannot access '${target}': No such file or directory`;
        }
        break;
      }
      case 'pwd':
        resultNode = path.replace('~', '/home/dominique');
        break;
      case 'echo':
        resultNode = args.join(' ');
        break;
      case 'whoami':
        resultNode = 'dominique';
        break;
      case 'help':
        resultNode = `Available commands: ${AVAILABLE}`;
        break;
      case 'clear':
        this.setState({ history: [] });
        return;
      case 'exit':
        if (this.props.onExit) this.props.onExit();
        return;
      case 'sudo':
        if (args[0] === 'ubuntu') {
          resultNode = "You're already in Ubuntu. 🐧";
        } else if (args[0] === 'rm' && args[1] === '-rf') {
          resultNode = 'Nice try.';
        } else {
          resultNode = `[sudo] password for dominique: ✖`;
        }
        break;
      default: {
        const appId = NAV_COMMANDS[main];
        if (appId && (args.length === 0 || args[0] === '.')) {
          if (this.props.openApp) this.props.openApp(appId);
          resultNode = null;
        } else {
          resultNode = `Command '${main}' not found, or not yet implemented.\nAvailable Commands: ${AVAILABLE}`;
        }
      }
    }

    this.push({
      input: command,
      directory: path,
      resultNode,
      inlineDir,
    });
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

  renderPrompt(directory) {
    return (
      <>
        <PromptUser>{PROMPT_USER}</PromptUser>
        <PromptSym>:</PromptSym>
        <PromptPath>{directory}</PromptPath>
        <PromptSym>$</PromptSym>
      </>
    );
  }

  render() {
    return (
      <Wrap ref={this.wrapRef} onClick={() => this.inputRef && this.inputRef.focus()}>
        {this.state.history.map((entry, i) => (
          <React.Fragment key={i}>
            <Row>
              {this.renderPrompt(entry.directory)}
              <Cmd>{entry.input}</Cmd>
            </Row>
            {entry.inlineDir && (
              <Inline>
                {entry.inlineDir.map((name, j) => (
                  <span key={j}>'{name}'</span>
                ))}
              </Inline>
            )}
            {entry.resultNode && <Result>{entry.resultNode}</Result>}
          </React.Fragment>
        ))}
        <InputForm onSubmit={this.onSubmit}>
          {this.renderPrompt(this.current_directory)}
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

export default Terminal;

export const displayTerminal = (openApp, onExit) => (
  <Terminal openApp={openApp} onExit={onExit} />
);
