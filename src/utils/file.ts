"use client";

export function downloadTextFile(fileName: string, content: string, mimeType = "text/plain"): void {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** Read a File as text with a strict size cap. Returns an error message or null. */
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function readFileAsText(
  file: File
): Promise<{ ok: true; content: string } | { ok: false; error: string }> {
  if (file.size > MAX_FILE_SIZE) {
    return {
      ok: false,
      error: `File is too large to process safely in the browser. Maximum size is ${Math.round(MAX_FILE_SIZE / (1024 * 1024))} MB.`,
    };
  }
  if (file.size === 0) {
    return { ok: false, error: "The file is empty." };
  }
  const buffer = await file.arrayBuffer();
  // Reject likely binary content (null bytes in the first chunk)
  const head = new Uint8Array(buffer.slice(0, Math.min(buffer.byteLength, 512)));
  for (const byte of head) {
    if (byte === 0) {
      return { ok: false, error: "This looks like a binary file. Only text .env files are supported." };
    }
  }
  const content = new TextDecoder("utf-8", { fatal: false }).decode(buffer);
  if (content.includes("\uFFFD") && /[\uFFFD]{3,}/.test(content)) {
    return { ok: false, error: "Could not read the file as UTF-8 text." };
  }
  return { ok: true, content };
}
