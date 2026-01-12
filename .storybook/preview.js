import '../src/styles/globals.css';
import '../src/styles/index.css';

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: '#08080C',
        },
        {
          name: 'light',
          value: '#ffffff',
        },
      ],
    },
  },
  tags: ['autodocs'],
};

export default preview;
