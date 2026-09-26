import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { mockMatchMedia } from "@test/browser";
import { renderWithProviders } from "@test/utils";
import Footer from "~/components/Footer/Footer";
import { COMPACT_MEDIA_QUERY } from "~/hooks/useMediaQuery";
import type { Profile } from "~/types/contracts";

const PROFILE: Profile = {
  email: "hello@louisfreeman.co.uk",
  footer_blurb: "Based in London. Happy to talk about AI tooling.",
  github_url: "https://github.com/Louisf77",
  linkedin_url: "https://www.linkedin.com/in/louis-freeman7/",
  location: "London",
  name: "Louis Freeman",
  role: "Senior Full Stack Engineer",
};

const UI = {
  back_to_top: "Back to top ↑",
  back_to_top_short: "Top ↑",
  close: "Close",
  contact_github: "GitHub",
  contact_linkedin: "LinkedIn",
  copyright: "© %{year} %{name}",
  footer_heading_accent: "connect.",
  footer_heading_lead: "Let's ",
  opens_in_new_tab: "(opens in a new tab)",
  privacy_body: "This site counts visits with Umami.",
  privacy_link: "Privacy",
  privacy_policy_link: "Read Umami's privacy policy",
  privacy_title: "Privacy",
};

function renderFooter({ profile }: { profile: Profile | undefined } = { profile: PROFILE }) {
  return renderWithProviders(<Footer profile={profile} />, { ui: UI });
}

describe("Footer", () => {
  it("invites visitors to connect", () => {
    renderFooter();

    expect(screen.getByRole("heading", { level: 2, name: "Let's connect." })).toBeInTheDocument();
  });

  it("links to the email address", () => {
    renderFooter();

    expect(screen.getByRole("link", { name: "hello@louisfreeman.co.uk" })).toHaveAttribute(
      "href",
      "mailto:hello@louisfreeman.co.uk",
    );
  });

  it("opens GitHub in a new tab", () => {
    renderFooter();

    expect(screen.getByRole("link", { name: /GitHub/ })).toHaveAttribute("target", "_blank");
  });

  it("shows the profile blurb", () => {
    renderFooter();

    expect(screen.getByText(PROFILE.footer_blurb)).toBeInTheDocument();
  });

  it("shows the copyright for the current year", () => {
    renderFooter();

    expect(
      screen.getByText(`© ${String(new Date().getFullYear())} Louis Freeman`),
    ).toBeInTheDocument();
  });

  it("still renders without a profile", () => {
    renderFooter({ profile: undefined });

    expect(screen.getByRole("link", { name: "Back to top ↑" })).toBeInTheDocument();
  });

  it("omits contact links without a profile", () => {
    renderFooter({ profile: undefined });

    expect(screen.queryByRole("link", { name: /GitHub/ })).not.toBeInTheDocument();
  });

  it("shortens Back to top on mobile", () => {
    mockMatchMedia([COMPACT_MEDIA_QUERY]);
    renderFooter();

    expect(screen.getByRole("link", { name: "Top ↑" })).toBeInTheDocument();
  });

  describe("privacy note", () => {
    it("opens from the Privacy link", async () => {
      const user = userEvent.setup();
      renderFooter();

      await user.click(screen.getByRole("button", { name: "Privacy" }));

      expect(screen.getByRole("dialog", { name: "Privacy" })).toHaveTextContent(
        "This site counts visits with Umami.",
      );
    });

    it("links to Umami's privacy policy", async () => {
      const user = userEvent.setup();
      renderFooter();

      await user.click(screen.getByRole("button", { name: "Privacy" }));

      expect(
        within(screen.getByRole("dialog")).getByRole("link", { name: /Umami's privacy policy/ }),
      ).toHaveAttribute("href", "https://umami.is/privacy");
    });

    it("closes with the Close button", async () => {
      const user = userEvent.setup();
      renderFooter();

      await user.click(screen.getByRole("button", { name: "Privacy" }));
      await user.click(screen.getByRole("button", { name: "Close" }));

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
