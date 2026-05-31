# gigigi

**gifffff** — 브라우저에서 이미지를 GIF로 만드는 작은 웹 앱입니다.

## 기능

- 여러 장의 이미지를 드래그 앤 드롭 또는 파일 선택으로 업로드
- 프레임 간격·최대 변 크기 조절 후 GIF 생성
- 생성 결과 미리보기 및 다운로드
- 외부 GIF URL 미리보기

모든 처리는 **클라이언트(브라우저)** 에서만 이루어지며, 파일은 서버로 전송되지 않습니다.

## 로컬 실행

```bash
npm install
npm run dev
```

빌드:

```bash
npm run build
npm run preview
```

## 기술 스택

- [Vite](https://vitejs.dev/)
- TypeScript
- [gifenc](https://github.com/mattdesl/gifenc) — 브라우저 GIF 인코딩

## 라이선스

MIT
