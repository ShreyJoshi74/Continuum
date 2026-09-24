import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextField } from "./TextField";

const meta: Meta<typeof TextField> = {
  title: "Components/TextField",
  component: TextField,
};
export default meta;

type Story = StoryObj<typeof TextField>;

export const Default: Story = {
  args: { label: "Search", placeholder: "Search titles..." },
};
