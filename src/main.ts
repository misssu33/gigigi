import "./style.css";
import {
  buildGif,
  gifBytesToObjectUrl,
  type FrameSource,
} from "./gif-maker";

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("#app 요소를 찾을 수 없습니다.");

let frames: FrameSource[] = [];
let resultUrl: string | null = null;

app.innerHTML = `
  <header class="hero">
    <p class="eyebrow">gifffff</p>
    <h1>gigigi</h1>
    <p class="tagline">이미지 몇 장을 올리면 브라우저에서 바로 GIF를 만듭니다.</p>
  </header>

  <main class="layout">
    <section class="panel" aria-labelledby="maker-heading">
      <h2 id="maker-heading">GIF 만들기</h2>

      <div class="dropzone" id="dropzone" tabindex="0" role="button" aria-label="이미지 업로드">
        <p class="dropzone-title">이미지를 끌어다 놓거나 클릭하세요</p>
        <p class="dropzone-hint">PNG · JPG · WebP · 여러 장 · ⋮⋮ 로 순서 변경</p>
        <input type="file" id="file-input" accept="image/*" multiple hidden />
      </div>

      <ul class="frame-list" id="frame-list" aria-live="polite"></ul>

      <div class="controls">
        <label class="field">
          <span>프레임 간격 (ms)</span>
          <input type="number" id="delay" min="50" max="3000" step="50" value="200" />
        </label>
        <label class="field">
          <span>최대 변 (px)</span>
          <input type="number" id="max-size" min="120" max="800" step="40" value="480" />
        </label>
      </div>

      <div class="actions">
        <button type="button" class="btn primary" id="build-btn" disabled>GIF 생성</button>
        <button type="button" class="btn ghost" id="clear-btn" disabled>초기화</button>
      </div>
      <p class="status" id="status" role="status"></p>
    </section>

    <section class="panel preview-panel" aria-labelledby="preview-heading">
      <h2 id="preview-heading">미리보기</h2>
      <div class="preview-box" id="preview-box">
        <p class="preview-placeholder">생성된 GIF가 여기에 표시됩니다</p>
        <img id="preview-img" alt="생성된 GIF 미리보기" hidden />
      </div>
      <a class="btn primary download" id="download-link" hidden download="gigigi.gif">GIF 다운로드</a>

      <hr class="divider" />

      <h3 class="subheading">URL로 보기</h3>
      <form class="url-form" id="url-form">
        <input type="url" id="url-input" placeholder="https://example.com/image.gif" required />
        <button type="submit" class="btn ghost">불러오기</button>
      </form>
    </section>
  </main>

  <footer class="footer">
    <p>gigigi — 브라우저 안에서만 동작합니다. 파일은 서버로 전송되지 않습니다.</p>
  </footer>
`;

const dropzone = mustGet("#dropzone");
const fileInput = mustGet<HTMLInputElement>("#file-input");
const frameList = mustGet("#frame-list");
const delayInput = mustGet<HTMLInputElement>("#delay");
const maxSizeInput = mustGet<HTMLInputElement>("#max-size");
const buildBtn = mustGet<HTMLButtonElement>("#build-btn");
const clearBtn = mustGet<HTMLButtonElement>("#clear-btn");
const statusEl = mustGet("#status");
const previewImg = mustGet<HTMLImageElement>("#preview-img");
const previewBox = mustGet("#preview-box");
const downloadLink = mustGet<HTMLAnchorElement>("#download-link");
const urlForm = mustGet<HTMLFormElement>("#url-form");
const urlInput = mustGet<HTMLInputElement>("#url-input");

function mustGet<T extends Element>(selector: string): T {
  const el = document.querySelector<T>(selector);
  if (!el) throw new Error(`${selector} 요소를 찾을 수 없습니다.`);
  return el;
}

function setStatus(message: string) {
  statusEl.textContent = message;
}

function revokeResultUrl() {
  if (resultUrl) {
    URL.revokeObjectURL(resultUrl);
    resultUrl = null;
  }
}

function showPreview(url: string) {
  revokeResultUrl();
  resultUrl = url;
  previewImg.src = url;
  previewImg.hidden = false;
  previewBox.querySelector(".preview-placeholder")?.remove();
  downloadLink.href = url;
  downloadLink.hidden = false;
}

function moveFrame(from: number, to: number) {
  if (from === to || from < 0 || to < 0 || from >= frames.length || to >= frames.length) {
    return;
  }
  const [item] = frames.splice(from, 1);
  frames.splice(to, 0, item);
  renderFrames();
  setStatus(`순서 변경됨 · 총 ${frames.length}프레임`);
}

function renderFrames() {
  frameList.innerHTML = "";
  frames.forEach((frame, index) => {
    const li = document.createElement("li");
    li.className = "frame-item";
    li.dataset.index = String(index);
    li.innerHTML = `
      <button
        type="button"
        class="btn icon drag-handle"
        data-index="${index}"
        aria-label="프레임 ${index + 1} 끌어서 이동"
      >⋮⋮</button>
      <img src="${frame.previewUrl}" alt="프레임 ${index + 1}" width="72" height="72" draggable="false" />
      <span class="frame-label">#${index + 1} ${frame.file.name}</span>
      <button type="button" class="btn icon remove-frame" data-index="${index}" aria-label="프레임 ${index + 1} 삭제">×</button>
    `;
    frameList.appendChild(li);
  });

  const hasFrames = frames.length > 0;
  buildBtn.disabled = !hasFrames;
  clearBtn.disabled = !hasFrames;
}

