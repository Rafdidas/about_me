import { siteMeta } from "@/data/site";

export function Footer() {
  return (
    <footer className="l-footer">
      <div className="l-container l-footer__inner">
        <p>{siteMeta.name}</p>
        <a href={`mailto:${siteMeta.email}`}>{siteMeta.email}</a>
      </div>
    </footer>
  );
}
