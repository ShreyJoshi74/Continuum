import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { IconButton } from "./IconButton";

describe("IconButton", () => {
  it("is announced by its aria-label, not its icon markup", () => {
    render(<IconButton icon={<svg />} aria-label="Mute" />);
    expect(screen.getByRole("button", { name: "Mute" })).toBeInTheDocument();
  });

  it("responds to a click", async () => {
    const onClick = vi.fn();
    render(<IconButton icon={<svg />} aria-label="Mute" onClick={onClick} />);

    await userEvent.click(screen.getByRole("button", { name: "Mute" }));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
