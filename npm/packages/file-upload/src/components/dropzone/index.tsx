import * as React from 'react';

import classNames from 'classnames';
import OriginalDropzone, { FileRejection, DropEvent } from 'react-dropzone';

import Button from '@helsenorge/designsystem-react/components/Button';
import Icon from '@helsenorge/designsystem-react/components/Icons';
import Upload from '@helsenorge/designsystem-react/components/Icons/Upload';
import Loader from '@helsenorge/designsystem-react/components/Loader';
import NotificationPanel from '@helsenorge/designsystem-react/components/NotificationPanel';

import ValidationError from '@helsenorge/form/components/form/validation-error';
import { Label } from '@helsenorge/form/components/label';

import FileElement, { Type } from './file';
import { sizeIsValid, typeIsValid, mimeTypeIsValid, totalSizeIsValid } from './validation';

import styles from './toolkitstyles.module.scss';

export interface TextMessage {
  Title: string;
  Body: string;
}

export interface UploadedFile {
  id?: string;
  size?: number;
  name: string;
}

export interface DropzoneState {
  rejectedFiles?: File[];
  isValid: boolean;
  loading: boolean;
  dragover: boolean;
  errormessage?: TextMessage | null;
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

export type OnDropHandler = (
  file: Array<File>,
  cb?: (success: boolean, errormessage: TextMessage | null, uploadedFile?: UploadedFile) => void
) => void;

export type OnDeleteHandler = (fileId: string, cb: (success: boolean, errormessage: TextMessage | null, url?: string) => void) => void;

export interface Props {
  /**  Unik Id for Dropzone */
  id: string;
  /**  event som trigges hvis man legger til en fil */
  onDrop: OnDropHandler;
  /**  event som trigges hvis man tar bort en fil */
  onDelete?: OnDeleteHandler;
  /**  event som returerer lenke til fil */
  onRequestLink?: (fileId: string) => string;
  /**  event som trigges hvis man trykker på en fil */
  onOpenFile?: (fileId: string) => void;
  /**  Event som returerer om filer er validert eller ikke */
  onValidated?: (valid: boolean | undefined) => void;
  /**  Navn på opplastings knapp */
  uploadButtonText?: string;
  /**  event som trigges hvis man tar bort en fil */
  uploadButtonClassName?: string;
  /**  Disabler opplasting */
  disabled?: boolean;
  /**  viser label for opplastningsknapp */
  label?: string | JSX.Element;
  /** Teksten til sub label, brukes som enkel hjelpetekst. Sublabel legges som et eget blokk-element nederst i <label> til dette feltet */
  subLabel?: string | JSX.Element;
  /** Navn på wrapper klasse */
  wrapperClasses?: string;
  /**  Error melding */
  errorMessage?: string | ((file?: File) => string);
  /**  Legge til liste med egne filtyper */
  validFileTypes?: MimeTypes | Array<MimeTypes>;
  /**  Legge til liste med egne mimetypes */
  validMimeTypes?: Array<string>;
  /**  Egen tekst for filformat */
  supportedFileFormatsText?: string;
  /**  Max størrelse på fil */
  maxFileSize?: number;
  /**  Max samlet størrelse på filer */
  totalMaxFileSize?: number;
  /**  setter om filopplastingen er nødvendig for å fortsette */
  isRequired?: boolean;
  /** Setter label tekst for nødvendig  */
  requiredLabel?: string;
  /**  viser nødvendig label */
  showRequiredLabel?: boolean;
  /** Setter opplastet filer  */
  uploadedFiles?: UploadedFile[];
  /** setter om er valgfri label tekst */
  optionalLabel?: string;
  /** setter om er valgfri label skal vises */
  showOptionalLabel?: boolean;
  /**  Viser dropzone for dragndrop */
  visualDropZone?: boolean;
  /**  Egen tekst for status på dropzone */
  dropzoneStatusText?: string;
  /**  Egen Tekst for sletting av filer */
  deleteText?: string;
  /**  Egen bekreft sletting tekst */
  verifyDeleteText?: string;
  /** Innhold som vises i komponentet */
  children?: React.ReactNode;
  /**  Egen bekreft tekst */
  confirmText?: string;
  /**  Egen Avbryt tekst */
  cancelText?: string;
  /**  Slett fil? */
  confirmDelete?: boolean;
  /**  Ikke vis hardkodet tekst */
  dontShowHardcodedText?: boolean;
  /** Ikke vis lastespinner */
  noSpinner?: boolean;
  /** Eget Hjelpeknapp */
  helpButton?: JSX.Element;
  /** Eget hjelpeelement */
  helpElement?: JSX.Element;
  /** Laste opp flere filer */
  shouldUploadMultiple?: boolean;
  /** minimum av filer */
  minFiles?: number;
  /** Maximum av filer */
  maxFiles?: number;
  /** Filelementklasse som også kan endre knapp link og svg: .myclass{
       padding:10px;
    
     &__link{
        text-decoration:none;
      }
      &__button{
        padding:10px;
      }
      &__svgicon{
        width:100px;
      }
    &--verified{
        background:green;
      }
      &--rejected{
        background:red;
      } } */
  fileElementClassName?: string;
  /** Tekst som vises på knapp for å velge filer. Default tekst er "Velg filer" */
  chooseFilesText?: string;
  /** Id som benyttes for å hente ut hele Dropzone i automatiske tester */
  wrapperTestId?: string;
  /** Id som benyttes for å hente ut ValidationError i automatiske tester */
  validationTestId?: string;
  /** Id som benyttes for å hente ut MessageBox i automatiske tester */
  messageBoxTestId?: string;
  /** Id som benyttes for å hente ut Label i automatiske tester */
  labelTestId?: string;
  /** Id som benyttes for å hente ut FunctionButton i automatiske tester */
  functionButtonTestId?: string;
  /** Id som benyttes for å hente ut FileElement i automatiske tester */
  fileElementTestId?: string;
  /** Id som benyttes for å hente ut OriginalDropzone i automatiske tester */
  originalDropzoneTestId?: string;
}

export interface DropzoneCtrl extends HTMLElement {
  open: () => void;
}
export default class Dropzone extends React.Component<Props, DropzoneState> {
  ctrls: {
    dropzone?: DropzoneCtrl;
  } = {};

