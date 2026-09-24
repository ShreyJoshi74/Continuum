import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "./EmptyState";
import { Button } from "../Button/Button.js";

describe("EmptyState", () => {
  it("renders its title", () => {
    render(<EmptyState title="No results" />);
    expect(screen.getByText("No results")).toBeInTheDocument();
  });

  it("renders an optional description", () => {
    render(<EmptyState title="No results" description="Try a different search term." />);
    expect(screen.getByText("Try a different search term.")).toBeInTheDocument();
  });

  it("renders an optional action", () => {
    render(<EmptyState title="No results" action={<Button>Clear search</Button>} />);
    expect(screen.getByRole("button", { name: "Clear search" })).toBeInTheDocument();
  });
});
