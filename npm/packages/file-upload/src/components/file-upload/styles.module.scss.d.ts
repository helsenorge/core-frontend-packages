export type Styles = {
  dropzone: string;
  dropzone__deleteButton: string;
  dropzone__files: string;
  dropzone__files__file: string;
  dropzone__loader: string;
  dropzone__uploadButton: string;
  'dropzone__visual-dropzone': string;
  'dropzone__visual-dropzone__input': string;
  'dropzone__visual-dropzone__label': string;
  'dropzone__visual-dropzone__label--visible': string;
  'dropzone__visual-dropzone--dragover': string;
  'dropzone__visual-dropzone--visible': string;
  'dropzone__visual-dropzone--visible--error': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
