import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { Skeleton } from "./Skeleton";

describe("Skeleton", () => {
  it("defaults to a landscape aspect ratio", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass("skeleton--landscape");
  });

  it("switches to portrait when asked", () => {
    const { container } = render(<Skeleton orientation="portrait" />);
    expect(container.firstChild).toHaveClass("skeleton--portrait");
  });
});
