import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton } from "./Skeleton";

const meta: Meta<typeof Skeleton> = {
  title: "Components/Skeleton",
  component: Skeleton,
};
export default meta;

type Story = StoryObj<typeof Skeleton>;

export const Landscape: Story = {
  args: { orientation: "landscape" },
};

export const Portrait: Story = {
  args: { orientation: "portrait" },
};
