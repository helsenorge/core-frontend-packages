import * as React from 'react';

import classNames from 'classnames';

import Button from '@helsenorge/designsystem-react/components/Button';
import Icon from '@helsenorge/designsystem-react/components/Icon';
import ImgFile from '@helsenorge/designsystem-react/components/Icons/ImgFile';
import JpgFile from '@helsenorge/designsystem-react/components/Icons/JpgFile';
import PdfFile from '@helsenorge/designsystem-react/components/Icons/PdfFile';
import PngFile from '@helsenorge/designsystem-react/components/Icons/PngFile';
import RtfFile from '@helsenorge/designsystem-react/components/Icons/RtfFile';
import TrashCan from '@helsenorge/designsystem-react/components/Icons/TrashCan';
import WordDocument from '@helsenorge/designsystem-react/components/Icons/WordDocument';
import XmlFile from '@helsenorge/designsystem-react/components/Icons/XmlFile';
import Modal from '@helsenorge/designsystem-react/components/Modal';

import { theme } from '@helsenorge/designsystem-react';

import styles from './toolkitstyles.module.scss';

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
}

interface FileState {
  showDeleteLightbox: boolean;
}

const fileType = (fileName: string, className?: string) => {
  if (fileName) {
    const filetype = fileName.split('.')[1];
    switch (filetype) {
      case 'doc':
        return <Icon svgIcon={WordDocument} className={className} />;
      case 'jpg':
      case 'jpeg':
        return <Icon svgIcon={JpgFile} className={className} />;
      case 'pdf':
        return <Icon svgIcon={PdfFile} className={className} />;
      case 'png':
        return <Icon svgIcon={PngFile} className={className} />;
      case 'rtf':
        return <Icon svgIcon={RtfFile} className={className} />;
      case 'xml':
        return <Icon svgIcon={XmlFile} className={className} />;
      default:
        return <Icon svgIcon={ImgFile} className={className} />;
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
      this.state.showDeleteLightbox &&
      this.props.verifyDeleteText && (
        <Modal
          title={this.props.verifyDeleteText}
          secondaryButtonText={this.props.cancelText}
          primaryButtonText={this.props.confirmText}
          onSuccess={this.deleteFile}
          onClose={this.onDeleteLightboxClose}
        />
      )
    );
  };

  renderDeleteButton() {
    const { shouldRenderDeleteButton, loading, dontShowHardcodedText, deleteText, confirmDelete } = this.props;
    if (shouldRenderDeleteButton && !loading) {
      return (
        <Button
          variant="borderless"
          concept={'destructive'}
          wrapperClassName={classNames(styles.dropzone__deleteButton, {
            [`${this.props.customClass}__button`]: this.props.customClass,
          })}
          onClick={confirmDelete ? this.setConfirmDelete : this.deleteFile}
        >
          <Icon color={theme.palette.cherry500} svgIcon={TrashCan} />
          <>
            {deleteText}
            {!dontShowHardcodedText && 'Slett'}
          </>
        </Button>
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
