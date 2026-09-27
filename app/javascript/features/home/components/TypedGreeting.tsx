import styles from "~/features/home/components/TypedGreeting.module.css";
import useTypedGreeting from "~/features/home/hooks/useTypedGreeting";
import useReducedMotion from "~/hooks/useReducedMotion";
import { useUi } from "~/lib/ui";

interface TypedGreetingProps {
  endings: string[];
  headingId: string;
  prefix: string;
}

const LIST_FORMAT = new Intl.ListFormat("en-GB", { style: "long", type: "conjunction" });
const TRAILING_PUNCTUATION = /[.!?]+$/;

function withoutTrailingPunctuation(text: string): string {
  return text.trim().replace(TRAILING_PUNCTUATION, "");
}

function TypedGreeting({ endings, headingId, prefix }: TypedGreetingProps) {
  const t = useUi();
  const isReducedMotion = useReducedMotion();
  const { isTyping, text } = useTypedGreeting({ endings, isStatic: isReducedMotion, prefix });
  const [firstEnding = "", ...otherEndings] = endings;
  const greeting = `${prefix}${firstEnding}`;
  const sentence =
    otherEndings.length > 0
      ? t("hero_greeting_sentence", {
          greeting: withoutTrailingPunctuation(greeting),
          roles: LIST_FORMAT.format(otherEndings.map(withoutTrailingPunctuation)),
        })
      : greeting;

  return (
    <h1 className={styles.greeting} id={headingId}>
      <span className="visually-hidden">{sentence}</span>
      {endings.map((ending) => (
        <span aria-hidden="true" className={styles.sizer} data-testid="greeting-sizer" key={ending}>
          {`${prefix}${ending}`}
          <span className={styles.caret} />
        </span>
      ))}
      <span aria-hidden="true" className={styles.line}>
        <span data-testid="typed-greeting">{text}</span>
        <span
          className={styles.caret}
          data-state={isTyping ? "typing" : "holding"}
          data-testid="typed-greeting-caret"
        />
      </span>
    </h1>
  );
}

export default TypedGreeting;
