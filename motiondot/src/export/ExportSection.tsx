import { SectionCard } from "../components/SectionCard";

/**보내기·다운로드 */
export function ExportSection() {
  return (
    <SectionCard
      id="export"
      title="Export"
      description="완료된 배치 결과를 다운로드합니다."
    >
      <button type="button" className="btn btn--primary" disabled>
        ZIP 다운로드
      </button>
      <p className="export-hint">변환이 완료되면 활성화됩니다.</p>
    </SectionCard>
  );
}
