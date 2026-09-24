import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Rail } from "./Rail";
import { Card } from "../Card/Card.js";

describe("Rail", () => {
  it("renders its title as the section's accessible name", () => {
    render(
      <Rail title="Trending Now">
        <Card title="A" imageUrl="/a.jpg" />
      </Rail>
    );
    expect(screen.getByRole("region", { name: "Trending Now" })).toBeInTheDocument();
  });

  it("mounts every child it's given (no windowing yet — that's M2)", () => {
    render(
      <Rail title="Trending Now">
        <Card title="A" imageUrl="/a.jpg" />
        <Card title="B" imageUrl="/b.jpg" />
        <Card title="C" imageUrl="/c.jpg" />
      </Rail>
    );
    expect(screen.getAllByRole("button")).toHaveLength(3);
  });
});
