import { MimeTypes, UploadedFile } from './index';

export const sizeIsValid = (file: File, size: number) => {
  if (file.size > size) {
    return false;
  }
  return true;
};

const getTotalFileSize = (total: number, file: UploadedFile): number => total + (file.size ?? 0);

export const totalSizeIsValid = (file: File, size: number, existing?: UploadedFile[]): boolean => {
  const totalFileSize = existing?.reduce(getTotalFileSize, 0) ?? 0;

  if (file.size + totalFileSize > size) {
    return false;
  }

  return true;
};

export const typeIsValid = (file: File, validFileTypes: Array<MimeTypes> | MimeTypes) => {
  if (Array.isArray(validFileTypes)) {
    if (validFileTypes.indexOf(file.type as MimeTypes) < 0) {
      return false;
    }
  } else if (validFileTypes !== file.type) {
    return false;
  }
  return true;
};

export const mimeTypeIsValid = (file: File, validMimeTypes: Array<string>) => {
  if (validMimeTypes.indexOf(file.type) < 0) {
    return false;
  }
  return true;
};
