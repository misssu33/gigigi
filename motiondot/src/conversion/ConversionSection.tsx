import { SectionCard } from "../components/SectionCard";

/** 변환 진행 상태 */
export function ConversionSection() {
  return (
    <SectionCard
      id="conversion"
      title="Conversion"
      description="현재 변환 진행률과 상태를 표시합니다."
    >
      <div className="progress-block" role="status" aria-live="polite">
        <div className="progress-block__bar" aria-hidden="true">
          <span className="progress-block__fill" style={{ width: "0%" }} />
        </div>
        <p className="progress-block__label">대기 중 · 0%</p>
      </div>
    </SectionCard>
  );
}