  constructor(props: Props) {
    super(props);

    this.state = {
      rejectedFiles: [],
      loading: false,
      isValid: true,
      dragover: false,
    };
  }

  onDrop = (acceptedFiles: File[], _fileRejections: FileRejection[], event: DropEvent): void => {
    if (event && event.preventDefault) {
      event.preventDefault();
    }

    const existingFiles = this.props.uploadedFiles;
    const newAcceptedFiles = acceptedFiles?.filter(function (acceptedFile) {
      const isNewFile = !existingFiles?.some(existingFile => {
        return acceptedFile.name == existingFile.name;
      });
      return isNewFile;
    });

    const rejected: File[] = [];
    const uploaded: File[] = [];

    for (const f of newAcceptedFiles) {
      if (this.validateFile(f)) {
        uploaded.push(f);
      } else {
        rejected.push(f);
      }
    }

    if (uploaded.length > 0) {
      this.setState({ loading: true });
      this.props.onDrop(uploaded, (success, errormessage) => {
        if (success) {
          this.setState({ loading: false, rejectedFiles: rejected }, () => {
            this.validateOnDrop(newAcceptedFiles);
          });
        } else {
          this.setState({
            loading: false,
            rejectedFiles: rejected,
            errormessage: errormessage,
          });
        }
      });
    } else {
      this.setState({ rejectedFiles: rejected }, () => {
        this.validateOnDrop(newAcceptedFiles);
      });
    }
  };

  onDelete = (fileId: string) => {
    if (this.props.onDelete) {
      this.setState({ loading: true });
      this.props.onDelete(fileId, success => {
        if (success) {
          this.setState({ loading: false }, this.validateOnDelete);
        } else {
          this.setState({ loading: false });
        }
      });
    }
  };

  deleteRejected = (fileId: string) => {
    if (this.state.rejectedFiles) {
      const newRejectedFiles = this.state.rejectedFiles.filter(f => f.name !== fileId);
      this.setState({ rejectedFiles: newRejectedFiles }, this.validateOnDrop);
    }
  };

  updateValid = (valid: boolean) => {
    return new Promise<void>((resolve: () => void) => {
      this.setState({ isValid: valid }, () => {
        if (this.props.onValidated) {
          this.props.onValidated(valid);
        }
        resolve();
      });
    });
  };

  // Blir kalt på submit i form
  validateField = () => {
    const validRejected = this.validateRejectedFiles();
    const validRequired = this.validateRequired();
    const validMin = this.validateMin();
    const validMax = this.validateMax();

    return this.updateValid(validRejected && validRequired && validMin && validMax);
  };

  validateOnDrop = (acceptedFiles?: File[]) => {
    const validRejected = this.validateRejectedFiles();
    const validMax = this.validateMax();

    const validMaxTotalSize = this.validateMaxTotalSize(acceptedFiles);

    return this.updateValid(validRejected && validMax && validMaxTotalSize);
  };

  validateOnDelete = () => {
    const validMaxTotalSize = this.validateMaxTotalSize();

    return this.updateValid(validMaxTotalSize);
  };

