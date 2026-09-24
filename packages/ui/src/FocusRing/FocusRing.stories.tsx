import type { Meta, StoryObj } from "@storybook/react-vite";
import { FocusRing } from "./FocusRing";

const meta: Meta<typeof FocusRing> = {
  title: "Components/FocusRing",
  component: FocusRing,
};
export default meta;

type Story = StoryObj<typeof FocusRing>;

export const Default: Story = {
  args: { children: "Tab to me — custom focusable content" },
};
