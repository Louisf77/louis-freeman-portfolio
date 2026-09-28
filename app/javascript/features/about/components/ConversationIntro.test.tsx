import { screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { mockMatchMedia } from "@test/browser";
import { contractFixture } from "@test/contracts";
import { renderWithProviders } from "@test/utils";
import ConversationIntro from "~/features/about/components/ConversationIntro";
import { REDUCED_MOTION_MEDIA_QUERY } from "~/hooks/useReducedMotion";
import type { About, AboutResponse } from "~/types/contracts";

const UI = {
  about_chat_hint: "Keep scrolling to chat ↓",
  about_chat_label: "About me, in questions",
  about_portrait_alt: "Cartoon illustration of Louis waving, wearing a green polo shirt",
};

function aboutFixture(): About {
  return (contractFixture("api/v1/about/show") as AboutResponse).about;
}

function renderIntro(about = aboutFixture()) {
  return renderWithProviders(
    <ConversationIntro conversation={about.conversation} intro={about.intro} />,
    { ui: UI },
  );
}

function chatList() {
  return screen.getByRole("list", { name: "About me, in questions" });
}

describe("ConversationIntro", () => {
  it("opens the page with the heading, subline and waving portrait", () => {
    renderIntro();

    expect(
      screen.getByRole("heading", { level: 1, name: "Hello! I'm Louis Freeman." }),
    ).toBeInTheDocument();
    expect(screen.getByText("Senior Full Stack Engineer · London")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: UI.about_portrait_alt })).toBeInTheDocument();
  });

  it("offers the portrait as AVIF and WebP ahead of the PNG fallback", () => {
    renderIntro();

    const picture = screen.getByRole("img", { name: UI.about_portrait_alt }).closest("picture");
    const sourceTypes = Array.from(picture?.querySelectorAll("source") ?? []).map(
      (source) => source.type,
    );

    expect(sourceTypes).toEqual(["image/avif", "image/webp"]);
  });

  it("lists every question followed by its answer", () => {
    renderIntro();

    const bubbles = within(chatList())
      .getAllByRole("listitem")
      .map((bubble) => bubble.textContent);

    expect(bubbles).toHaveLength(6);
    expect(bubbles[0]).toBe("So, what do you do?");
    expect(bubbles[1]).toMatch(/^I'm a full-stack engineer/);
    expect(bubbles[4]).toBe("How did you get into software?");
  });

  it("marks each answer's highlight phrases", () => {
    renderIntro();

    const marks = Array.from(chatList().querySelectorAll("mark")).map((mark) => mark.textContent);

    expect(marks).toEqual([
      "full-stack engineer",
      "one of the first two engineers on the UK team",
      "end-to-end ownership of hard integrations",
      "line-manage three engineers",
      "lead AI engineering for the UK business",
      "Product Design & Manufacture Engineering",
    ]);
  });

  it("glides the chat with scroll and shows the scroll hint", async () => {
    renderIntro();

    expect(screen.getByText(UI.about_chat_hint)).toBeInTheDocument();
    await waitFor(() => {
      expect(chatList().style.transform).toMatch(/^translate3d/);
    });
  });

  describe("with reduced motion", () => {
    it("renders the whole conversation statically", async () => {
      mockMatchMedia([REDUCED_MOTION_MEDIA_QUERY]);
      renderIntro();

      await new Promise((resolve) => window.requestAnimationFrame(resolve));

      expect(screen.queryByText(UI.about_chat_hint)).not.toBeInTheDocument();
      expect(chatList()).not.toHaveAttribute("style");
      within(chatList())
        .getAllByRole("listitem")
        .forEach((bubble) => {
          expect(bubble).not.toHaveAttribute("style");
        });
    });
  });

  it("renders nothing in the chat when there is no conversation", () => {
    const about = aboutFixture();
    about.conversation = [];
    renderIntro(about);

    expect(screen.queryByRole("list", { name: "About me, in questions" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });
});
