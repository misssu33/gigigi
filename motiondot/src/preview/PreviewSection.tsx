import { SectionCard } from "../components/SectionCard";

/** 결과 미리보기 */
export function PreviewSection() {
  return (
    <SectionCard
      id="preview"
      title="Preview"
      description="변환 결과를 미리 봅니다."
    >
      <div className="preview-stage">
        <p className="preview-stage__placeholder">미리보기가 여기에 표시됩니다</p>
      </div>
    </SectionCard>
  );
}