  validateRejectedFiles = () => {
    if (this.state.rejectedFiles && this.state.rejectedFiles.length > 0) return false;
    return true;
  };

  validateRequired = () => {
    if (!this.props.isRequired) return true;
    if (!this.props.uploadedFiles) return false;
    if (!this.props.shouldUploadMultiple) {
      return this.props.uploadedFiles.length === 1;
    }
    return this.props.uploadedFiles.length > 0;
  };

  validateMaxTotalSize = (acceptedFiles?: File[]) => {
    let valid = true;
    if (this.props.totalMaxFileSize) {
      valid = totalSizeIsValid(this.props.totalMaxFileSize, acceptedFiles, this.props.uploadedFiles);
    }
    return valid;
  };

  validateMin = () => {
    if (
      this.props.minFiles &&
      this.props.uploadedFiles &&
      this.props.uploadedFiles.length > 0 &&
      this.props.uploadedFiles.length < this.props.minFiles
    )
      return false;
    return true;
  };

  validateMax = () => {
    if (this.props.maxFiles && this.props.uploadedFiles && this.props.uploadedFiles.length > this.props.maxFiles) return false;
    return true;
  };

  validateFile = (file: File) => {
    let valid = true;
    if (this.props.maxFileSize) {
      valid = valid && sizeIsValid(file, this.props.maxFileSize);
    }
    if (this.props.validFileTypes) {
      valid = valid && typeIsValid(file, this.props.validFileTypes);
    }
    if (this.props.validMimeTypes) {
      valid = valid && mimeTypeIsValid(file, this.props.validMimeTypes);
    }

    return valid;
  };

  renderValidationErrorMessage() {
    let error = '';

    if (this.props.errorMessage && this.state.rejectedFiles) {
      error = typeof this.props.errorMessage === 'string' ? this.props.errorMessage : this.props.errorMessage(this.state.rejectedFiles[0]);
    }
    return <ValidationError isValid={this.state.isValid} error={error} testId={this.props.validationTestId} />;
  }

  renderErrorMessage() {
    if (this.state.errormessage) {
      return (
        <div className={styles.dropzone__errormessage}>
          <NotificationPanel variant={'alert'} label={this.state.errormessage.Title} testId={this.props.messageBoxTestId}>
            <p>{this.state.errormessage.Body}</p>
          </NotificationPanel>
        </div>
      );
    }
  }

  isValid() {
    return this.state.isValid;
  }

  onOpenClick = () => {
    if (this.ctrls.dropzone) this.ctrls.dropzone.open();
  };

  renderLabel = () => {
    if (this.props.label !== undefined) {
      const labelText = (
        <React.Fragment>
          {this.props.label}
          {this.props.isRequired && this.props.requiredLabel && this.props.showRequiredLabel ? <em> {this.props.requiredLabel}</em> : ''}
          {!this.props.isRequired && this.props.optionalLabel && this.props.showOptionalLabel ? <em> {this.props.optionalLabel}</em> : ''}
        </React.Fragment>
      );

      return (
        <Label
          labelText={labelText}
          htmlFor={this.props.id}
          sublabelText={this.props.subLabel}
          testId={this.props.labelTestId}
          helpButton={this.props.helpButton}
        />
      );
    }
    return null;
  };

  renderHelp = () => {
    if (this.props.helpElement) {
      return this.props.helpElement;
    }

    return null;
  };

  renderSupportedFormats = () => {
    if (this.props.supportedFileFormatsText) {
      return <div className={styles.dropzone__acceptedFormats}>{this.props.supportedFileFormatsText}</div>;
    }
    return null;
  };

  renderUploadButton = () => {
    if (this.shouldRenderUploadButton()) {
      return (
        <Button
          variant="borderless"
          id={this.props.id}
          disabled={this.props.disabled}
          onClick={this.onOpenClick}
          className={`${styles.dropzone__uploadButton} ${this.props.uploadButtonClassName}`}
          testId={this.props.functionButtonTestId}
        >
          <Icon svgIcon={Upload} />
          {this.props.uploadButtonText}
        </Button>
      );
    }
  };

  shouldRenderUploadButton = (): boolean => {
    if (this.state.loading) return false;

    const numAcceptedFiles = this.props.uploadedFiles ? this.props.uploadedFiles.length : 0;
    const numRejectedFiles = this.state.rejectedFiles ? this.state.rejectedFiles.length : 0;

    if (!this.props?.shouldUploadMultiple) {
      return numAcceptedFiles + numRejectedFiles === 0;
    }

    if (this.props.maxFiles) {
      return numAcceptedFiles + numRejectedFiles < this.props.maxFiles;
    }

    return true;
  };

