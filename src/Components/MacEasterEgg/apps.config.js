import { displayTrash } from '../UbuntuEasterEgg/apps/Trash';
import { displayVSCode } from '../UbuntuEasterEgg/apps/VSCode';
import { displayCalc } from '../UbuntuEasterEgg/apps/Calc';
import { displayTerminal } from '../UbuntuEasterEgg/apps/Terminal';
import { displayProfile } from '../UbuntuEasterEgg/apps/Profile';
import { displaySettings } from '../UbuntuEasterEgg/apps/Settings';
import { displayPathFinder } from '../UbuntuEasterEgg/apps/PathFinder';
import { displayPostman } from '../UbuntuEasterEgg/apps/Postman';
import { displaySafari } from './apps/Safari';
import { displayFinder } from './apps/Finder';
import { displayMail } from './apps/Mail';

const apps = [
  {
    id: 'finder',
    title: 'Finder',
    icon: 'finder-logo.png',
    disabled: false,
    screen: () => displayFinder(),
  },
  {
    id: 'safari',
    title: 'Safari',
    icon: 'safari-logo.png',
    disabled: false,
    screen: () => displaySafari(),
  },
  {
    id: 'profile',
    title: 'About Me',
    icon: 'contacts-logo.png',
    disabled: false,
    screen: () => displayProfile(),
  },
  {
    id: 'mail',
    title: 'Mail',
    icon: 'mail-logo.png',
    disabled: false,
    screen: () => displayMail(),
  },
  {
    id: 'terminal',
    title: 'Terminal',
    icon: 'note-logo.png',
    disabled: false,
    screen: ({ openApp, onExit } = {}) => displayTerminal(openApp, onExit),
  },
  {
    id: 'vscode',
    title: 'VS Code',
    icon: 'pdf-icon.png',
    disabled: false,
    screen: () => displayVSCode(),
  },
  {
    id: 'calc',
    title: 'Calculator',
    icon: 'stocks-logo.png',
    disabled: false,
    screen: () => displayCalc(),
  },
  {
    id: 'pathfinder',
    title: 'PathFinder',
    icon: 'maps-logo.png',
    disabled: false,
    screen: () => displayPathFinder(),
  },
  {
    id: 'postman',
    title: 'Postman',
    icon: 'news-logo.png',
    disabled: false,
    screen: () => displayPostman(),
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: 'settings-logo.png',
    disabled: false,
    screen: ({ changeBackgroundImage, currBgImgName } = {}) =>
      displaySettings(changeBackgroundImage, currBgImgName),
  },
  {
    id: 'trash',
    title: 'Trash',
    icon: 'disk-icon.png',
    disabled: false,
    screen: () => displayTrash(),
  },
];

export default apps;
