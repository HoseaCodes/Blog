import { AncorButton } from '../Components/Button/AncorButton';

export default {
  title: "Main/Button/AncorTag",
  component: AncorButton,
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark" },
  },
  tags: ["autodocs"],
};

export const Primary = {
  args: {
    href: "http://www.dominiquehosea.com",
    primary: true,
    target: "_blank",
    label: 'Back to Top',
  },
};

