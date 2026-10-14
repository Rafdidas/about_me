import { Band } from "@/components/Band/Band";
import { SectionTitle } from "@/components/SectionTitle/SectionTitle";
import { Tile } from "@/components/Tile/Tile";
import { education } from "@/data/education";
import styles from "./EducationBand.module.scss";

export function EducationBand({ id, title }: { id: string; title: string }) {
  return (
    <Band tone="canvas" id={id} labelledBy={`${id}-title`}>
      <SectionTitle id={`${id}-title`}>{title}</SectionTitle>
      <div className={styles.wrap}>
        <Tile>
          <ul className={styles.list}>
            {education.map((item) => (
              <li key={item.title} className={styles.item}>
                <span className={styles.name}>{item.title}</span>
                {item.detail ? <span className={styles.detail}>{item.detail}</span> : null}
              </li>
            ))}
          </ul>
        </Tile>
      </div>
    </Band>
  );
}
