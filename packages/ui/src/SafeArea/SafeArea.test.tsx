import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SafeArea } from "./SafeArea";

describe("SafeArea", () => {
  it("renders its children inside the safe-area padding container", () => {
    render(
      <SafeArea>
        <p>page content</p>
      </SafeArea>
    );
    expect(screen.getByText("page content")).toBeInTheDocument();
  });
});