function addFiles(fileList: FileList | File[]) {
  const incoming = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
  if (incoming.length === 0) {
    setStatus("이미지 파일만 추가할 수 있습니다.");
    return;
  }

  for (const file of incoming) {
    frames.push({
      file,
      previewUrl: URL.createObjectURL(file),
    });
  }

  setStatus(`${incoming.length}장 추가됨 · 총 ${frames.length}프레임`);
  renderFrames();
}

function clearFrames() {
  for (const frame of frames) {
    URL.revokeObjectURL(frame.previewUrl);
  }
  frames = [];
  revokeResultUrl();
  previewImg.hidden = true;
  previewImg.removeAttribute("src");
  downloadLink.hidden = true;
  if (!previewBox.querySelector(".preview-placeholder")) {
    const placeholder = document.createElement("p");
    placeholder.className = "preview-placeholder";
    placeholder.textContent = "생성된 GIF가 여기에 표시됩니다";
    previewBox.prepend(placeholder);
  }
  setStatus("");
  renderFrames();
}

dropzone.addEventListener("click", () => fileInput.click());
dropzone.addEventListener("keydown", (e) => {
  const keyEvent = e as KeyboardEvent;
  if (keyEvent.key === "Enter" || keyEvent.key === " ") {
    e.preventDefault();
    fileInput.click();
  }
});

fileInput.addEventListener("change", () => {
  if (fileInput.files) addFiles(fileInput.files);
  fileInput.value = "";
});

dropzone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropzone.classList.add("dragover");
});

dropzone.addEventListener("dragleave", () => {
  dropzone.classList.remove("dragover");
});

dropzone.addEventListener("drop", (e) => {
  const dragEvent = e as DragEvent;
  dragEvent.preventDefault();
  dropzone.classList.remove("dragover");
  if (dragEvent.dataTransfer?.files) addFiles(dragEvent.dataTransfer.files);
});

let reorderFromIndex: number | null = null;
let reorderPointerId: number | null = null;

function clearReorderHighlight() {
  frameList.querySelectorAll(".frame-item").forEach((el) => {
    el.classList.remove("dragging", "drop-target");
  });
}

function highlightDropTarget(clientX: number, clientY: number) {
  frameList.querySelectorAll(".drop-target").forEach((el) => el.classList.remove("drop-target"));
  const hit = document.elementFromPoint(clientX, clientY)?.closest(".frame-item");
  hit?.classList.add("drop-target");
  return hit;
}

function finishReorder(clientX: number, clientY: number) {
  if (reorderFromIndex === null) return;

  const target = highlightDropTarget(clientX, clientY);
  const toIndex = target ? Array.from(frameList.children).indexOf(target) : -1;
  clearReorderHighlight();

  if (toIndex >= 0) moveFrame(reorderFromIndex, toIndex);
  reorderFromIndex = null;
  reorderPointerId = null;
}

frameList.addEventListener("pointerdown", (e) => {
  const pointerEvent = e as PointerEvent;
  const target = pointerEvent.target;
  if (!(target instanceof Element)) return;
  const handle = target.closest<HTMLButtonElement>(".drag-handle");
  if (!handle) return;

  pointerEvent.preventDefault();
  reorderFromIndex = Number(handle.dataset.index);
  reorderPointerId = pointerEvent.pointerId;
  handle.setPointerCapture(pointerEvent.pointerId);
  handle.closest(".frame-item")?.classList.add("dragging");
  frameList.classList.add("is-reordering");
});

frameList.addEventListener("pointermove", (e) => {
  const pointerEvent = e as PointerEvent;
  if (reorderPointerId === null || pointerEvent.pointerId !== reorderPointerId) return;
  highlightDropTarget(pointerEvent.clientX, pointerEvent.clientY);
});

frameList.addEventListener("pointerup", (e) => {
  const pointerEvent = e as PointerEvent;
  if (reorderPointerId === null || pointerEvent.pointerId !== reorderPointerId) return;
  finishReorder(pointerEvent.clientX, pointerEvent.clientY);
  frameList.classList.remove("is-reordering");
});

frameList.addEventListener("pointercancel", (e) => {
  const pointerEvent = e as PointerEvent;
  if (reorderPointerId === null || pointerEvent.pointerId !== reorderPointerId) return;
  clearReorderHighlight();
  reorderFromIndex = null;
  reorderPointerId = null;
  frameList.classList.remove("is-reordering");
});

frameList.addEventListener("click", (e) => {
  const btn = (e.target as HTMLElement).closest<HTMLButtonElement>(".remove-frame");
  if (!btn) return;

  const index = Number(btn.dataset.index);
  const [removed] = frames.splice(index, 1);
  if (removed) URL.revokeObjectURL(removed.previewUrl);
  renderFrames();
  setStatus(`프레임 삭제됨 · 총 ${frames.length}프레임`);
});

clearBtn.addEventListener("click", clearFrames);

buildBtn.addEventListener("click", async () => {
  buildBtn.disabled = true;
  setStatus("GIF 생성 중…");

  try {
    const delay = Number(delayInput.value) || 200;
    const maxSize = Number(maxSizeInput.value) || 480;

    const bytes = await buildGif(frames, delay, maxSize, (current, total) => {
      setStatus(`인코딩 중… ${current}/${total}`);
    });

    showPreview(gifBytesToObjectUrl(bytes));
    setStatus(`완료 · ${(bytes.byteLength / 1024).toFixed(1)} KB`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    setStatus(`오류: ${message}`);
  } finally {
    buildBtn.disabled = frames.length === 0;
  }
});

urlForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const url = urlInput.value.trim();
  if (!url) return;
  showPreview(url);
  setStatus("외부 GIF URL을 불러왔습니다.");
});

renderFrames();
