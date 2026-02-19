export class UploadFile extends File {
  id: string;
  fileSize: number;

  constructor(fileBits: BlobPart[], fileName: string, id?: string, fileSize?: number, options?: FilePropertyBag) {
    super(fileBits, fileName, options);
    this.id = id || fileName;
    this.fileSize = fileSize || this.size;
  }
}

export type MimeTypes =
  | 'image/jpeg'
  | 'image/jpg'
  | 'image/png'
  | 'application/pdf'
  | 'image/gif'
  | 'image/tiff'
  | 'image/bmp'
  | 'image/tif';

export type OnChangeHandler = (files: UploadFile[]) => void;

export type OnDeleteHandler = (fileId: string) => void;
