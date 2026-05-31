# gigigi — 파일 계획 (구현 전)

## 목표
루트 `/workspace`의 gigigi 앱을 **Vite + React + TypeScript + CSS** 로 단순 재구성.  
`/motiondot` 폴더는 **변경 없음**.

## 삭제·교체 (루트 `src/`)

| 제거 | 이유 |
|------|------|
| `src/main.ts` | React `main.tsx`로 대체 |
| `src/style.css` | `App.css`로 대체 |
| `src/gif-maker.ts` | `gif.ts`로 단순 이전 |

## 최종 파일 트리

```
/workspace
├── index.html              # #root + main.tsx
├── package.json            # react, react-dom, gifenc, @vitejs/plugin-react
├── vite.config.ts          # React 플러그인, host 0.0.0.0, port 5173
├── tsconfig.json
├── tsconfig.app.json
├── README.md               # 실행 방법
└── src/
    ├── main.tsx            # React 마운트
    ├── App.tsx             # UI 전부 (업로드·프레임·설정·미리보기·다운로드)
    ├── App.css             # 모바일 우선 스타일
    ├── gif.ts              # gifenc GIF 인코딩 (순수 함수)
    └── gifenc.d.ts         # gifenc 타입 (기존 유지)
```

## 각 파일 역할

| 파일 | 역할 |
|------|------|
| `App.tsx` | 1~10장 업로드, 프레임 목록, delay/maxWidth, 생성·미리보기·다운로드 |
| `gif.ts` | `buildGif(frames, delayMs, maxWidth)` — 브라우저 인코딩만 |
| `App.css` | 단일 컬럼, 터치 친화, max-width ~480px |

## 의존성

- `gifenc` — 브라우저 GIF 생성
- `react`, `react-dom`, `@vitejs/plugin-react`
- 백엔드·워커·큐·ffmpeg 없음

## 실행 (구현 후)

```bash
cd /workspace
npm install
npm run dev    # http://localhost:5173
```
