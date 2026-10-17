export async function compressImage(
  file: File,
  maxSizeMB = 1,
  maxWidth = 1600,
): Promise<File> {
  const imageBitmap = await createImageBitmap(file);

  const canvas = document.createElement("canvas");
  const scale = Math.min(1, maxWidth / imageBitmap.width);

  canvas.width = imageBitmap.width * scale;
  canvas.height = imageBitmap.height * scale;

  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(imageBitmap, 0, 0, canvas.width, canvas.height);

  let quality = 0.9;
  let blob: Blob | null = null;

  do {
    blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(
        resolve,
        file.type === "image/png" ? "image/jpeg" : file.type,
        quality,
      ),
    );
    quality -= 0.1;
  } while (blob && blob.size > maxSizeMB * 1024 * 1024 && quality > 0.4);

  if (!blob) throw new Error("Compression failed");

  return new File([blob], file.name, {
    type: blob.type,
    lastModified: Date.now(),
  });
}
