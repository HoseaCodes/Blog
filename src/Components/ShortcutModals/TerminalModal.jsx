import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

async function getcat() {
  const res = await fetch('https://api.thecatapi.com/v1/images/search');
  const resp = await res.json();
  return resp[0].url;
}

const fetchNowPlaying = async () => {
  const res = await fetch('https://spotify-np-api.vercel.app/api', {mode: 'cors'});
  console.log(res);
  const data = await res.json();
  return data['np'];
}


const ModalContainer = styled.div`
  position: fixed;
  bottom: ${props => props.isOpen ? '0' : '-500px'};
  left: 0;
  right: 0;
  height: 500px;
  background-color: #1e1e1e;
  color: #fff;
  transition: bottom 0.3s ease-in-out;
  z-index: 1000;
  border-top: 1px solid #333;
`;

const ModalHeader = styled.div`
  padding: 8px;
  background-color: #2d2d2d;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #333;
`;

const Title = styled.div`
  font-family: monospace;
  font-size: 14px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 16px;
  &:hover {
    color: #ff4444;
  }
`;

const TerminalContent = styled.div`
  padding: 16px;
  height: calc(100% - 37px);
  overflow-y: auto;
  font-family: monospace;
  font-size: 14px;
  line-height: 1.4;
  white-space: pre-wrap;
`;

const Input = styled.input`
  width: 100%;
  background: none;
  border: none;
  color: #fff;
  font-family: monospace;
  font-size: 14px;
  outline: none;
  padding: 0;
  margin: 0;
`;

const TerminalModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState(['Welcome to the terminal. Type "help" for available commands.']);
  const [currentInput, setCurrentInput] = useState('');
  const [currentPath, setCurrentPath] = useState('~');
  const [directories, setDirectories] = useState({
    '~': []
  });
  const contentRef = useRef(null);

  useEffect(() => {
    const handleKeyPress = (e) => {
      // Cmd/Ctrl + H to toggle terminal
      if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen(prev => !prev);
        return;
      }
      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen(false);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyPress, true);
    return () => window.removeEventListener('keydown', handleKeyPress, true);
  }, [isOpen]);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [history]);

  const commands = {
    echo: {
      description: 'Prints the given text to the console',
      usage: 'echo <text>',
      fn: (...args) => args.join(' ')
    },
    cat: {
      description: 'Get a cute cat image',
      usage: 'cat',
      fn: async () => {
        const url = await getcat();
        window.open(url, '_blank');
        return 'fetching cat...\ncat fetched successfully!';
      }
    },
    about: {
      description: 'About Me',
      usage: 'about',
      fn: () => {
        return `About Me.\n---\nDominique Hosea\nSoftware Engineer\nFull Stack Developer\nCloud Engineer\nTech Enthusiast\n---\n`;
      }
    },
    twitter: {
      description: 'Opens my Twitter Handle',
      usage: 'twitter',
      fn: () => {
        window.open('https://twitter.com/hoseacodes', '_blank');
        return 'opening twitter handle...';
      }
    },
    github: {
      description: 'Opens my GitHub Profile',
      usage: 'github',
      fn: () => {
        window.open('https://github.com/hoseacodes', '_blank');
        return 'opening github account...';
      }
    },
    linkedin: {
      description: 'Opens my LinkedIn Profile',
      usage: 'linkedin',
      fn: () => {
        window.open('https://www.linkedin.com/in/dominique-hosea', '_blank');
        return 'opening linkedin profile...';
      }
    },
    languages: {
      description: 'Languages I know',
      usage: 'languages',
      fn: () => {
        return `
          Languages I know.\n---\n
          javascript       - 90%
          python           - 80%
          java             - 70%
          html5            - 90%
          css3             - 90%
          sql              - 80%\n---\n
        `;
      }
    },
    skills: {
      description: 'Skills I have',
      usage: 'skills',
      fn: () => {
        return `
          Skills I have.\n---\n
          web-development  - 90%
          cloud-computing  - 80%
          devops           - 70%
          problem-solving  - 90%
          team-leadership  - 85%
          agile-methods    - 90%\n---\n
        `;
      }
    },
    projects: {
      description: 'Projects I have worked on',
      usage: 'projects',
      fn: () => {
        return `
          Notable projects I have worked on.\n---\n
          'Portfolio'    | 'Personal Website'     | 'React/Node.js'
          'CloudWatch'   | 'AWS Monitoring Tool'  | 'Python/AWS'
          'DevFlow'      | 'CI/CD Pipeline'       | 'Jenkins/Docker'
          'DataViz'      | 'Analytics Platform'   | 'Python/D3.js'\n---\n
        `;
      }
    },
    editor: {
      description: 'Details about my current editor',
      usage: 'editor',
      fn: () => {
        return `
          Editor: Visual Studio Code\n
          Theme : One Dark Pro\n
          Font  : JetBrains Mono
        `;
      }
    },
    spotify: {
      description: 'Get info about my recently played song',
      usage: 'spotify',
      fn: async () => {
        try {
          const item = await fetchNowPlaying();
          return `
            Now Playing/Recently Played\n
            ---\n
            Song: ${item.song}\n
            Artist: ${item.artist}\n---\n
          `;
        } catch (error) {
          return 'Failed to fetch Spotify data';
        }
      }
    },
    cd: {
      description: 'Change directory',
      usage: 'cd <directory>',
      fn: (...args) => {
        if (args.length === 1) {
          if (args[0] === '..') {
            if (currentPath === '~') {
              return 'Already at home directory';
            }
            const newPath = currentPath.split('/').slice(0, -1).join('/');
            setCurrentPath(newPath || '~');
            return `Changed directory to ${newPath || '~'}`;
          } else if (directories[currentPath]?.includes(args[0])) {
            const newPath = currentPath === '~' ? `~/${args[0]}` : `${currentPath}/${args[0]}`;
            setCurrentPath(newPath);
            return `Changed directory to ${newPath}`;
          }
        }
        return 'Invalid directory';
      }
    },
    ls: {
      description: 'List directory contents',
      usage: 'ls',
      fn: () => {
        const currentDirContents = directories[currentPath] || [];
        return currentDirContents.length ? currentDirContents.join('\n') : 'Directory is empty';
      }
    },
    mkdir: {
      description: 'Make directory',
      usage: 'mkdir <name>',
      fn: (...args) => {
        if (args.length === 1) {
          const dirName = args[0];
          setDirectories(prev => ({
            ...prev,
            [currentPath]: [...(prev[currentPath] || []), dirName],
            [`${currentPath === '~' ? '~/' : currentPath + '/'}${dirName}`]: []
          }));
          return `Created directory: ${dirName}`;
        }
        return 'Invalid arguments';
      }
    },
    clear: {
      description: 'Clear the terminal',
      usage: 'clear',
      fn: () => {
        setHistory([]);
        return '';
      }
    },
    help: {
      description: 'List all available commands',
      usage: 'help',
      fn: () => {
        const cmdList = Object.entries(commands)
          .map(([name, cmd]) => `${name.padEnd(12)} | ${cmd.description.padEnd(39)} | ${cmd.usage}`)
          .join('\n');
        return `Available commands:\n\n${cmdList}`;
      }
    }
  };

  const handleCommand = async (commandLine) => {
    const args = commandLine.trim().split(' ');
    const cmd = args[0].toLowerCase();
    const cmdArgs = args.slice(1);
    
    const newHistory = [...history, `${currentPath} > ${commandLine}`];
    
    if (commands[cmd]) {
      try {
        const result = await commands[cmd].fn(...cmdArgs);
        if (result) {
          newHistory.push(result);
        }
      } catch (error) {
        newHistory.push(`Error executing command: ${error.message}`);
      }
    } else {
      newHistory.push(`Command not found: ${cmd}`);
    }
    
    setHistory(newHistory);
  };

  const handleInputKeyPress = (e) => {
    if (e.key === 'Enter' && currentInput.trim()) {
      handleCommand(currentInput.trim());
      setCurrentInput('');
    }
  };

  return (
    <ModalContainer isOpen={isOpen}>
      <ModalHeader>
        <Title>Terminal</Title>
        <CloseButton onClick={() => setIsOpen(false)}>×</CloseButton>
      </ModalHeader>
      <TerminalContent ref={contentRef}>
        {history.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span>{`${currentPath} > `}</span>
          <Input
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyPress={handleInputKeyPress}
            autoFocus
          />
        </div>
      </TerminalContent>
    </ModalContainer>
  );
};

export default TerminalModal;
