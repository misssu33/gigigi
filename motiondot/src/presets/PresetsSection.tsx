import { SectionCard } from "../components/SectionCard";

const PRESET_OPTIONS = ["GIF 480p", "GIF 720p", "WebP loop", "MP4 short"] as const;

/** 출력 프리셋 선택 */
export function PresetsSection() {
  return (
    <SectionCard
      id="presets"
      title="Presets"
      description="출력 포맷·해상도·프레임률 프리셋을 고릅니다."
    >
      <div className="chip-row" role="list">
        {PRESET_OPTIONS.map((preset) => (
          <button key={preset} type="button" className="chip" role="listitem">
            {preset}
          </button>
        ))}
      </div>
    </SectionCard>
  );
}
