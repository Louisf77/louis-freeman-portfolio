import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import HighlightedText from "~/components/HighlightMark/HighlightedText";

function renderText(text: string, highlights: string[]) {
  const { container } = render(
    <p>
      <HighlightedText highlights={highlights} text={text} />
    </p>,
  );
  const paragraph = container.querySelector("p");
  if (!paragraph) throw new Error("HighlightedText did not render inside the paragraph");

  return paragraph;
}

function markedPhrases(element: Element): (string | null)[] {
  return Array.from(element.querySelectorAll("mark")).map((mark) => mark.textContent);
}

describe("HighlightedText", () => {
  it("wraps a single phrase in a mark and keeps the surrounding text", () => {
    const paragraph = renderText("I'm a full-stack engineer in London.", ["full-stack engineer"]);

    expect(markedPhrases(paragraph)).toEqual(["full-stack engineer"]);
    expect(paragraph).toHaveTextContent("I'm a full-stack engineer in London.");
  });

  it("wraps every occurrence of every phrase in reading order", () => {
    const paragraph = renderText("Rails by day, React by night, Rails again.", ["Rails", "React"]);

    expect(markedPhrases(paragraph)).toEqual(["Rails", "React", "Rails"]);
  });

  it("never nests or overlaps marks when phrases overlap", () => {
    const paragraph = renderText("a full-stack engineer", [
      "stack engineer",
      "full-stack engineer",
    ]);

    expect(markedPhrases(paragraph)).toEqual(["full-stack engineer"]);
    expect(paragraph.querySelector("mark mark")).toBeNull();
    expect(paragraph).toHaveTextContent("a full-stack engineer");
  });

  it("leaves the text untouched when no phrase matches", () => {
    const paragraph = renderText("Before software I studied design.", ["engineering", ""]);

    expect(markedPhrases(paragraph)).toEqual([]);
    expect(paragraph).toHaveTextContent("Before software I studied design.");
  });

  it("matches case-sensitively", () => {
    const paragraph = renderText("Lead AI engineering, lead ai engineering.", ["Lead AI"]);

    expect(markedPhrases(paragraph)).toEqual(["Lead AI"]);
  });

  it("renders markup in the text as plain text", () => {
    const paragraph = renderText("Say <b>hello</b> & <script>x</script>", ["<b>hello</b>"]);

    expect(paragraph.querySelector("b, script")).toBeNull();
    expect(markedPhrases(paragraph)).toEqual(["<b>hello</b>"]);
  });
});
