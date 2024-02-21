import { Button } from '../Components/Button/Button';
import {MdBookmarkBorder} from 'react-icons/md';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: 'Main/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary = {
  args: {
    primary: true,
    label: 'Create Article',
  },
};

export const SecondaryGreen = {
  args: {
    label: "Create Article",
    backgroundColor: "green",
  },
};

export const SecondaryBlack = {
  args: {
    label: "Get Started",
    backgroundColor: "black",
  },
};

