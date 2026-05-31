import { SectionCard } from "../components/SectionCard";

const TEMPLATE_NAMES = ["Sticker pack", "Story 9:16", "Square feed", "Banner wide"] as const;

/** 레이아웃·크롭 템플릿 */
export function TemplatesSection() {
  return (
    <SectionCard
      id="templates"
      title="Templates"
      description="소셜·스티커용 레이아웃 템플릿을 적용합니다."
    >
      <div className="template-grid">
        {TEMPLATE_NAMES.map((name) => (
          <button key={name} type="button" className="template-tile">
            {name}
          </button>
        ))}
      </div>
    </SectionCard>
  );
}
