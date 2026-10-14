import { Band } from "@/components/Band/Band";
import { SectionTitle } from "@/components/SectionTitle/SectionTitle";
import { TagList } from "@/components/Tag/Tag";
import { Tile } from "@/components/Tile/Tile";
import { skills } from "@/data/skills";
import styles from "./SkillsBand.module.scss";

export function SkillsBand({ id, title }: { id: string; title: string }) {
  return (
    <Band tone="white" id={id} labelledBy={`${id}-title`}>
      <SectionTitle id={`${id}-title`}>{title}</SectionTitle>
      <ul className={styles.grid}>
        {skills.map((group) => (
          <li key={group.category}>
            <Tile>
              <dl className={styles.group}>
                <dt className={styles.category}>{group.category}</dt>
                <dd className={styles.items}>
                  <TagList items={group.items} />
                  {group.note ? <p className={styles.note}>{group.note}</p> : null}
                </dd>
              </dl>
            </Tile>
          </li>
        ))}
      </ul>
    </Band>
  );
}
