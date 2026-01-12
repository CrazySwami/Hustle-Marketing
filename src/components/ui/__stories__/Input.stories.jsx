import { Input } from '../input';
import { Label } from '../label';

export default {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url'],
    },
    disabled: {
      control: 'boolean',
    },
    placeholder: {
      control: 'text',
    },
  },
};

export const Default = {
  args: {
    type: 'text',
    placeholder: 'Enter text...',
  },
};

export const Types = () => (
  <div className="flex flex-col gap-4 w-80">
    <Input type="text" placeholder="Text input" />
    <Input type="email" placeholder="Email input" />
    <Input type="password" placeholder="Password input" />
    <Input type="number" placeholder="Number input" />
    <Input type="search" placeholder="Search input" />
  </div>
);

export const WithLabel = () => (
  <div className="grid w-full max-w-sm items-center gap-1.5">
    <Label htmlFor="email">Email</Label>
    <Input type="email" id="email" placeholder="Enter your email" />
  </div>
);

export const Disabled = () => (
  <Input disabled placeholder="Disabled input" className="w-80" />
);

export const File = () => (
  <div className="grid w-full max-w-sm items-center gap-1.5">
    <Label htmlFor="picture">Picture</Label>
    <Input id="picture" type="file" />
  </div>
);
