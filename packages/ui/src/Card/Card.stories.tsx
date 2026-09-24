import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "./Card";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
};
export default meta;

type Story = StoryObj<typeof Card>;

export const Landscape: Story = {
  args: {
    title: "The Signal",
    imageUrl: "https://picsum.photos/seed/continuum-card/400/225",
    orientation: "landscape",
    badges: ["4K", "HDR"],
  },
};

export const Portrait: Story = {
  args: {
    title: "Nightfall Express",
    imageUrl: "https://picsum.photos/seed/continuum-card-2/300/450",
    orientation: "portrait",
    badges: ["NEW"],
  },
};
