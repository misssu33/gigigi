import { GIFEncoder, quantize, applyPalette } from "gifenc";

export type FrameSource = {
  file: File;
  previewUrl: string;
};

/** File을 ImageBitmap으로 로드 */
export async function loadImageBitmap(file: File): Promise<ImageBitmap> {
  const blob = file.type ? file : new Blob([file], { type: "image/png" });
  return createImageBitmap(blob);
}

/** 프레임 목록으로 GIF 바이너리 생성 */
export async function buildGif(
  frames: FrameSource[],
  delayMs: number,
  maxSize: number,
  onProgress?: (current: number, total: number) => void
): Promise<Uint8Array> {
  if (frames.length === 0) {
    throw new Error("프레임이 없습니다.");
  }

  const encoder = GIFEncoder();
  const delayCs = Math.max(1, Math.round(delayMs / 10));

  for (let i = 0; i < frames.length; i++) {
    onProgress?.(i + 1, frames.length);
    const bitmap = await loadImageBitmap(frames[i].file);
    const { width, height, canvas } = fitToCanvas(bitmap, maxSize);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas context를 가져올 수 없습니다.");

    const imageData = ctx.getImageData(0, 0, width, height);
    const palette = quantize(imageData.data, 256);
    const index = applyPalette(imageData.data, palette);

    if (i === 0) {
      encoder.writeFrame(index, width, height, {
        palette,
        delay: delayCs,
      });
    } else {
      encoder.writeFrame(index, width, height, {
        palette,
        delay: delayCs,
        transparent: true,
      });
    }

    bitmap.close();
  }

  encoder.finish();
  return encoder.bytes();
}

function fitToCanvas(
  bitmap: ImageBitmap,
  maxSize: number
): { width: number; height: number; canvas: HTMLCanvasElement } {
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas context를 가져올 수 없습니다.");

  ctx.drawImage(bitmap, 0, 0, width, height);
  return { width, height, canvas };
}

/** Uint8Array를 다운로드용 Blob URL로 변환 */
export function gifBytesToObjectUrl(bytes: Uint8Array): string {
  const copy = new Uint8Array(bytes);
  const blob = new Blob([copy], { type: "image/gif" });
  return URL.createObjectURL(blob);
}
