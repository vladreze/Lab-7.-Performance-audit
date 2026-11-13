import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

vi.mock("../utils/rating", async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, averageRating: vi.fn(actual.averageRating) };
});

import App from "../App";
import { averageRating } from "../utils/rating";

describe("App", () => {
  it("при відкритті картки не перерендерює весь список", () => {
    render(<App />);
    const buttons = screen.getAllByText("Детальніше");
    averageRating.mockClear();

    fireEvent.click(buttons[0]);

    expect(averageRating.mock.calls.length).toBeLessThanOrEqual(10);
  }, 30000);
});
