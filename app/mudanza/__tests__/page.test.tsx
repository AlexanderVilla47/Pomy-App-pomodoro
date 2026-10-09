import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import MudanzaPage from "../page";

describe("MudanzaPage", () => {
  it("avisa la mudanza y lleva al dominio nuevo", () => {
    render(<MudanzaPage />);

    expect(screen.getByRole("heading", { name: /nos mudamos/i })).toBeTruthy();
    expect(
      screen.getByRole("link", { name: /ir a la nueva direcci/i }),
    ).toHaveProperty("href", "https://pomodoro.alexandervilla.dev/");
  });
});
