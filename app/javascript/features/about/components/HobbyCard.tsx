import Card from "~/components/Card/Card";
import styles from "~/features/about/components/HobbyCard.module.css";
import classNames from "~/lib/classNames";
import { useUi } from "~/lib/ui";
import type { Hobby } from "~/types/contracts";

export type HobbyTint = "paper-3" | "sage" | "sand";
type HobbyImageFit = "contain" | "cover";

interface HobbyCardProps {
  hobby: Hobby;
  isLiftedOnHover: boolean;
  tint: HobbyTint;
}

const TINT_CLASS: Record<HobbyTint, string | undefined> = {
  "paper-3": styles.tintPaper3,
  sage: styles.tintSage,
  sand: styles.tintSand,
};

const IMAGE_CLASS: Record<HobbyImageFit, string | undefined> = {
  contain: styles.cutOut,
  cover: styles.photo,
};

function HobbyCard({ hobby, isLiftedOnHover, tint }: HobbyCardProps) {
  const t = useUi();
  const fit: HobbyImageFit = hobby.photo ? "cover" : "contain";

  return (
    <Card as="li" className={styles.card} isLiftedOnHover={isLiftedOnHover}>
      <div
        className={classNames(styles.well, fit === "contain" && TINT_CLASS[tint])}
        data-fit={fit}
        data-tint={tint}
      >
        <img
          alt={t("hobbies_image_alt", { hobby: hobby.name.toLocaleLowerCase() })}
          className={IMAGE_CLASS[fit]}
          decoding="async"
          loading="lazy"
          src={hobby.image_path}
        />
      </div>
      <span className={styles.label}>{hobby.name}</span>
    </Card>
  );
}

export default HobbyCard;
