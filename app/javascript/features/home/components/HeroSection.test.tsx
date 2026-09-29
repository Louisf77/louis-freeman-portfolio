import { fireEvent, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";

import { mockMatchMedia } from "@test/browser";
import { contractFixture } from "@test/contracts";
import { renderWithProviders } from "@test/utils";
import HeroSection from "~/features/home/components/HeroSection";
import { REDUCED_MOTION_MEDIA_QUERY } from "~/hooks/useReducedMotion";
import type { HomeResponse } from "~/types/contracts";

const UI = {
  hero_greeting_sentence: "%{greeting}: %{roles}.",
  hero_poster_alt: "Illustration of Louis coding at a laptop at a round wooden table",
  hero_scroll_cue: "Scroll",
  hero_video_label: "Animated illustration of Louis coding at a laptop",
};

function heroFixture() {
  return (contractFixture("api/v1/home/show") as HomeResponse).home.hero;
}

function renderHero() {
  return renderWithProviders(<HeroSection hero={heroFixture()} />, { ui: UI });
}

describe("HeroSection", () => {
  let play: Mock<() => Promise<void>>;

  beforeEach(() => {
    play = vi.fn<() => Promise<void>>(() => Promise.resolve());
    vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(play);
    vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => undefined);
  });

  it("labels the section with the greeting heading", () => {
    renderHero();

    expect(
      screen.getByRole("region", {
        name: "Hi, I'm Louis: a senior software engineer, a problem solver and a team lead.",
      }),
    ).toHaveAttribute("id", "hero");
  });

  it("shows the tagline and a scroll cue to the experience section", () => {
    renderHero();

    expect(screen.getByText("Senior Full Stack Software Engineer")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Scroll" })).toHaveAttribute("href", "#experience");
  });

  it("plays the muted, looping video with its poster", () => {
    renderHero();
    const video = screen.getByLabelText(UI.hero_video_label);

    expect(video).toBeInstanceOf(HTMLVideoElement);
    expect((video as HTMLVideoElement).muted).toBe(true);
    expect(video).toHaveAttribute("loop");
    expect(video).toHaveAttribute("playsinline");
    expect(video).toHaveAttribute("poster");
    expect(play).toHaveBeenCalled();
  });

  it("retries playback once the video can play", () => {
    renderHero();
    play.mockClear();

    fireEvent(screen.getByLabelText(UI.hero_video_label), new Event("canplay"));

    expect(play).toHaveBeenCalledTimes(1);
  });

  it("keeps showing the poster when autoplay is refused", () => {
    play.mockImplementation(() => Promise.reject(new DOMException("blocked", "NotAllowedError")));
    renderHero();

    expect(screen.getByLabelText(UI.hero_video_label)).toHaveAttribute("poster");
  });

  it("shows the poster still instead of the video under reduced motion", () => {
    mockMatchMedia([REDUCED_MOTION_MEDIA_QUERY]);
    renderHero();

    expect(screen.getByRole("img", { name: UI.hero_poster_alt })).toBeInTheDocument();
    expect(screen.queryByLabelText(UI.hero_video_label)).not.toBeInTheDocument();
    expect(play).not.toHaveBeenCalled();
  });
});
