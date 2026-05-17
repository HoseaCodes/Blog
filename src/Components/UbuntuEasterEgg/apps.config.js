import { displayTrash } from './apps/Trash';
import { displaySettings } from './apps/Settings';
import { displayVSCode } from './apps/VSCode';
import { displayChrome } from './apps/Chrome';
import { displayCalc } from './apps/Calc';
import { displayTerminal } from './apps/Terminal';
import { displayProfile } from './apps/Profile';

const apps = [
  {
    id: 'profile',
    title: 'About Me',
    icon: 'themes/Yaru/system/user-home.png',
    disabled: false,
    favourite: true,
    desktop_shortcut: true,
    screen: () => displayProfile(),
  },
  {
    id: 'chrome',
    title: 'Chrome',
    icon: 'themes/Yaru/apps/chrome.png',
    disabled: false,
    favourite: true,
    desktop_shortcut: false,
    screen: () => displayChrome(),
  },
  {
    id: 'vscode',
    title: 'VS Code',
    icon: 'themes/Yaru/apps/vscode.png',
    disabled: false,
    favourite: true,
    desktop_shortcut: false,
    screen: () => displayVSCode(),
  },
  {
    id: 'terminal',
    title: 'Terminal',
    icon: 'themes/Yaru/apps/bash.png',
    disabled: false,
    favourite: true,
    desktop_shortcut: false,
    screen: ({ openApp, onExit } = {}) => displayTerminal(openApp, onExit),
  },
  {
    id: 'calc',
    title: 'Calculator',
    icon: 'themes/Yaru/apps/calc.png',
    disabled: false,
    favourite: true,
    desktop_shortcut: false,
    screen: () => displayCalc(),
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: 'themes/Yaru/apps/gnome-control-center.png',
    disabled: false,
    favourite: true,
    desktop_shortcut: false,
    screen: ({ changeBackgroundImage, currBgImgName } = {}) =>
      displaySettings(changeBackgroundImage, currBgImgName),
  },
  {
    id: 'trash',
    title: 'Trash',
    icon: 'themes/Yaru/system/user-trash-full.png',
    disabled: false,
    favourite: false,
    desktop_shortcut: true,
    screen: () => displayTrash(),
  },
];

export default apps;
