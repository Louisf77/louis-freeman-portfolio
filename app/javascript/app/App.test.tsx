import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { mockUmami } from "@test/analytics";
import { mockFetchJson, mockScrollTo } from "@test/browser";
import { contractFixture } from "@test/contracts";
import App from "~/app/App";
import type {
  AboutResponse,
  HomeResponse,
  PageBootstrap,
  ProfileResponse,
  WorkResponse,
} from "~/types/contracts";

const PROFILE = contractFixture("api/v1/profile/show") as ProfileResponse;
const HOME = contractFixture("api/v1/home/show") as HomeResponse;
const WORK = contractFixture("api/v1/work/show") as WorkResponse;
const ABOUT = contractFixture("api/v1/about/show") as AboutResponse;

const UI = {
  contact: "Contact",
  nav_about: "About",
  nav_home: "Louis Freeman, home",
  hero_greeting_sentence: "%{greeting}: %{roles}.",
  nav_work: "Work",
  page_load_error: "Couldn't load this page.",
  page_title_about: "About — Louis Freeman",
  page_title_home: "Louis Freeman — Senior Full Stack Software Engineer, London",
  page_title_work: "Work — Louis Freeman",
  retry: "Retry",
  work_heading: "Work",
};

function installBootstrap(bootstrap: PageBootstrap) {
  const script = document.createElement("script");
  script.id = "bootstrap";
  script.type = "application/json";
  script.textContent = JSON.stringify(bootstrap);
  document.body.append(script);
}

function renderHomeFromBootstrap() {
  installBootstrap({ queries: { home: HOME, profile: PROFILE }, ui: UI });
  window.history.pushState({}, "", "/");

  return render(<App />);
}

function notFoundResponse() {
  return new Response(
    JSON.stringify({
      errors: [{ code: "not_found", field: null, message: "Work header has not been seeded" }],
    }),
    { headers: { "Content-Type": "application/json" }, status: 404 },
  );
}

