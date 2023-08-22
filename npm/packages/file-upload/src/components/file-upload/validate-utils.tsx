import { MimeTypes } from '.';

export type SingleFileValidation = (firstParam: File, ...args: unknown[]) => true | string;
export type AllFilesValidation = (firstParam: FileList, ...args: unknown[]) => true | string;

/** react-hook-form filtype validering - trengs bare ved bruk av visuell dropzone - med dialog knapp holder det å bruke prop til FileUpload */
export const validateFileType = (validFileTypes: MimeTypes[], errorMessage: string): ((file: File) => string | true) => {
  return (file: File): string | true => {
    const filetype = file.type;
    if (validFileTypes.find(ft => ft === filetype)) {
      return true;
    }

    return errorMessage;
  };
};

/** react-hook-form filstørrelse validering */
export const validateFileSize = (minByteSize: number, maxByteSize: number, errorMessage: string): ((file: File) => true | string) => {
  return (file: File) => {
    const fileSize = file.size;
    if (fileSize < minByteSize || fileSize > maxByteSize) {
      return errorMessage;
    }

    return true;
  };
};

/** react-hook-form total filstørrelse validering */
export const validateTotalFileSize = (
  minByteSize: number,
  maxByteSize: number,
  errorMessage: string
): ((data: FileList) => true | string) => {
  return (data: FileList) => {
    let totalSize = 0;

    if (typeof data !== 'undefined' && data.length > 0) {
      for (const file of data) {
        totalSize += file.size;
      }
    }

    return totalSize < minByteSize || totalSize > maxByteSize ? errorMessage : true;
  };
};

/** react-hook-form antall filer validering */
export const validateNumberOfFiles = (minFiles: number, maxFiles: number, errorMessage: string): ((data: FileList) => true | string) => {
  return (data: FileList) => {
    if (typeof data !== 'undefined' && data.length >= minFiles && data.length <= maxFiles) {
      return true;
    } else {
      return errorMessage;
    }
  };
};
