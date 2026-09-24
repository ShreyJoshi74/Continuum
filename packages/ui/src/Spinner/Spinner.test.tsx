import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Spinner } from "./Spinner";

describe("Spinner", () => {
  it("is announced to screen readers via its status role and label", () => {
    render(<Spinner />);
    expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();
  });

  it("accepts a custom label", () => {
    render(<Spinner label="Fetching more titles" />);
    expect(screen.getByRole("status", { name: "Fetching more titles" })).toBeInTheDocument();
  });
});
