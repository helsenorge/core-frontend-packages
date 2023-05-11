import { MimeTypes, UploadedFile } from './index';

export const sizeIsValid = (file: File, size: number) => {
  if (file.size > size) {
    return false;
  }
  return true;
};

export const totalSizeIsValid = (maxSize: number, acceptedFiles?: File[], existingFiles?: UploadedFile[]): boolean => {
  let totalFileSize = 0;

  const newAcceptedFiles = acceptedFiles?.filter(function (acceptedFile) {
    const isNewFile = !existingFiles?.some(existingFile => {
      return acceptedFile.name == existingFile.name;
    });
    return isNewFile;
  });

  existingFiles?.forEach(function (file) {
    totalFileSize += file.size ?? 0;
  });

  newAcceptedFiles?.forEach(function (file) {
    totalFileSize += file.size ?? 0;
  });

  if (totalFileSize > maxSize) {
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
