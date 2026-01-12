import { Button } from '../button';
import { Mail, Loader2, ChevronRight } from 'lucide-react';

export default {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export const Default = {
  args: {
    children: 'Button',
    variant: 'default',
    size: 'default',
  },
};

export const Variants = () => (
  <div className="flex flex-wrap gap-4">
    <Button variant="default">Default</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="destructive">Destructive</Button>
    <Button variant="outline">Outline</Button>
    <Button variant="ghost">Ghost</Button>
    <Button variant="link">Link</Button>
  </div>
);

export const Sizes = () => (
  <div className="flex flex-wrap items-center gap-4">
    <Button size="sm">Small</Button>
    <Button size="default">Default</Button>
    <Button size="lg">Large</Button>
    <Button size="icon"><Mail className="h-4 w-4" /></Button>
  </div>
);

export const WithIcon = () => (
  <div className="flex flex-wrap gap-4">
    <Button>
      <Mail className="mr-2 h-4 w-4" /> Login with Email
    </Button>
    <Button variant="secondary">
      Next <ChevronRight className="ml-2 h-4 w-4" />
    </Button>
  </div>
);

export const Loading = () => (
  <Button disabled>
    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
    Please wait
  </Button>
);

export const Disabled = () => (
  <div className="flex flex-wrap gap-4">
    <Button disabled>Disabled</Button>
    <Button variant="secondary" disabled>Disabled</Button>
    <Button variant="outline" disabled>Disabled</Button>
  </div>
);

export const AsChild = () => (
  <Button asChild>
    <a href="https://example.com">Link Button</a>
  </Button>
);
