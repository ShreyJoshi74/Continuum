import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { children: "Play", variant: "primary" },
};

export const Secondary: Story = {
  args: { children: "More info", variant: "secondary" },
};

export const Disabled: Story = {
  args: { children: "Play", disabled: true },
};
