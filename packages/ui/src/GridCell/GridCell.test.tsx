import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { GridCell } from "./GridCell";

describe("GridCell", () => {
  it("renders its children", () => {
    render(
      <GridCell>
        <p>a title</p>
      </GridCell>
    );
    expect(screen.getByText("a title")).toBeInTheDocument();
  });
});
