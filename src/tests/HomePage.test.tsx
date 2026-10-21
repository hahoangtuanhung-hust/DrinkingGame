import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import HomePage from "../app/routes/HomePage";

describe("HomePage", () => {
  it("offers accessible routes to both games", () => {
    render(<MemoryRouter><HomePage /></MemoryRouter>);
    expect(screen.getByRole("link", { name: /shake the dice/i })).toHaveAttribute("href", "/dice");
    expect(screen.getByRole("link", { name: /deal me in/i })).toHaveAttribute("href", "/cards");
  });
});
