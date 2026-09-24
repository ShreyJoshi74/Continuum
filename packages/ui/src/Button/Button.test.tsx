import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button", () => {
  it("renders its label and responds to a click", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Play</Button>);

    const button = screen.getByRole("button", { name: "Play" });
    await userEvent.click(button);

    expect(onClick).toHaveBeenCalledOnce();
  });

  it("defaults to the primary variant", () => {
    render(<Button>Play</Button>);
    expect(screen.getByRole("button")).toHaveClass("btn--primary");
  });

  it("switches to the secondary variant when asked", () => {
    render(<Button variant="secondary">Cancel</Button>);
    expect(screen.getByRole("button")).toHaveClass("btn--secondary");
  });

  it("can be disabled", () => {
    render(<Button disabled>Play</Button>);
    expect(screen.getByRole("button", { name: "Play" })).toBeDisabled();
  });

  it("is reachable by keyboard, same as the D-pad will need (§9 rule 4)", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Play</Button>);

    await userEvent.tab();
    expect(screen.getByRole("button")).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledOnce();
  });
});
