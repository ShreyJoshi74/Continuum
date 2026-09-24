import type { Meta, StoryObj } from "@storybook/react-vite";
import { RailHeader } from "./RailHeader";

const meta: Meta<typeof RailHeader> = {
  title: "Components/RailHeader",
  component: RailHeader,
};
export default meta;

type Story = StoryObj<typeof RailHeader>;

export const Default: Story = {
  args: { children: "Trending Now" },
};
