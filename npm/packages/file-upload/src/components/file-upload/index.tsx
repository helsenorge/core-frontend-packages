import * as React from 'react';

import classNames from 'classnames';

import Button from '@helsenorge/designsystem-react/components/Button';
import ErrorWrapper from '@helsenorge/designsystem-react/components/ErrorWrapper';
import Icon from '@helsenorge/designsystem-react/components/Icon';
import Upload from '@helsenorge/designsystem-react/components/Icons/Upload';
import { renderLabel } from '@helsenorge/designsystem-react/components/Label';
import Loader from '@helsenorge/designsystem-react/components/Loader';
import { usePseudoClasses } from '@helsenorge/designsystem-react/hooks/usePseudoClasses';
import { isMutableRefObject, mergeRefs } from '@helsenorge/designsystem-react/utils/refs';

import { FormMode, useUuid } from '@helsenorge/designsystem-react';

import FileElement, { Type } from './file';

import styles from './styles.module.scss';

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

export interface Props
  extends React.PropsWithChildren<{}>,
    Pick<React.InputHTMLAttributes<HTMLInputElement>, 'accept' | 'aria-describedby' | 'onChange'> {
  /** Filer som har gått gjennom validering */
  acceptedFiles?: UploadFile[];
  /** Filer som har feilet validering */
  rejectedFiles?: UploadFile[];
  /**  Unik Id for input elementet */
  inputId: string;
  /** Hides the delete button next to the files added */
  hideDeleteButton?: boolean;
  /**  event som trigges hvis man legger til en fil via input dialogen */
  onChangeFile?: OnChangeHandler;
  /**  event som trigges hvis man tar bort en fil */
  onDeleteFile?: OnDeleteHandler;
  /**  event som returerer lenke til fil */
  onRequestLink?: (fileId: string) => string;
  /**  event som trigges hvis man trykker på en fil */
  onOpenFile?: (fileId: string) => void;
  /**  className som plasseres på uploadButton */
  uploadButtonClassName?: string;
  /** Filer som er lagt til ved oppstart */
  defaultFiles?: UploadFile[];
  /**  Disabler opplasting */
  disabled?: boolean;
  /**  viser label for opplastningsknapp */
  label?: React.ReactNode;
  /** Navn på wrapper klasse */
  wrapperClasses?: string;
  /**  Bestemmer om error styling vises */
  error?: boolean;
  /**  Error melding - kan brukes hvis FormGroup ikke wrapper */
  errorText?: string;
  /** errorText-id */
  errorTextId?: string;
  /**  Legge til liste med tillatte filtyper */
  validFileTypes?: MimeTypes | Array<MimeTypes>;
  /**  Viser dropzone for dragndrop */
  visualDropZone?: boolean;
  /**  Egen tekst for status på dropzone */
  dropzoneStatusText?: string;
  /**  Egen Tekst for sletting av filer */
  deleteText?: string;
  /**  Egen bekreft sletting tekst */
  verifyDeleteText?: string;
  /**  Egen bekreft tekst */
  confirmText?: string;
  /**  Egen Avbryt tekst */
  cancelText?: string;
  /**  Slett fil? */
  confirmDelete?: boolean;
  /** viser Loader ved true */
  loading?: boolean;
  /** Eget hjelpeelement */
  helpElement?: React.ReactNode;
  /** Laste opp flere filer */
  shouldUploadMultiple?: boolean;
  /** Filelementklasse som også kan endre knapp link og svg */
  fileElementClassName?: string;
  /** Tekst som vises på knapp for å velge filer. Default tekst er "Velg filer" */
  chooseFilesText?: string;
  /** ClassName som plasseres på wrapper */
  wrapperClassName?: string;
  /** Id som benyttes for å hente ut hele Dropzone i automatiske tester */
  wrapperTestId?: string;
}

