# MotionDot

모바일 우선 **배치 GIF·영상 변환기** MVP. 루트의 `gigigi` 앱과 완전히 분리된 Vite + React + TypeScript 앱입니다.

## 폴더 구조

```
src/
  upload/       — 파일 업로드
  presets/      — 출력 프리셋
  queue/        — 변환 대기열
  conversion/   — 변환 진행
  templates/    — 레이아웃 템플릿
  preview/      — 결과 미리보기
  export/       — 다운로드·보내기
  components/   — 공용 UI
```

## 실행

```bash
cd motiondot
npm install
npm run dev
```

- **MotionDot:** http://localhost:5174/
- **gigigi (루트):** `/workspace`에서 `npm run dev` → http://localhost:5173/

두 앱은 포트가 다르므로 동시에 실행할 수 있습니다.

## 빌드

```bash
npm run build
npm run preview
```
