import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { RailHeader } from "./RailHeader";

describe("RailHeader", () => {
  it("renders its text as a level-2 heading", () => {
    render(<RailHeader>Trending Now</RailHeader>);
    expect(screen.getByRole("heading", { level: 2, name: "Trending Now" })).toBeInTheDocument();
  });
});
