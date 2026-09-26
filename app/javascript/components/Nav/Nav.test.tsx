import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { mockMatchMedia } from "@test/browser";
import { renderWithProviders } from "@test/utils";
import Nav from "~/components/Nav/Nav";
import { COMPACT_MEDIA_QUERY } from "~/hooks/useMediaQuery";
import type { Profile } from "~/types/contracts";

const PROFILE: Profile = {
  email: "hello@louisfreeman.co.uk",
  footer_blurb: "Based in London.",
  github_url: "https://github.com/Louisf77",
  linkedin_url: "https://www.linkedin.com/in/louis-freeman7/",
  location: "London",
  name: "Louis Freeman",
  role: "Senior Full Stack Engineer",
};

const UI = {
  contact: "Contact",
  contact_email: "Email",
  contact_github: "GitHub",
  contact_linkedin: "LinkedIn",
  nav_about: "About",
  nav_home: "Louis Freeman, home",
  nav_label: "Primary",
  nav_work: "Work",
  opens_in_new_tab: "(opens in a new tab)",
};

function renderNav({ path = "/", profile = PROFILE }: { path?: string; profile?: Profile } = {}) {
  return renderWithProviders(<Nav profile={profile} />, { initialEntries: [path], ui: UI });
}

function contactLinks() {
  return screen.getByTestId("contact-links");
}

describe("Nav", () => {
  it("marks the current page link", () => {
    renderNav({ path: "/work" });

    expect(screen.getByRole("link", { name: "Work" })).toHaveAttribute("aria-current", "page");
  });

  it("leaves the other page links unmarked", () => {
    renderNav({ path: "/work" });

    expect(screen.getByRole("link", { name: "About" })).not.toHaveAttribute("aria-current");
  });

  it("hides the Contact button when the profile is unavailable", () => {
    renderWithProviders(<Nav profile={undefined} />, { ui: UI });

    expect(screen.queryByRole("button", { name: "Contact" })).not.toBeInTheDocument();
  });

  describe("on desktop", () => {
    it("starts with the contact links collapsed", () => {
      renderNav();

      expect(screen.getByRole("button", { name: "Contact" })).toHaveAttribute(
        "aria-expanded",
        "false",
      );
    });

    it("keeps collapsed contact links out of the tab order", () => {
      renderNav();

      expect(contactLinks()).toHaveAttribute("inert");
    });

    it("slides the contact links out inline", () => {
      renderNav();

      expect(contactLinks()).toHaveAttribute("data-variant", "slide-out");
    });

    it("expands the contact links when Contact is clicked", async () => {
      const user = userEvent.setup();
      renderNav();

      await user.click(screen.getByRole("button", { name: "Contact" }));

      expect(contactLinks()).not.toHaveAttribute("inert");
    });

    it("reports the expanded state on the Contact button", async () => {
      const user = userEvent.setup();
      renderNav();

      await user.click(screen.getByRole("button", { name: "Contact" }));

      expect(screen.getByRole("button", { name: "Contact" })).toHaveAttribute(
        "aria-expanded",
        "true",
      );
    });

    it("opens from the keyboard", async () => {
      const user = userEvent.setup();
      renderNav();

      screen.getByRole("button", { name: "Contact" }).focus();
      await user.keyboard("{Enter}");

      expect(contactLinks()).not.toHaveAttribute("inert");
    });

    it("links to the email address", async () => {
      const user = userEvent.setup();
      renderNav();

      await user.click(screen.getByRole("button", { name: "Contact" }));

      expect(screen.getByRole("link", { name: "Email" })).toHaveAttribute(
        "href",
        "mailto:hello@louisfreeman.co.uk",
      );
    });

    it("opens LinkedIn in a new tab without an opener", async () => {
      const user = userEvent.setup();
      renderNav();

      await user.click(screen.getByRole("button", { name: "Contact" }));

      expect(screen.getByRole("link", { name: /LinkedIn/ })).toHaveAttribute(
        "rel",
        expect.stringContaining("noopener"),
      );
    });

    it("collapses on Escape", async () => {
      const user = userEvent.setup();
      renderNav();

      await user.click(screen.getByRole("button", { name: "Contact" }));
      await user.keyboard("{Escape}");

      expect(contactLinks()).toHaveAttribute("inert");
    });

    it("returns focus to Contact after Escape", async () => {
      const user = userEvent.setup();
      renderNav();

      await user.click(screen.getByRole("button", { name: "Contact" }));
      await user.tab();
      await user.keyboard("{Escape}");

      expect(screen.getByRole("button", { name: "Contact" })).toHaveFocus();
    });

    it("collapses when Contact is clicked again", async () => {
      const user = userEvent.setup();
      renderNav();

      await user.click(screen.getByRole("button", { name: "Contact" }));
      await user.click(screen.getByRole("button", { name: "Contact" }));

      expect(contactLinks()).toHaveAttribute("inert");
    });
  });

  describe("on mobile", () => {
    beforeEach(() => {
      mockMatchMedia([COMPACT_MEDIA_QUERY]);
    });

    it("shows the contact links as a dropdown", () => {
      renderNav();

      expect(contactLinks()).toHaveAttribute("data-variant", "dropdown");
    });

    it("opens the dropdown when Contact is tapped", async () => {
      const user = userEvent.setup();
      renderNav();

      await user.click(screen.getByRole("button", { name: "Contact" }));

      expect(contactLinks()).not.toHaveAttribute("inert");
    });

    it("closes the dropdown on a tap outside it", async () => {
      const user = userEvent.setup();
      renderNav();

      await user.click(screen.getByRole("button", { name: "Contact" }));
      await user.click(document.body);

      expect(contactLinks()).toHaveAttribute("inert");
    });

    it("keeps the dropdown open on a tap inside it", async () => {
      const user = userEvent.setup();
      renderNav();

      await user.click(screen.getByRole("button", { name: "Contact" }));
      await user.click(contactLinks());

      expect(contactLinks()).not.toHaveAttribute("inert");
    });

    it("closes the dropdown on Escape", async () => {
      const user = userEvent.setup();
      renderNav();

      await user.click(screen.getByRole("button", { name: "Contact" }));
      await user.keyboard("{Escape}");

      expect(screen.getByRole("button", { name: "Contact" })).toHaveAttribute(
        "aria-expanded",
        "false",
      );
    });
  });
});