describe("App", () => {
  afterEach(() => {
    document.getElementById("bootstrap")?.remove();
  });

  describe("on first load", () => {
    it("renders the page from the embedded bootstrap", () => {
      mockFetchJson({});
      renderHomeFromBootstrap();

      expect(
        screen.getByRole("heading", { level: 1, name: /^Hi, I'm Louis:/ }),
      ).toBeInTheDocument();
    });

    it("does not fetch data the bootstrap already holds", () => {
      const fetchSpy = mockFetchJson({});
      renderHomeFromBootstrap();

      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it("renders the contact menu from the embedded profile", () => {
      mockFetchJson({});
      renderHomeFromBootstrap();

      expect(screen.getByRole("button", { name: "Contact" })).toBeInTheDocument();
    });
  });

  describe("while work is unpublished", () => {
    const UNPUBLISHED_PROFILE: ProfileResponse = {
      profile: { ...PROFILE.profile, work_published: false },
    };

    function renderWorkFromBootstrap() {
      installBootstrap({ queries: { home: HOME, profile: UNPUBLISHED_PROFILE }, ui: UI });
      window.history.pushState({}, "", "/work");

      return render(<App />);
    }

    it("hides the Work link", () => {
      mockFetchJson({});
      installBootstrap({ queries: { home: HOME, profile: UNPUBLISHED_PROFILE }, ui: UI });
      window.history.pushState({}, "", "/");
      render(<App />);

      expect(screen.queryByRole("link", { name: "Work" })).not.toBeInTheDocument();
    });

    it("does not render the Work page at /work", () => {
      mockFetchJson({ "/api/v1/work": WORK });
      renderWorkFromBootstrap();

      expect(screen.queryByRole("heading", { level: 1, name: "Work" })).not.toBeInTheDocument();
    });

    it("never fetches the work", () => {
      const fetchSpy = mockFetchJson({ "/api/v1/work": WORK });
      renderWorkFromBootstrap();

      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it("never tracks a case study view", () => {
      const umami = mockUmami();
      mockFetchJson({ "/api/v1/work": WORK });
      renderWorkFromBootstrap();

      expect(umami.track).not.toHaveBeenCalledWith("case_study_view", expect.anything());
    });
  });

  describe("on client navigation", () => {
    it("fetches and renders the next page", async () => {
      const user = userEvent.setup();
      mockFetchJson({ "/api/v1/work": WORK });
      renderHomeFromBootstrap();

      await user.click(screen.getByRole("link", { name: "Work" }));

      expect(await screen.findByRole("heading", { level: 1, name: "Work" })).toBeInTheDocument();
    });

    it("keeps the nav mounted", async () => {
      const user = userEvent.setup();
      mockFetchJson({ "/api/v1/work": WORK });
      renderHomeFromBootstrap();
      const navBefore = screen.getByRole("navigation");

      await user.click(screen.getByRole("link", { name: "Work" }));
      await screen.findByRole("heading", { level: 1, name: "Work" });

      expect(screen.getByRole("navigation")).toBe(navBefore);
    });

    it("replays the page-enter transition for the new page", async () => {
      const user = userEvent.setup();
      mockFetchJson({ "/api/v1/work": WORK });
      renderHomeFromBootstrap();
      const pageEnterBefore = screen.getByTestId("page-enter");

      await user.click(screen.getByRole("link", { name: "Work" }));

      expect(screen.getByTestId("page-enter")).not.toBe(pageEnterBefore);
    });

    describe("with the document title", () => {
      it("names the first page", () => {
        mockFetchJson({});
        renderHomeFromBootstrap();

        expect(document.title).toBe(UI.page_title_home);
      });

      it("names the Work page after navigating to it", async () => {
        const user = userEvent.setup();
        mockFetchJson({ "/api/v1/work": WORK });
        renderHomeFromBootstrap();

        await user.click(screen.getByRole("link", { name: "Work" }));

        expect(document.title).toBe(UI.page_title_work);
      });

      it("names the About page after navigating to it", async () => {
        const user = userEvent.setup();
        mockFetchJson({ "/api/v1/about": ABOUT });
        renderHomeFromBootstrap();

        await user.click(screen.getByRole("link", { name: "About" }));

        expect(document.title).toBe(UI.page_title_about);
      });

      it("names the Home page after navigating back to it", async () => {
        const user = userEvent.setup();
        mockFetchJson({ "/api/v1/work": WORK });
        renderHomeFromBootstrap();

        await user.click(screen.getByRole("link", { name: "Work" }));
        await user.click(screen.getByRole("link", { name: UI.nav_home }));

        expect(document.title).toBe(UI.page_title_home);
      });
    });

    it("scrolls back to the top", async () => {
      const user = userEvent.setup();
      mockFetchJson({ "/api/v1/work": WORK });
      renderHomeFromBootstrap();
      const scrollTo = mockScrollTo();

      await user.click(screen.getByRole("link", { name: "Work" }));

      expect(scrollTo).toHaveBeenCalledWith({ behavior: "instant", left: 0, top: 0 });
    });

    describe("when the page fails to load", () => {
      it("shows the inline error panel with the API's message", async () => {
        const user = userEvent.setup();
        vi.spyOn(window, "fetch").mockResolvedValue(notFoundResponse());
        renderHomeFromBootstrap();

        await user.click(screen.getByRole("link", { name: "Work" }));

        expect(await screen.findByRole("alert")).toHaveTextContent(
          "Couldn't load this page.Work header has not been seeded",
        );
      });

      it("keeps the nav and footer on screen", async () => {
        const user = userEvent.setup();
        vi.spyOn(window, "fetch").mockResolvedValue(notFoundResponse());
        renderHomeFromBootstrap();

        await user.click(screen.getByRole("link", { name: "Work" }));
        await screen.findByRole("alert");

        expect(screen.getByRole("contentinfo")).toBeInTheDocument();
      });

      it("loads the page when Retry succeeds", async () => {
        const user = userEvent.setup();
        vi.spyOn(window, "fetch")
          .mockResolvedValueOnce(notFoundResponse())
          .mockResolvedValueOnce(
            new Response(JSON.stringify(WORK), { headers: { "Content-Type": "application/json" } }),
          );
        renderHomeFromBootstrap();

        await user.click(screen.getByRole("link", { name: "Work" }));
        await user.click(await screen.findByRole("button", { name: "Retry" }));

        expect(await screen.findByRole("heading", { level: 1, name: "Work" })).toBeInTheDocument();
      });
    });
  });
});
