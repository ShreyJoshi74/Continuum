import type { Meta, StoryObj } from "@storybook/react-vite";
import { GridCell } from "./GridCell";
import { Card } from "../Card/Card.js";

const meta: Meta<typeof GridCell> = {
  title: "Components/GridCell",
  component: GridCell,
};
export default meta;

type Story = StoryObj<typeof GridCell>;

export const Default: Story = {
  args: {
    children: (
      <Card title="The Signal" imageUrl="https://picsum.photos/seed/continuum-grid/400/225" />
    ),
  },
};
