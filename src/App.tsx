import { useCallback, useEffect, useRef, useState } from "react";
import {
  buildGif,
  createFrameId,
  getMaxFrames,
  gifBytesToBlob,
  type FrameItem,
} from "./gif";
import "./App.css";

const MAX = getMaxFrames();

export default function App() {
  const [frames, setFrames] = useState<FrameItem[]>([]);
  const [delayMs, setDelayMs] = useState(200);
  const [maxWidth, setMaxWidth] = useState(480);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [gifUrl, setGifUrl] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const gifUrlRef = useRef<string | null>(null);

  const revokeGifUrl = useCallback(() => {
    if (gifUrlRef.current) {
      URL.revokeObjectURL(gifUrlRef.current);
      gifUrlRef.current = null;
    }
    setGifUrl(null);
  }, []);

  const framesRef = useRef(frames);
  framesRef.current = frames;

  useEffect(() => {
    return () => {
      framesRef.current.forEach((f) => URL.revokeObjectURL(f.previewUrl));
      if (gifUrlRef.current) URL.revokeObjectURL(gifUrlRef.current);
    };
  }, []);

  const addFiles = (list: FileList | File[]) => {
    const images = Array.from(list).filter((f) => f.type.startsWith("image/"));
    if (images.length === 0) {
      setStatus("이미지 파일만 업로드할 수 있습니다.");
      return;
    }

    setFrames((prev) => {
      const room = MAX - prev.length;
      if (room <= 0) {
        setStatus(`최대 ${MAX}장까지 선택할 수 있습니다.`);
        return prev;
      }
      const slice = images.slice(0, room);
      const next = [
        ...prev,
        ...slice.map((file) => ({
          id: createFrameId(),
          file,
          previewUrl: URL.createObjectURL(file),
        })),
      ];
      setStatus(`${slice.length}장 추가 · 총 ${next.length}/${MAX}장`);
      return next;
    });
  };

  const removeFrame = (id: string) => {
    setFrames((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      const next = prev.filter((f) => f.id !== id);
      setStatus(`총 ${next.length}/${MAX}장`);
      return next;
    });
    revokeGifUrl();
  };

  const clearAll = () => {
    frames.forEach((f) => URL.revokeObjectURL(f.previewUrl));
    setFrames([]);
    revokeGifUrl();
    setStatus("");
  };

  const handleGenerate = async () => {
    setBusy(true);
    revokeGifUrl();
    setStatus("GIF 생성 중…");

    try {
      const bytes = await buildGif(frames, delayMs, maxWidth);
      const url = URL.createObjectURL(gifBytesToBlob(bytes));
      gifUrlRef.current = url;
      setGifUrl(url);
      setStatus(`완료 · ${(bytes.byteLength / 1024).toFixed(1)} KB`);
    } catch (err) {
      setStatus(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>gigigi</h1>
        <p>이미지 1~{MAX}장으로 GIF 만들기</p>
      </header>

      <section className="card">
        <h2>이미지 업로드</h2>
        <button
          type="button"
          className="dropzone"
          onClick={() => inputRef.current?.click()}
          disabled={frames.length >= MAX}
        >
          <span className="dropzone__title">탭해서 이미지 선택</span>
          <span className="dropzone__hint">
            {frames.length}/{MAX}장 · PNG/JPG/WebP
          </span>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            e.target.value = "";
          }}
        />

        {frames.length > 0 && (
          <ul className="frames">
            {frames.map((frame, i) => (
              <li key={frame.id} className="frames__item">
                <img src={frame.previewUrl} alt={`프레임 ${i + 1}`} />
                <span>#{i + 1}</span>
                <button
                  type="button"
                  className="frames__remove"
                  aria-label={`프레임 ${i + 1} 삭제`}
                  onClick={() => removeFrame(frame.id)}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card">
        <h2>설정</h2>
        <label className="field">
          <span>프레임 간격 (ms)</span>
          <input
            type="number"
            min={50}
            max={3000}
            step={50}
            value={delayMs}
            onChange={(e) => setDelayMs(Number(e.target.value) || 200)}
          />
        </label>
        <label className="field">
          <span>최대 너비 (px)</span>
          <input
            type="number"
            min={120}
            max={800}
            step={40}
            value={maxWidth}
            onChange={(e) => setMaxWidth(Number(e.target.value) || 480)}
          />
        </label>
      </section>

      <div className="actions">
        <button
          type="button"
          className="btn btn--primary"
          disabled={frames.length < 1 || busy}
          onClick={handleGenerate}
        >
          {busy ? "생성 중…" : "GIF 생성"}
        </button>
        <button
          type="button"
          className="btn btn--ghost"
          disabled={frames.length < 1 || busy}
          onClick={clearAll}
        >
          초기화
        </button>
      </div>

      {status && <p className="status" role="status">{status}</p>}

      <section className="card">
        <h2>미리보기</h2>
        <div className="preview">
          {gifUrl ? (
            <img src={gifUrl} alt="생성된 GIF" className="preview__img" />
          ) : (
            <p className="preview__empty">생성된 GIF가 여기에 표시됩니다</p>
          )}
        </div>
        {gifUrl && (
          <a className="btn btn--primary download" href={gifUrl} download="gigigi.gif">
            GIF 다운로드
          </a>
        )}
      </section>

      <footer className="footer">
        <p>브라우저에서만 처리됩니다. 서버로 업로드되지 않습니다.</p>
      </footer>
    </div>
  );
}
