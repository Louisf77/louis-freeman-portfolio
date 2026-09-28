import { screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { mockMatchMedia } from "@test/browser";
import { contractFixture } from "@test/contracts";
import { renderWithProviders } from "@test/utils";
import HobbiesSection from "~/features/about/components/HobbiesSection";
import { COMPACT_MEDIA_QUERY } from "~/hooks/useMediaQuery";
import type { AboutResponse, HobbiesSection as HobbiesContent } from "~/types/contracts";

const UI = {
  hobbies_earlier_label: "Earlier",
  hobbies_heading: "When I'm not coding…",
  hobbies_image_alt: "Cartoon of Louis — %{hobby}",
  hobbies_list_label: "Hobbies",
  hobbies_list_label_swipe: "Hobbies — swipe for more",
};

function hobbiesFixture(): HobbiesContent {
  return (contractFixture("api/v1/about/show") as AboutResponse).about.hobbies;
}

function renderHobbies(hobbies: HobbiesContent = hobbiesFixture()) {
  return renderWithProviders(<HobbiesSection hobbies={hobbies} />, { ui: UI });
}

function hobbyCard(name: string): HTMLElement {
  const card = screen.getByText(name).closest("li");
  if (!card) throw new Error(`Expected a card for ${name}`);

  return card;
}

function hobbyWell(name: string): HTMLElement {
  const well = within(hobbyCard(name)).getByRole("img").parentElement;
  if (!well) throw new Error(`Expected an image well for ${name}`);

  return well;
}

describe("HobbiesSection", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("gives every hobby image its intrinsic size", () => {
    renderHobbies();

    const unsized = screen
      .getAllByRole("img")
      .filter((image) => !image.getAttribute("width") || !image.getAttribute("height"));

    expect(unsized).toEqual([]);
  });

  it("sizes an image it has no measurements for by its fit", () => {
    const [first, ...rest] = hobbiesFixture().items;
    if (!first) throw new Error("Expected a hobby in the fixture");
    renderHobbies({
      ...hobbiesFixture(),
      items: [{ ...first, image_path: "/images/hobbies/new-hobby.png", photo: false }, ...rest],
    });

    expect(within(hobbyCard(first.name)).getByRole("img")).toHaveAttribute("height", "560");
  });

  it("renders the section heading as a labelled region", () => {
    renderHobbies();

    expect(screen.getByRole("region", { name: UI.hobbies_heading })).toHaveAttribute("id", "out");
  });

  it("renders a card per hobby in position order with its label and image", () => {
    const hobbies = hobbiesFixture();
    renderHobbies(hobbies);

    const list = screen.getByRole("group", { name: UI.hobbies_list_label });
    const names = within(list)
      .getAllByRole("img")
      .map((image) => image.getAttribute("alt"));
    expect(names).toEqual(
      hobbies.items.map((hobby) => `Cartoon of Louis — ${hobby.name.toLowerCase()}`),
    );
    expect(within(hobbyCard("Rugby")).getByRole("img")).toHaveAttribute(
      "src",
      "/images/hobbies/rugby.png",
    );
  });

  it("lazy-loads every hobby image", () => {
    renderHobbies();

    screen.getAllByRole("img").forEach((image) => {
      expect(image).toHaveAttribute("loading", "lazy");
    });
  });

  it("rotates the well tints sage, sand, paper-3 by index", () => {
    const hobbies = hobbiesFixture();
    renderHobbies(hobbies);

    expect(hobbies.items.map((hobby) => hobbyWell(hobby.name).dataset.tint)).toEqual([
      "sage",
      "sand",
      "paper-3",
      "sage",
      "sand",
      "paper-3",
      "sage",
    ]);
  });

  it("covers the well with photos and bottom-aligns cut-outs", () => {
    renderHobbies();

    expect(hobbyWell("Football")).toHaveAttribute("data-fit", "cover");
    expect(hobbyWell("Rugby")).toHaveAttribute("data-fit", "contain");
  });

  it("lists the earlier roles on the ink Earlier card", () => {
    const hobbies = hobbiesFixture();
    renderHobbies(hobbies);

    const earlierCard = hobbyCard(UI.hobbies_earlier_label);
    expect(
      hobbies.earlier_roles.map((role) => within(earlierCard).getByText(role.text)),
    ).toHaveLength(hobbies.earlier_roles.length);
  });

  it("leaves out the Earlier card when there are no earlier roles", () => {
    renderHobbies({ ...hobbiesFixture(), earlier_roles: [] });

    expect(screen.queryByText(UI.hobbies_earlier_label)).not.toBeInTheDocument();
  });

  it("renders nothing without hobbies or earlier roles", () => {
    const { container } = renderHobbies({ earlier_roles: [], items: [] });

    expect(container).toBeEmptyDOMElement();
  });

  describe("on mobile", () => {
    it("makes the swipe row focusable so it can be scrolled by keyboard", () => {
      mockMatchMedia([COMPACT_MEDIA_QUERY]);
      renderHobbies();

      expect(screen.getByRole("group", { name: UI.hobbies_list_label_swipe })).toHaveAttribute(
        "tabindex",
        "0",
      );
    });
  });
});
