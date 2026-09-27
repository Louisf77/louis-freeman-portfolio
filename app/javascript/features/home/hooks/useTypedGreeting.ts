import { useEffect, useState } from "react";

type TypingPhase = "deleting" | "typing";

interface TypedGreetingFrame {
  isTyping: boolean;
  text: string;
}

interface TypedGreetingOptions {
  endings: string[];
  isStatic: boolean;
  prefix: string;
}

const START_DELAY_MS = 700;
const TYPE_DELAY_MIN_MS = 60;
const TYPE_DELAY_SPREAD_MS = 80;
const HOLD_MS = 2400;
const DELETE_DELAY_MS = 34;
const NEXT_ENDING_PAUSE_MS = 320;

const INITIAL_FRAME: TypedGreetingFrame = { isTyping: true, text: "" };

function typingDelay(): number {
  return TYPE_DELAY_MIN_MS + Math.round(Math.random() * TYPE_DELAY_SPREAD_MS);
}

export default function useTypedGreeting({
  endings,
  isStatic,
  prefix,
}: TypedGreetingOptions): TypedGreetingFrame {
  const [frame, setFrame] = useState<TypedGreetingFrame>(INITIAL_FRAME);
  const isGreetingAvailable = endings.length > 0;
  const isAnimated = !isStatic && isGreetingAvailable;

  useEffect(() => {
    if (!isAnimated) return undefined;

    let endingIndex = 0;
    let length = 0;
    let phase: TypingPhase = "typing";
    let timeoutId = 0;

    const schedule = (delay: number) => {
      timeoutId = window.setTimeout(step, delay);
    };

    function step() {
      const fullGreeting = `${prefix}${endings[endingIndex] ?? ""}`;

      if (phase === "typing") {
        length += 1;
        const isComplete = length >= fullGreeting.length;
        setFrame({ isTyping: !isComplete, text: fullGreeting.slice(0, length) });
        if (isComplete) phase = "deleting";
        schedule(isComplete ? HOLD_MS : typingDelay());
        return;
      }

      length -= 1;
      setFrame({ isTyping: true, text: fullGreeting.slice(0, length) });
      if (length > prefix.length) {
        schedule(DELETE_DELAY_MS);
        return;
      }

      endingIndex = (endingIndex + 1) % endings.length;
      phase = "typing";
      schedule(NEXT_ENDING_PAUSE_MS);
    }

    schedule(START_DELAY_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [endings, isAnimated, prefix]);

  if (isAnimated) return frame;

  return { isTyping: false, text: `${prefix}${endings[0] ?? ""}` };
}
