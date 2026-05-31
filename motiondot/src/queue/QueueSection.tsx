import { SectionCard } from "../components/SectionCard";

/** 변환 대기열 */
export function QueueSection() {
  return (
    <SectionCard
      id="queue"
      title="Queue"
      description="대기 중인 배치 작업 목록입니다."
    >
      <ul className="queue-list">
        <li className="queue-list__empty">대기열이 비어 있습니다.</li>
      </ul>
    </SectionCard>
  );
}
