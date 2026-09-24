import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders its label text", () => {
    render(<Badge>4K</Badge>);
    expect(screen.getByText("4K")).toBeInTheDocument();
  });

  it("defaults to the neutral variant", () => {
    render(<Badge>NEW</Badge>);
    expect(screen.getByText("NEW")).toHaveClass("badge--neutral");
  });

  it("switches to the brand variant when asked", () => {
    render(<Badge variant="brand">NEW</Badge>);
    expect(screen.getByText("NEW")).toHaveClass("badge--brand");
  });
});
