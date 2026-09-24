import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TextField } from "./TextField";

describe("TextField", () => {
  it("associates its label with the input, without the caller wiring an id", () => {
    render(<TextField label="Search" />);
    expect(screen.getByLabelText("Search")).toBeInTheDocument();
  });

  it("accepts typed input", async () => {
    render(<TextField label="Search" />);
    const input = screen.getByLabelText("Search");
    await userEvent.type(input, "the matrix");
    expect(input).toHaveValue("the matrix");
  });

  it("calls onChange as a controlled input would expect", async () => {
    const onChange = vi.fn();
    render(<TextField label="Search" value="" onChange={onChange} />);
    await userEvent.type(screen.getByLabelText("Search"), "a");
    expect(onChange).toHaveBeenCalled();
  });
});
