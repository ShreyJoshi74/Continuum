import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Card } from "./Card";

describe("Card", () => {
  it("renders its title and image", () => {
    const { container } = render(<Card title="The Matrix" imageUrl="/matrix.jpg" />);
    expect(screen.getByText("The Matrix")).toBeInTheDocument();
    // alt="" by default is intentional: the title already renders as visible
    // text right next to it, so the image is decorative to a screen reader
    // (role "presentation", not "img") and shouldn't be announced twice.
    expect(container.querySelector("img")).toHaveAttribute("src", "/matrix.jpg");
  });

  it("defaults to landscape orientation", () => {
    render(<Card title="The Matrix" imageUrl="/matrix.jpg" />);
    expect(screen.getByRole("button")).toHaveClass("card--landscape");
  });

  it("switches to portrait when asked", () => {
    render(<Card title="The Matrix" imageUrl="/matrix.jpg" orientation="portrait" />);
    expect(screen.getByRole("button")).toHaveClass("card--portrait");
  });

  it("renders at most two badges, even if given more (FR-03)", () => {
    render(<Card title="The Matrix" imageUrl="/matrix.jpg" badges={["4K", "HDR", "NEW"]} />);
    expect(screen.getByText("4K")).toBeInTheDocument();
    expect(screen.getByText("HDR")).toBeInTheDocument();
    expect(screen.queryByText("NEW")).not.toBeInTheDocument();
  });

  it("is a real button — clickable and reachable by keyboard, like every other focus target", async () => {
    const onClick = vi.fn();
    render(<Card title="The Matrix" imageUrl="/matrix.jpg" onClick={onClick} />);

    await userEvent.tab();
    expect(screen.getByRole("button")).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledOnce();
  });
});
