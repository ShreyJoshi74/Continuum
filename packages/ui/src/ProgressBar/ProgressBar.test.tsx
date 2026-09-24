import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProgressBar } from "./ProgressBar";

describe("ProgressBar", () => {
  it("exposes its value through ARIA for assistive tech", () => {
    render(<ProgressBar value={24} max={120} label="Watch progress" />);
    const bar = screen.getByRole("progressbar", { name: "Watch progress" });
    expect(bar).toHaveAttribute("aria-valuenow", "24");
    expect(bar).toHaveAttribute("aria-valuemax", "120");
  });

  it("clamps the visual fill to 100% even if value exceeds max", () => {
    const { container } = render(<ProgressBar value={999} max={100} />);
    const fill = container.querySelector(".progress-bar__fill") as HTMLElement;
    expect(fill.style.width).toBe("100%");
  });

  it("clamps the visual fill to 0% even if value is negative", () => {
    const { container } = render(<ProgressBar value={-10} max={100} />);
    const fill = container.querySelector(".progress-bar__fill") as HTMLElement;
    expect(fill.style.width).toBe("0%");
  });
});
