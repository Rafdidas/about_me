import type { ReactNode } from "react";
import styles from "./Tile.module.scss";

type TileProps = {
  as?: "div" | "article";
  media?: ReactNode;
  interactive?: boolean;
  className?: string;
  children: ReactNode;
};

export function Tile({ as: Component = "div", media, interactive = false, className, children }: TileProps) {
  const classes = [styles.tile, interactive ? styles.interactive : null, className].filter(Boolean).join(" ");

  return (
    <Component className={classes}>
      {media ? <div className={styles.media}>{media}</div> : null}
      <div className={styles.body}>{children}</div>
    </Component>
  );
}
