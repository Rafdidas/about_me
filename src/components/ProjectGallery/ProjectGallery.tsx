import Image from "next/image";
import { uiCopy } from "@/data/site";
import type { ProjectImage } from "@/data/types";
import styles from "./ProjectGallery.module.scss";

export function ProjectGallery({ images }: { images?: ProjectImage[] }) {
  if (!images || images.length === 0) return null;

  return (
    <ul className={styles.gallery} aria-label={uiCopy.galleryLabel}>
      {images.map((image, index) => (
        <li key={image.src} className={styles.item}>
          <Image
            className={styles.image}
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            sizes="(min-width: 1024px) 720px, 100vw"
            priority={index === 0}
          />
        </li>
      ))}
    </ul>
  );
}
