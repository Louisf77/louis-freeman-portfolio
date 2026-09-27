import { Fragment } from "react";

import HighlightMark from "~/components/HighlightMark/HighlightMark";

interface HighlightedTextProps {
  highlights: string[];
  text: string;
}

interface TextSegment {
  isHighlighted: boolean;
  start: number;
  text: string;
}

interface PhraseMatch {
  index: number;
  phrase: string;
}

function isBetterMatch(candidate: PhraseMatch, best: PhraseMatch | null): boolean {
  if (best === null || candidate.index < best.index) return true;

  return candidate.index === best.index && candidate.phrase.length > best.phrase.length;
}

function nextMatch(text: string, phrases: string[], from: number): PhraseMatch | null {
  let best: PhraseMatch | null = null;

  for (const phrase of phrases) {
    const candidate = { index: text.indexOf(phrase, from), phrase };
    if (candidate.index !== -1 && isBetterMatch(candidate, best)) best = candidate;
  }

  return best;
}

export function splitByHighlights(text: string, highlights: string[]): TextSegment[] {
  const phrases = highlights.filter((phrase) => phrase.length > 0);
  const segments: TextSegment[] = [];
  let cursor = 0;

  for (
    let match = nextMatch(text, phrases, cursor);
    match !== null;
    match = nextMatch(text, phrases, cursor)
  ) {
    if (match.index > cursor) {
      segments.push({ isHighlighted: false, start: cursor, text: text.slice(cursor, match.index) });
    }
    segments.push({ isHighlighted: true, start: match.index, text: match.phrase });
    cursor = match.index + match.phrase.length;
  }

  if (cursor < text.length) {
    segments.push({ isHighlighted: false, start: cursor, text: text.slice(cursor) });
  }

  return segments;
}

function HighlightedText({ highlights, text }: HighlightedTextProps) {
  return (
    <>
      {splitByHighlights(text, highlights).map((segment) =>
        segment.isHighlighted ? (
          <HighlightMark key={segment.start}>{segment.text}</HighlightMark>
        ) : (
          <Fragment key={segment.start}>{segment.text}</Fragment>
        ),
      )}
    </>
  );
}

export default HighlightedText;
