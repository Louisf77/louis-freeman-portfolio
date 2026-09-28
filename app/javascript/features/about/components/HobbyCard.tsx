import Card from "~/components/Card/Card";
import styles from "~/features/about/components/HobbyCard.module.css";
import classNames from "~/lib/classNames";
import { useUi } from "~/lib/ui";
import type { Hobby } from "~/types/contracts";

export type HobbyTint = "paper-3" | "sage" | "sand";
export type HobbyImageFit = "contain" | "cover";

interface ImageSize {
  height: number;
  width: number;
}

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

const IMAGE_SIZE_BY_FILE: Record<string, ImageSize> = {
  "cooking.jpg": { height: 571, width: 640 },
  "football.jpg": { height: 571, width: 640 },
  "golf.png": { height: 560, width: 382 },
  "photography.png": { height: 560, width: 373 },
  "rugby.png": { height: 560, width: 312 },
  "surfing.png": { height: 560, width: 458 },
  "travelling.png": { height: 560, width: 305 },
};

const FALLBACK_IMAGE_SIZE: Record<HobbyImageFit, ImageSize> = {
  contain: { height: 560, width: 373 },
  cover: { height: 571, width: 640 },
};

export function hobbyImageSize(imagePath: string, fit: HobbyImageFit): ImageSize {
  const fileName = imagePath.slice(imagePath.lastIndexOf("/") + 1);

  return IMAGE_SIZE_BY_FILE[fileName] ?? FALLBACK_IMAGE_SIZE[fit];
}

const IMAGE_CLASS: Record<HobbyImageFit, string | undefined> = {
  contain: styles.cutOut,
  cover: styles.photo,
};

function HobbyCard({ hobby, isLiftedOnHover, tint }: HobbyCardProps) {
  const t = useUi();
  const fit: HobbyImageFit = hobby.photo ? "cover" : "contain";
  const size = hobbyImageSize(hobby.image_path, fit);

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
          height={size.height}
          loading="lazy"
          src={hobby.image_path}
          width={size.width}
        />
      </div>
      <span className={styles.label}>{hobby.name}</span>
    </Card>
  );
}

export default HobbyCard;
