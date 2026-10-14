import Image from "next/image";
import { Band } from "@/components/Band/Band";
import { uiCopy } from "@/data/site";
import type { ProjectImage } from "@/data/types";
import styles from "./ProjectGallery.module.scss";

export function ProjectGallery({ images }: { images?: ProjectImage[] }) {
  if (!images || images.length === 0) return null;

  return (
    <Band tone="white">
      <ul className={styles.gallery} aria-label={uiCopy.galleryLabel}>
        {images.map((image, index) => (
          <li key={image.src} className={styles.item}>
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes="(min-width: 1024px) 980px, 100vw"
              priority={index === 0}
            />
          </li>
        ))}
      </ul>
    </Band>
  );
}
