import type { Meta, StoryObj } from "@storybook/react-vite";
import { SafeArea } from "./SafeArea";

const meta: Meta<typeof SafeArea> = {
  title: "Components/SafeArea",
  component: SafeArea,
};
export default meta;

type Story = StoryObj<typeof SafeArea>;

export const Default: Story = {
  args: {
    children: (
      <div style={{ outline: "var(--border-width) dashed currentColor" }}>
        Page content — watch the outline inset on the TV density (5% safe margin)
      </div>
    ),
  },
};
