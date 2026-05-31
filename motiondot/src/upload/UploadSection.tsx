import { SectionCard } from "../components/SectionCard";

/** 이미지·영상 업로드 영역 */
export function UploadSection() {
  return (
    <SectionCard
      id="upload"
      title="Upload"
      description="배치 변환할 파일을 선택하거나 끌어다 놓습니다."
    >
      <label className="upload-dropzone">
        <input type="file" accept="image/*,video/*" multiple hidden />
        <span className="upload-dropzone__label">파일 추가</span>
        <span className="upload-dropzone__hint">이미지 · 영상 · 다중 선택</span>
      </label>
    </SectionCard>
  );
}
