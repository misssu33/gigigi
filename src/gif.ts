import { GIFEncoder, quantize, applyPalette } from "gifenc";

const MAX_FRAMES = 10;

export type FrameItem = {
  id: string;
  file: File;
  previewUrl: string;
};

export function createFrameId(): string {
  return crypto.randomUUID();
}

/** 업로드 가능한 최대 프레임 수 */
export function getMaxFrames(): number {
  return MAX_FRAMES;
}

async function loadImageBitmap(file: File): Promise<ImageBitmap> {
  return createImageBitmap(file);
}

function fitToCanvas(bitmap: ImageBitmap, maxSize: number) {
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas context를 가져올 수 없습니다.");
  ctx.drawImage(bitmap, 0, 0, width, height);
  return { width, height, imageData: ctx.getImageData(0, 0, width, height) };
}

/** 선택한 이미지들로 GIF 바이너리 생성 */
export async function buildGif(
  frames: FrameItem[],
  delayMs: number,
  maxWidth: number
): Promise<Uint8Array> {
  if (frames.length < 1) throw new Error("이미지를 1장 이상 선택하세요.");
  if (frames.length > MAX_FRAMES) throw new Error(`최대 ${MAX_FRAMES}장까지 가능합니다.`);

  const encoder = GIFEncoder();
  const delayCs = Math.max(1, Math.round(delayMs / 10));

  for (let i = 0; i < frames.length; i++) {
    const bitmap = await loadImageBitmap(frames[i].file);
    const { width, height, imageData } = fitToCanvas(bitmap, maxWidth);
    const palette = quantize(imageData.data, 256);
    const index = applyPalette(imageData.data, palette);

    encoder.writeFrame(index, width, height, {
      palette,
      delay: delayCs,
      ...(i > 0 ? { transparent: true } : {}),
    });

    bitmap.close();
  }

  encoder.finish();
  return encoder.bytes();
}

export function gifBytesToBlob(bytes: Uint8Array): Blob {
  return new Blob([new Uint8Array(bytes)], { type: "image/gif" });
}
