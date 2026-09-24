import type { Meta, StoryObj } from "@storybook/react-vite";
import { Rail } from "./Rail";
import { Card } from "../Card/Card.js";

const meta: Meta<typeof Rail> = {
  title: "Components/Rail",
  component: Rail,
};
export default meta;

type Story = StoryObj<typeof Rail>;

export const Default: Story = {
  args: {
    title: "Trending Now",
    children: [0, 1, 2, 3, 4].map((i) => (
      <Card
        key={i}
        title={`Title ${i + 1}`}
        imageUrl={`https://picsum.photos/seed/continuum-rail-${i}/400/225`}
      />
    )),
  },
};