  hasUploadedFiles = (): boolean => {
    return this.props.uploadedFiles && this.props.uploadedFiles.length > 0 ? true : false;
  };

  renderDropzone = () => {
    return (
      <OriginalDropzone
        ref={(control: DropzoneCtrl) => (this.ctrls.dropzone = control)}
        onDrop={this.onDrop}
        onDragOver={() => this.setState({ dragover: true })}
        onDragLeave={() => this.setState({ dragover: false })}
        multiple={!!this.props?.shouldUploadMultiple}
      >
        {({ getRootProps, getInputProps }) => (
          <div
            className={classNames(
              styles['dropzone__visual-dropzone'],
              {
                [styles['dropzone__visual-dropzone--visible']]: !!this.props.visualDropZone,
              },
              {
                [styles['dropzone__visual-dropzone--dragover']]: this.state.dragover,
              }
            )}
            data-testid={this.props.originalDropzoneTestId}
            {...getRootProps()}
          >
            <button
              className={classNames(styles['dropzone__visual-dropzone__button'], {
                [styles['dropzone__visual-dropzone__button--visible']]: !!this.props.visualDropZone,
              })}
              type="button"
              onClick={() => open}
            >
              {this.props.chooseFilesText || 'Velg filer'}
            </button>
            <label
              htmlFor={`${this.props.id}-files`}
              className={classNames(styles['dropzone__visual-dropzone__label'], {
                [styles['dropzone__visual-dropzone__label--visible']]: !!this.props.visualDropZone,
              })}
            >
              {this.props.dropzoneStatusText || 'Last opp fil'}{' '}
            </label>
            <input id={`${this.props.id}-files`} {...getInputProps()} />
          </div>
        )}
      </OriginalDropzone>
    );
  };

  renderSpinner() {
    if (this.state.loading && !this.props.noSpinner) {
      return <Loader size={'tiny'} className={styles.dropzone__loader} />;
    }
  }

  renderFiles() {
    const rejectedFiles = [];
    const uploadedFiles = [];

    if (this.state.rejectedFiles) {
      let count = 0;
      for (const r of this.state.rejectedFiles) {
        rejectedFiles.push(
          <FileElement
            key={r.name + count++}
            fileId={r.name}
            type={Type.rejected}
            fileName={r.name}
            loading={this.state.loading}
            shouldRenderDeleteButton
            deleteFile={this.deleteRejected}
            onOpenFile={this.props.onOpenFile}
            onRequestLink={this.props.onRequestLink}
            deleteText={this.props.deleteText}
            verifyDeleteText={this.props.verifyDeleteText}
            confirmText={this.props.confirmText}
            cancelText={this.props.cancelText}
            confirmDelete={this.props.confirmDelete}
            dontShowHardcodedText={this.props.dontShowHardcodedText}
            customClass={this.props.fileElementClassName}
          />
        );
      }
    }
    if (this.props.uploadedFiles) {
      let count = 0;
      for (const u of this.props.uploadedFiles) {
        uploadedFiles.push(
          <FileElement
            key={`${u.id}${count++}`}
            fileId={u.id}
            type={Type.verified}
            fileName={u.name}
            loading={this.state.loading}
            shouldRenderDeleteButton={this.props.onDelete ? true : false}
            deleteFile={this.onDelete}
            onOpenFile={this.props.onOpenFile}
            onRequestLink={this.props.onRequestLink}
            deleteText={this.props.deleteText}
            verifyDeleteText={this.props.verifyDeleteText}
            confirmText={this.props.confirmText}
            cancelText={this.props.cancelText}
            confirmDelete={this.props.confirmDelete}
            dontShowHardcodedText={this.props.dontShowHardcodedText}
            customClass={this.props.fileElementClassName}
          />
        );
      }
    }

    if (rejectedFiles.length !== 0 || uploadedFiles.length !== 0) {
      return (
        <ul className={styles.dropzone__files}>
          {rejectedFiles}
          {uploadedFiles}
        </ul>
      );
    }
  }

  render(): JSX.Element {
    const wrapperClasses: string = classNames(styles.dropzone, 'mol_validation', this.props.wrapperClasses, {
      'mol_validation--active': !this.state.isValid,
    });

    return (
      <div className={wrapperClasses} id={`${this.props.id}-wrapper`} data-testid={this.props.wrapperTestId}>
        {this.renderValidationErrorMessage()}
        {this.renderLabel()}
        {this.renderHelp()}
        {this.renderSupportedFormats()}
        {this.renderSpinner()}
        {this.renderFiles()}
        {this.renderUploadButton()}
        {this.renderErrorMessage()}
        {this.renderDropzone()}
        {this.props.children}
      </div>
    );
  }
}