const FileUpload = React.forwardRef((props: Props, ref: React.Ref<HTMLInputElement>) => {
  const {
    acceptedFiles = [],
    rejectedFiles = [],
    cancelText,
    children,
    chooseFilesText,
    confirmDelete,
    confirmText,
    defaultFiles,
    deleteText,
    disabled,
    dropzoneStatusText,
    error,
    errorText,
    errorTextId,
    fileElementClassName,
    helpElement,
    hideDeleteButton,
    inputId,
    label,
    loading,
    onChangeFile,
    onDeleteFile,
    onOpenFile,
    onRequestLink,
    shouldUploadMultiple,
    uploadButtonClassName,
    validFileTypes,
    verifyDeleteText,
    visualDropZone,
    wrapperClassName,
    wrapperTestId,
    ...rest
  } = props;

  const [dragover, setDragover] = React.useState(false);
  const [calledFakeOnChange, setCalledFakeOnChange] = React.useState(false);
  const { refObject } = usePseudoClasses<HTMLInputElement>(isMutableRefObject(ref) ? ref : null);
  const mergedRefs = mergeRefs([ref, refObject]);
  const inputButtonId = inputId + '-button';
  const dropzoneTextId = inputId + 'dropzonetext';
  const errorTextUuid = useUuid(errorTextId);

  interface DragFileEvent extends React.DragEvent<HTMLInputElement> {
    target: EventTarget & { accept: string };
  }

  React.useEffect(() => {
    if (typeof defaultFiles !== 'undefined' && defaultFiles.length > 0) {
      const filteredDefaultFiles = getNewFiles(defaultFiles);
      setInputFiles(filteredDefaultFiles);
      setCalledFakeOnChange(true);
    }
  }, [defaultFiles]);

  React.useEffect(() => {
    calledFakeOnChange && triggerOnChangeEvent();
  }, [calledFakeOnChange]);

  /** Setter validFileTypes array til string format som <input/> forventer */
  const validFileTypesToString = (): string => {
    let validFileTypesString = '';

    if (Array.isArray(validFileTypes)) {
      validFileTypes.forEach((ft: string, i: number) => {
        validFileTypesString += i > 0 ? ',' + ft : ft;
      });
    } else {
      validFileTypesString += validFileTypes;
    }

    return validFileTypesString;
  };

  /** Filtrerer files og returnerer de vi ikke har fra før */
  const getNewFiles = (files: UploadFile[]): UploadFile[] => {
    files.forEach(f => typeof f.id === 'undefined' && (f.id = f.name));
    files.forEach(f => typeof f.fileSize === 'undefined' && (f.fileSize = f.size));
    const filteredNewFiles = acceptedFiles?.length ? files.filter(file => acceptedFiles.every(af => file.id !== af.id)) : files;
    return rejectedFiles?.length ? filteredNewFiles.filter(file => rejectedFiles.every(rf => file.id !== rf.id)) : filteredNewFiles;
  };

  /** Fyller inn <input/> med de nye filene */
  const setInputFiles = (files: UploadFile[]): void => {
    const dataTransfer = new DataTransfer();
    files.forEach(file => {
      dataTransfer.items.add(file);
    });
    if (refObject.current) {
      refObject.current.files = dataTransfer.files;
    }
  };

  /** Aktiverer onChange til <input/> elementet */
  const triggerOnChangeEvent = (): void => {
    if (refObject.current) {
      const event = new Event('change', { bubbles: true });
      refObject.current.dispatchEvent(event);
    }
  };

  /** Oppdaterer <input/> filer med onChange event sine filer eller internalFilesState hvis det er satt */
  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (!calledFakeOnChange && refObject && refObject.current && refObject.current.files) {
      const filteredNewFiles = getNewFiles([...refObject.current.files] as UploadFile[]);
      setInputFiles([...acceptedFiles, ...rejectedFiles, ...filteredNewFiles]);
      onChangeFile && onChangeFile(filteredNewFiles);
    } else {
      setCalledFakeOnChange(false);
    }

    props.onChange && props.onChange(event);
  };

  const onDropHandler = (e: DragFileEvent): void => {
    const filteredNewFiles = getNewFiles([...e.dataTransfer.files] as UploadFile[]);
    setInputFiles([...acceptedFiles, ...rejectedFiles, ...filteredNewFiles]);
    setCalledFakeOnChange(true);
    onChangeFile && onChangeFile(filteredNewFiles);
  };

  const onOpenClick = (): void => {
    refObject.current && refObject.current.click();
  };

  const onDeleteHandler = (fileId: string): void => {
    const newAcceptedFiles = acceptedFiles.filter(f => f.id !== fileId);
    const newRejectedFiles = rejectedFiles.filter(f => f.id !== fileId);
    setInputFiles([...newAcceptedFiles, ...newRejectedFiles]);
    setCalledFakeOnChange(true);
    onDeleteFile && onDeleteFile(fileId);
  };

  const renderUploadButton = (): React.JSX.Element | undefined => {
    return (
      <Button
        aria-describedby={[dropzoneTextId, props['aria-describedby'] || '', errorTextUuid].join(' ')}
        variant="borderless"
        concept={error ? 'destructive' : 'normal'}
        id={inputButtonId}
        disabled={disabled}
        onClick={onOpenClick}
        wrapperClassName={classNames(
          styles.dropzone__uploadButton,
          {
            [styles['dropzone__visual-dropzone__button--visible']]: !!visualDropZone,
          },
          uploadButtonClassName
        )}
      >
        <Icon svgIcon={Upload} />
        {chooseFilesText || 'Last opp'}
      </Button>
    );
  };

  const renderDropzone = (): React.JSX.Element => {
    return (
      <div
        onDrop={(e: DragFileEvent): void => {
          setDragover(false);
          onDropHandler(e);
        }}
        onDragEnter={(): void => {
          setDragover(true);
        }}
        onDragExit={(): void => {
          setDragover(false);
        }}
        className={classNames(styles['dropzone__visual-dropzone'], {
          [styles['dropzone__visual-dropzone--visible']]: !!visualDropZone,
          [styles['dropzone__visual-dropzone--visible--error']]: !!visualDropZone && !!error,
          [styles['dropzone__visual-dropzone--dragover']]: dragover,
        })}
      >
        {visualDropZone && renderUploadButton()}
        <span
          id={dropzoneTextId}
          className={classNames(styles['dropzone__visual-dropzone__label'], {
            [styles['dropzone__visual-dropzone__label--visible']]: !!visualDropZone,
          })}
        >
          {dropzoneStatusText}
        </span>
        <input
          id={inputId}
          className={styles['dropzone__visual-dropzone__input']}
          type="file"
          ref={mergedRefs}
          multiple={shouldUploadMultiple}
          accept={validFileTypesToString()}
          {...rest}
          onChange={onChangeHandler}
        />
      </div>
    );
  };

  const renderFiles = (): React.JSX.Element | undefined => {
    if (rejectedFiles.length === 0 && acceptedFiles.length === 0) return;

    return (
      <ul className={styles.dropzone__files}>
        {rejectedFiles &&
          rejectedFiles.map((rf, i) => (
            <FileElement
              key={rf.name + i}
              fileId={rf.id}
              type={Type.rejected}
              fileName={rf.name}
              loading={!!loading}
              shouldRenderDeleteButton
              deleteFile={onDeleteHandler}
              onOpenFile={onOpenFile}
              onRequestLink={onRequestLink}
              deleteText={deleteText}
              verifyDeleteText={verifyDeleteText}
              confirmText={confirmText}
              cancelText={cancelText}
              confirmDelete={confirmDelete}
              dontShowHardcodedText={!!deleteText}
              customClass={fileElementClassName}
            />
          ))}
        {acceptedFiles &&
          acceptedFiles.map((af, i) => (
            <FileElement
              key={`${af.name}${i}`}
              fileId={af.id}
              type={Type.verified}
              fileName={af.name}
              loading={!!loading}
              shouldRenderDeleteButton={!hideDeleteButton}
              deleteFile={onDeleteHandler}
              onOpenFile={onOpenFile}
              onRequestLink={onRequestLink}
              deleteText={deleteText}
              verifyDeleteText={verifyDeleteText}
              confirmText={confirmText}
              cancelText={cancelText}
              confirmDelete={confirmDelete}
              dontShowHardcodedText={!!deleteText}
              customClass={fileElementClassName}
            />
          ))}
      </ul>
    );
  };

  const wrapperClasses = classNames(styles.dropzone, wrapperClassName);

  return (
    <ErrorWrapper errorText={errorText} errorTextId={errorTextUuid}>
      <div className={wrapperClasses} data-testid={wrapperTestId}>
        {renderLabel(label, inputButtonId, FormMode.onwhite)}
        {helpElement}
        {loading && <Loader size={'tiny'} className={styles.dropzone__loader} />}
        {renderFiles()}
        {!visualDropZone && renderUploadButton()}
        {renderDropzone()}
        {children}
      </div>
    </ErrorWrapper>
  );
});

FileUpload.displayName = 'FileUpload';

export default FileUpload;
