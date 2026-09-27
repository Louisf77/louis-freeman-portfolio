import AboutSectionHeader from "~/features/about/components/AboutSectionHeader";
import styles from "~/features/about/components/HobbiesSection.module.css";
import HobbyCard, { type HobbyTint } from "~/features/about/components/HobbyCard";
import useMediaQuery, { COMPACT_MEDIA_QUERY } from "~/hooks/useMediaQuery";
import { useUi } from "~/lib/ui";
import type { HobbiesSection as HobbiesSectionContent } from "~/types/contracts";

interface HobbiesSectionProps {
  hobbies: HobbiesSectionContent;
}

const HEADING_ID = "out-title";
const SWIPE_ROW_TAB_INDEX = 0;
const HOBBY_TINTS: readonly HobbyTint[] = ["sage", "sand", "paper-3"];

function tintAt(index: number): HobbyTint {
  return HOBBY_TINTS[index % HOBBY_TINTS.length] ?? "sage";
}

function HobbiesSection({ hobbies }: HobbiesSectionProps) {
  const t = useUi();
  const isCompact = useMediaQuery(COMPACT_MEDIA_QUERY);
  if (hobbies.items.length === 0 && hobbies.earlier_roles.length === 0) return null;

  return (
    <section aria-labelledby={HEADING_ID} className={styles.section} id="out">
      <AboutSectionHeader heading={t("hobbies_heading")} headingId={HEADING_ID} />
      <div
        aria-label={t(isCompact ? "hobbies_list_label_swipe" : "hobbies_list_label")}
        className={styles.scroller}
        role="group"
        tabIndex={isCompact ? SWIPE_ROW_TAB_INDEX : undefined}
      >
        <ul className={styles.list}>
          {hobbies.items.map((hobby, index) => (
            <HobbyCard
              hobby={hobby}
              isLiftedOnHover={!isCompact}
              key={hobby.id}
              tint={tintAt(index)}
            />
          ))}
          {hobbies.earlier_roles.length > 0 && (
            <li className={styles.earlier}>
              <span className={styles.earlierLabel}>{t("hobbies_earlier_label")}</span>
              {hobbies.earlier_roles.map((role) => (
                <p className={styles.earlierRole} key={role.id}>
                  {role.text}
                </p>
              ))}
            </li>
          )}
        </ul>
      </div>
    </section>
  );
}

export default HobbiesSection;
