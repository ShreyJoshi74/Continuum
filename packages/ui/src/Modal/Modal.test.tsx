import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from "./Modal";

describe("Modal", () => {
  it("renders nothing when closed", () => {
    render(
      <Modal open={false} onClose={vi.fn()} title="Details">
        content
      </Modal>
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders its title and content when open", () => {
    render(
      <Modal open onClose={vi.fn()} title="Details">
        content
      </Modal>
    );
    expect(screen.getByRole("dialog", { name: "Details" })).toBeInTheDocument();
    expect(screen.getByText("content")).toBeInTheDocument();
  });

  it("moves focus to the first focusable element on open", () => {
    render(
      <Modal open onClose={vi.fn()} title="Details">
        <button>Confirm</button>
      </Modal>
    );
    expect(screen.getByRole("button", { name: "Confirm" })).toHaveFocus();
  });

  it("falls back to focusing the dialog itself when there's nothing focusable inside", () => {
    render(
      <Modal open onClose={vi.fn()} title="Details">
        <p>no controls here</p>
      </Modal>
    );
    expect(screen.getByRole("dialog")).toHaveFocus();
  });

  it("calls onClose when Escape is pressed", async () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="Details">
        content
      </Modal>
    );
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("wraps Tab from the last focusable back to the first", async () => {
    render(
      <Modal open onClose={vi.fn()} title="Details">
        <button>First</button>
        <button>Last</button>
      </Modal>
    );
    screen.getByRole("button", { name: "Last" }).focus();
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "First" })).toHaveFocus();
  });

  it("wraps Shift+Tab from the first focusable back to the last", async () => {
    render(
      <Modal open onClose={vi.fn()} title="Details">
        <button>First</button>
        <button>Last</button>
      </Modal>
    );
    expect(screen.getByRole("button", { name: "First" })).toHaveFocus();
    await userEvent.tab({ shift: true });
    expect(screen.getByRole("button", { name: "Last" })).toHaveFocus();
  });

  it("restores focus to the invoking element after closing (FR-14)", async () => {
    function Harness() {
      const [open, setOpen] = useState(false);
      return (
        <div>
          <button onClick={() => setOpen(true)}>Open</button>
          <Modal open={open} onClose={() => setOpen(false)} title="Details">
            <button>Confirm</button>
          </Modal>
        </div>
      );
    }

    render(<Harness />);
    const openButton = screen.getByRole("button", { name: "Open" });
    await userEvent.click(openButton);
    expect(screen.getByRole("button", { name: "Confirm" })).toHaveFocus();

    await userEvent.keyboard("{Escape}");
    expect(openButton).toHaveFocus();
  });
});
