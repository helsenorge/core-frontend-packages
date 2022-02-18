import * as React from 'react';
import classNames from 'classnames';
import { FunctionButton } from '@helsenorge/toolkit/components/buttons/function-button';
import { ConfirmBox } from '@helsenorge/toolkit/components/confirmbox';
import Delete from '@helsenorge/toolkit/components/icons/Delete';
import FormatJPG from '@helsenorge/toolkit/components/icons/FormatJPG';
import FormatPNG from '@helsenorge/toolkit/components/icons/FormatPNG';
import FormatPDF from '@helsenorge/toolkit/components/icons/FormatPDF';
import FormatWORD from '@helsenorge/toolkit/components/icons/FormatWORD';
import FormatRTF from '@helsenorge/toolkit/components/icons/FormatRTF';
import FormatXML from '@helsenorge/toolkit/components/icons/FormatXML';
import FormatAny from '@helsenorge/toolkit/components/icons/FormatAny';

import styles from './toolkitstyles.module.scss';
import { SvgIconProps } from '@helsenorge/toolkit/components/icons/SvgIcon';

export enum Type {
  verified = 'verified',
  rejected = 'rejected',
}
interface FileProps {
  loading: boolean;
  shouldRenderDeleteButton: boolean;
  deleteFile?: (fileId: string) => void;
  onRequestLink?: (fileId: string) => string;
  onOpenFile?: (fileId: string) => void;
  customClass?: string;
  fileId?: string;
  fileName: string;
  type: Type;
  deleteText?: string;
  verifyDeleteText?: string;
  confirmText?: string;
  cancelText?: string;
  confirmDelete?: boolean;
  dontShowHardcodedText?: boolean;
  confirmDeleteClassName?: string;
}

interface FileState {
  showDeleteLightbox: boolean;
}

const fileType = (fileName: string, className?: string) => {
  if (fileName) {
    const filetype = fileName.split('.')[1];
    const props = { className: className, size: 'large' } as SvgIconProps;
    switch (filetype) {
      case 'doc':
        return <FormatWORD {...props} />;
      case 'jpg':
      case 'jpeg':
        return <FormatJPG {...props} />;
      case 'pdf':
        return <FormatPDF {...props} />;
      case 'png':
        return <FormatPNG {...props} />;
      case 'rtf':
        return <FormatRTF {...props} />;
      case 'xml':
        return <FormatXML {...props} />;
      default:
        return <FormatAny {...props} />;
    }
  } else return '';
};

export default class FileElement extends React.Component<FileProps, FileState> {
  constructor(props: FileProps) {
    super(props);
    this.state = {
      showDeleteLightbox: false,
    };
    this.handleClick = this.handleClick.bind(this);
    this.renderDeleteButton = this.renderDeleteButton.bind(this);
    this.deleteFile = this.deleteFile.bind(this);
  }

  handleClick(event: React.FormEvent<{}>): void {
    const { fileId, onOpenFile } = this.props;
    if (onOpenFile && fileId) {
      onOpenFile(fileId);
    }
    if (event) {
      event.preventDefault();
    }
  }

  deleteFile() {
    if (this.props.deleteFile) {
      return this.props.deleteFile(this.props.fileId ? this.props.fileId : '');
    }
  }
  setConfirmDelete = () => {
    this.setState({ showDeleteLightbox: true });
  };
  onDeleteLightboxClose = () => {
    this.setState({ showDeleteLightbox: false });
  };

  renderConfirmDelete = () => {
    return (
      this.state.showDeleteLightbox && (
        <ConfirmBox
          wrapperClassName={this.props.confirmDeleteClassName}
          onClose={this.onDeleteLightboxClose}
          noCloseButton={false}
          closeText={this.props.cancelText}
          confirmText={this.props.confirmText}
          onConfirm={this.deleteFile}
          onCancel={this.onDeleteLightboxClose}
        >
          <h4>{this.props.verifyDeleteText}</h4>
        </ConfirmBox>
      )
    );
  };

  renderDeleteButton() {
    const { shouldRenderDeleteButton, loading, dontShowHardcodedText, deleteText, confirmDelete } = this.props;
    if (shouldRenderDeleteButton && !loading) {
      return (
        <FunctionButton
          svgIcon={<Delete variant={'error'} />}
          className={classNames(styles.dropzone__deleteButton, {
            [`${this.props.customClass}__button`]: this.props.customClass,
          })}
          onClick={confirmDelete ? this.setConfirmDelete : this.deleteFile}
        >
          <React.Fragment>
            {deleteText}
            {!dontShowHardcodedText && 'Slett'}
          </React.Fragment>
        </FunctionButton>
      );
    }
  }

  renderFile() {
    const { loading, fileId, fileName, onRequestLink } = this.props;

    if (!loading) {
      const attachmentLink: string = onRequestLink && fileId ? onRequestLink(fileId) : '';
      if (attachmentLink) {
        return (
          <a
            href={attachmentLink}
            className={classNames({
              [`${this.props.customClass}__link`]: this.props.customClass,
            })}
            onClick={this.handleClick}
          >
            {fileName}
          </a>
        );
      }
      return fileName;
    }
  }

  render(): JSX.Element | null {
    return (
      <React.Fragment>
        <li
          className={classNames({
            [styles['dropzone__files__file']]: !this.props.customClass,
            [`${this.props.customClass}`]: this.props.customClass,
            [`${this.props.customClass}--${this.props.type}`]: this.props.customClass,
          })}
        >
          {fileType(
            this.props.fileName,
            classNames({
              [`${this.props.customClass}__svgicon`]: this.props.customClass,
            })
          )}
          {this.renderFile()}
          {this.renderDeleteButton()}
        </li>
        {this.props.confirmDelete && this.renderConfirmDelete()}
      </React.Fragment>
    );
  }
}
