import { act, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { mockMatchMedia } from "@test/browser";
import { renderWithProviders } from "@test/utils";
import TypedGreeting from "~/features/home/components/TypedGreeting";
import { REDUCED_MOTION_MEDIA_QUERY } from "~/hooks/useReducedMotion";

const PREFIX = "Hi, I'm ";
const ENDINGS = ["Louis.", "a team lead."];
const UI = { hero_greeting_sentence: "%{greeting}: %{roles}." };
const START_DELAY_MS = 700;
const FASTEST_TYPE_DELAY_MS = 60;
const HOLD_MS = 2400;
const DELETE_DELAY_MS = 34;
const NEXT_ENDING_PAUSE_MS = 320;

function advance(milliseconds: number) {
  act(() => {
    vi.advanceTimersByTime(milliseconds);
  });
}

function typedText() {
  return screen.getByTestId("typed-greeting").textContent;
}

function caretState() {
  return screen.getByTestId("typed-greeting-caret").dataset.state;
}

function typeCharacters(count: number) {
  for (let index = 0; index < count; index += 1) advance(FASTEST_TYPE_DELAY_MS);
}

function deleteCharacters(count: number) {
  for (let index = 0; index < count; index += 1) advance(DELETE_DELAY_MS);
}

function renderGreeting(endings: string[] = ENDINGS) {
  return renderWithProviders(
    <TypedGreeting endings={endings} headingId="hero-title" prefix={PREFIX} />,
    { ui: UI },
  );
}

function typeFirstGreeting() {
  advance(START_DELAY_MS);
  typeCharacters(`${PREFIX}${ENDINGS[0] ?? ""}`.length - 1);
}

describe("TypedGreeting", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(Math, "random").mockReturnValue(0);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("names the heading with a sentence built from every greeting", () => {
    renderGreeting(["Louis.", "a senior software engineer.", "a problem solver.", "a team lead."]);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Hi, I'm Louis: a senior software engineer, a problem solver and a team lead.",
      }),
    ).toBeInTheDocument();
  });

  it("names the heading with the lone greeting when there is only one", () => {
    renderGreeting(["Louis."]);

    expect(screen.getByRole("heading", { level: 1, name: "Hi, I'm Louis." })).toBeInTheDocument();
  });

  it("reserves space for every greeting with hidden sizers", () => {
    renderGreeting();

    expect(screen.getAllByTestId("greeting-sizer").map((sizer) => sizer.textContent)).toEqual(
      ENDINGS.map((ending) => `${PREFIX}${ending}`),
    );
    screen.getAllByTestId("greeting-sizer").forEach((sizer) => {
      expect(sizer).toHaveAttribute("aria-hidden", "true");
    });
  });

  it("starts empty and types the greeting one character at a time", () => {
    renderGreeting();
    expect(typedText()).toBe("");

    advance(START_DELAY_MS);
    expect(typedText()).toBe("H");
    expect(caretState()).toBe("typing");

    typeCharacters(3);
    expect(typedText()).toBe("Hi, ");
  });

  it("holds the finished greeting with a blinking caret", () => {
    renderGreeting();
    typeFirstGreeting();

    expect(typedText()).toBe("Hi, I'm Louis.");
    expect(caretState()).toBe("holding");

    advance(HOLD_MS - 1);
    expect(typedText()).toBe("Hi, I'm Louis.");
  });

  it("deletes the ending back to the prefix, then types the next ending", () => {
    renderGreeting();
    typeFirstGreeting();
    advance(HOLD_MS);

    expect(typedText()).toBe("Hi, I'm Louis");
    expect(caretState()).toBe("typing");

    deleteCharacters((ENDINGS[0] ?? "").length - 1);
    expect(typedText()).toBe(PREFIX);

    advance(NEXT_ENDING_PAUSE_MS);
    expect(typedText()).toBe("Hi, I'm a");
  });

  it("cycles back to the first ending after the last one", () => {
    renderGreeting();
    typeFirstGreeting();
    advance(HOLD_MS);
    deleteCharacters((ENDINGS[0] ?? "").length - 1);
    advance(NEXT_ENDING_PAUSE_MS);
    typeCharacters((ENDINGS[1] ?? "").length - 1);
    expect(typedText()).toBe("Hi, I'm a team lead.");

    advance(HOLD_MS);
    deleteCharacters((ENDINGS[1] ?? "").length - 1);
    advance(NEXT_ENDING_PAUSE_MS);
    expect(typedText()).toBe("Hi, I'm L");
  });

  it("types no slower than 140ms per character", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.999);
    renderGreeting();
    advance(START_DELAY_MS);

    advance(139);
    expect(typedText()).toBe("H");

    advance(1);
    expect(typedText()).toBe("Hi");
  });

  it("shows the full first greeting statically under reduced motion", () => {
    mockMatchMedia([REDUCED_MOTION_MEDIA_QUERY]);
    renderGreeting();

    expect(typedText()).toBe("Hi, I'm Louis.");
    expect(caretState()).toBe("holding");

    advance(HOLD_MS * 4);
    expect(typedText()).toBe("Hi, I'm Louis.");
  });

  it("shows the prefix statically when there are no endings", () => {
    renderGreeting([]);
    advance(START_DELAY_MS * 2);

    expect(typedText()).toBe(PREFIX);
  });
});
