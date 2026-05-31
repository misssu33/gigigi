# gigigi

브라우저에서 **이미지 1~10장**을 올려 **GIF**를 만드는 모바일 우선 웹 앱입니다.

## 기술 스택

- Vite + React + TypeScript
- CSS only
- [gifenc](https://github.com/mattdesl/gifenc) (브라우저 인코딩)
- 백엔드 없음

## 기능

1. 이미지 여러 장 업로드 (최대 10장)
2. 선택한 프레임 미리보기
3. 프레임 간격(ms) · 최대 너비(px) 설정
4. 브라우저에서 GIF 생성
5. 미리보기 및 다운로드

## 실행 방법

```bash
# 루트 gigigi 앱
npm install
npm run dev
```

브라우저: **http://localhost:5173/**

## 빌드

```bash
npm run build
npm run preview
```

## MotionDot (별도 앱)

`/motiondot` 폴더에 별도 Vite 앱이 있습니다 (포트 **5174**).

```bash
cd motiondot
npm install
npm run dev
```

## 파일 구조

```
src/
  main.tsx   — React 엔트리
  App.tsx    — UI
  App.css    — 스타일
  gif.ts     — GIF 인코딩
  gifenc.d.ts
```

자세한 계획은 `FILE_PLAN.md` 참고.
