import type { ReactNode } from "react";

type SectionCardProps = {
  id: string;
  title: string;
  description: string;
  children?: ReactNode;
};

/** 모바일 우선 섹션 카드 */
export function SectionCard({ id, title, description, children }: SectionCardProps) {
  return (
    <section className="section-card" id={id} aria-labelledby={`${id}-title`}>
      <header className="section-card__header">
        <h2 id={`${id}-title`} className="section-card__title">
          {title}
        </h2>
        <p className="section-card__desc">{description}</p>
      </header>
      <div className="section-card__body">{children}</div>
    </section>
  );
}
