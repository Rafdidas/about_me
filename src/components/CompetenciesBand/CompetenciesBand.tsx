import { Band } from "@/components/Band/Band";
import { SectionTitle } from "@/components/SectionTitle/SectionTitle";
import { Tile } from "@/components/Tile/Tile";
import { profile } from "@/data/profile";
import { uiCopy } from "@/data/site";
import styles from "./CompetenciesBand.module.scss";

export function CompetenciesBand() {
  return (
    <Band tone="white" labelledBy="competencies-title">
      <SectionTitle id="competencies-title">{uiCopy.competenciesTitle}</SectionTitle>
      <ul className={styles.grid}>
        {profile.competencies.map((item) => (
          <li key={item.text}>
            <Tile>
              {item.label ? <h3 className={styles.label}>{item.label}</h3> : null}
              <p className={styles.text}>{item.text}</p>
            </Tile>
          </li>
        ))}
      </ul>
    </Band>
  );
}
