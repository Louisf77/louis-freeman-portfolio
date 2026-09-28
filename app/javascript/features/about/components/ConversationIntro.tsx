import { Fragment, useRef } from "react";

import louisWaving448Avif from "~/assets/louis-waving-448.avif";
import louisWaving448Webp from "~/assets/louis-waving-448.webp";
import louisWaving672Avif from "~/assets/louis-waving-672.avif";
import louisWaving672Webp from "~/assets/louis-waving-672.webp";
import louisWaving896Avif from "~/assets/louis-waving-896.avif";
import louisWaving896Webp from "~/assets/louis-waving-896.webp";
import louisWaving from "~/assets/louis-waving.png";
import HighlightedText from "~/components/HighlightMark/HighlightedText";
import styles from "~/features/about/components/ConversationIntro.module.css";
import useChatGlide from "~/features/about/hooks/useChatGlide";
import useMediaQuery, { COMPACT_MEDIA_QUERY } from "~/hooks/useMediaQuery";
import useReducedMotion from "~/hooks/useReducedMotion";
import classNames from "~/lib/classNames";
import { useUi } from "~/lib/ui";
import type { AboutIntro, ChatMessage } from "~/types/contracts";

interface ConversationIntroProps {
  conversation: ChatMessage[];
  intro: AboutIntro;
}

const TALL_VIEWPORT_MEDIA_QUERY = "(min-height: 1500px)";
const RISE_DISTANCE = 22;
const RISE_DISTANCE_COMPACT = 18;
const PORTRAIT_WIDTH = 896;
const PORTRAIT_HEIGHT = 1200;
const PORTRAIT_SIZES = "(max-width: 760px) 246px, 896px";
const PORTRAIT_SOURCES = [
  {
    srcSet: `${louisWaving448Avif} 448w, ${louisWaving672Avif} 672w, ${louisWaving896Avif} 896w`,
    type: "image/avif",
  },
  {
    srcSet: `${louisWaving448Webp} 448w, ${louisWaving672Webp} 672w, ${louisWaving896Webp} 896w`,
    type: "image/webp",
  },
];
const HEADING_ID = "hi-title";
const HINT_KEY = { compact: "about_chat_hint_compact", wide: "about_chat_hint" } as const;
const SENTENCE_BREAK = /(?<=[.!?])\s+/;
const WORD_BREAK = /\s+/;

export function headingLines(heading: string): string[] {
  const sentences = heading.trim().split(SENTENCE_BREAK);
  const lastSentenceWords = (sentences.pop() ?? "").split(WORD_BREAK);
  const accent = lastSentenceWords.pop() ?? "";
  const lastSentenceLead = lastSentenceWords.join(" ");

  return [...sentences, lastSentenceLead, accent].filter((line) => line.length > 0);
}

function ConversationIntro({ conversation, intro }: ConversationIntroProps) {
  const t = useUi();
  const isReducedMotion = useReducedMotion();
  const isTallViewport = useMediaQuery(TALL_VIEWPORT_MEDIA_QUERY);
  const isCompact = useMediaQuery(COMPACT_MEDIA_QUERY);
  const sectionRef = useRef<HTMLElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const isConversationShown = conversation.length > 0;
  const isGliding = isConversationShown && !isReducedMotion && !isTallViewport;
  const lines = headingLines(intro.heading);
  const accentIndex = lines.length - 1;
  const hintKey = isCompact ? HINT_KEY.compact : HINT_KEY.wide;

  useChatGlide({
    isEnabled: isGliding,
    listRef,
    riseDistance: isCompact ? RISE_DISTANCE_COMPACT : RISE_DISTANCE,
    sectionRef,
    windowRef,
  });

  return (
    <section
      aria-labelledby={HEADING_ID}
      className={classNames(styles.section, isGliding && styles.gliding)}
      id="hi"
      ref={sectionRef}
    >
      <div className={styles.pin}>
        <figure className={styles.portrait}>
          <picture className={styles.picture}>
            {PORTRAIT_SOURCES.map((source) => (
              <source
                key={source.type}
                sizes={PORTRAIT_SIZES}
                srcSet={source.srcSet}
                type={source.type}
              />
            ))}
            <img
              alt={t("about_portrait_alt")}
              className={styles.portraitImage}
              decoding="async"
              fetchPriority="high"
              height={PORTRAIT_HEIGHT}
              src={louisWaving}
              width={PORTRAIT_WIDTH}
            />
          </picture>
        </figure>
        <div className={styles.text}>
          <h1 className={styles.heading} id={HEADING_ID}>
            {lines.map((line, index) => (
              <Fragment key={line}>
                <span className={classNames(styles.line, index === accentIndex && styles.accent)}>
                  {line}
                </span>
                {index < accentIndex && " "}
              </Fragment>
            ))}
          </h1>
          <p className={styles.subline}>{intro.subline}</p>
          {isConversationShown && (
            <div className={styles.chatWindow} ref={windowRef}>
              <ul aria-label={t("about_chat_label")} className={styles.chatList} ref={listRef}>
                {conversation.map((message) => (
                  <Fragment key={message.id}>
                    <li className={classNames(styles.bubble, styles.question)}>
                      {message.question}
                    </li>
                    <li className={classNames(styles.bubble, styles.answer)}>
                      <HighlightedText highlights={message.highlights} text={message.answer} />
                    </li>
                  </Fragment>
                ))}
              </ul>
            </div>
          )}
          {isGliding && <p className={styles.hint}>{t(hintKey)}</p>}
        </div>
      </div>
    </section>
  );
}

export default ConversationIntro;
