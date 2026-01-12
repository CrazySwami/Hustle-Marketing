import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from '../card';
import { Button } from '../button';
import { Input } from '../input';
import { Label } from '../label';

export default {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export const Default = () => (
  <Card className="w-[350px]">
    <CardHeader>
      <CardTitle>Card Title</CardTitle>
      <CardDescription>Card Description</CardDescription>
    </CardHeader>
    <CardContent>
      <p>Card content goes here.</p>
    </CardContent>
    <CardFooter>
      <Button>Action</Button>
    </CardFooter>
  </Card>
);

export const WithForm = () => (
  <Card className="w-[350px]">
    <CardHeader>
      <CardTitle>Create Project</CardTitle>
      <CardDescription>Deploy your new project in one click.</CardDescription>
    </CardHeader>
    <CardContent>
      <form>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Name of your project" />
          </div>
        </div>
      </form>
    </CardContent>
    <CardFooter className="flex justify-between">
      <Button variant="outline">Cancel</Button>
      <Button>Deploy</Button>
    </CardFooter>
  </Card>
);

export const Simple = () => (
  <Card className="w-[350px] p-6">
    <p className="text-sm text-muted-foreground">
      A simple card with just content and padding.
    </p>
  </Card>
);
