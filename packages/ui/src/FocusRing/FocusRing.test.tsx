import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FocusRing } from "./FocusRing";

describe("FocusRing", () => {
  it("makes its content keyboard-focusable via tabIndex", async () => {
    render(<FocusRing>custom control</FocusRing>);
    await userEvent.tab();
    expect(screen.getByText("custom control")).toHaveFocus();
  });

  it("applies the shared focus-ring class", () => {
    render(<FocusRing>x</FocusRing>);
    expect(screen.getByText("x")).toHaveClass("focus-ring");
  });
});
