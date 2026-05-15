const base64ToUint8Array = (base64: string): Uint8Array<ArrayBuffer> => {
  const binaryStr = atob(base64);
  const len = binaryStr.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }

  return bytes;
};

/**
 * Konverterer en base64-streng til en ArrayBuffer
 * @param base64 String som skal konverteres til ArrayBuffer
 */
export const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const array = base64ToUint8Array(base64);

  return array.buffer;
};

/**
 * Konverterer en base64-streng til en Blob
 * @param base64 String som skal konverteres til Blob
 * @param type MIME-type, f.eks. 'application/pdf'
 */
export const base64ToBlob = (base64: string, type: string): Blob => {
  const bytes = base64ToUint8Array(base64);

  return new Blob([bytes], { type });
};

/**
 * Laster ned en fil i nettleseren.
 * @param file Selve filen.
 * @param fileName Navn på filen når den lastes ned, inkludert extension (f.eks. "dokument.pdf")
 * @param mimeType MIME-type på filen, f.eks. "application/pdf". Påkrevd dersom filen er en ArrayBuffer.
 */
export const downloadFileInBrowser = (file: Blob | ArrayBuffer, fileName: string, mimeType?: string): void => {
  let blob: Blob;
  if (file instanceof Blob) {
    blob = file;
  } else {
    if (!mimeType) {
      throw new Error('MIME-type må oppgis når filen er en ArrayBuffer');
    }
    blob = new Blob([file], { type: mimeType });
  }

  const objectUrl = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(objectUrl);
};
