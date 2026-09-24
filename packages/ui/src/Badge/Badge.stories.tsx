import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
};
export default meta;

type Story = StoryObj<typeof Badge>;

export const Neutral: Story = {
  args: { children: "4K", variant: "neutral" },
};

export const Brand: Story = {
  args: { children: "NEW", variant: "brand" },
};
