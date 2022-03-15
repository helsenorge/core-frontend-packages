import * as React from 'react';
import { shallow } from 'enzyme';
import Dropzone, { UploadedFile } from '../index';

describe('Dropzone', () => {
  it('Dropzone renders without crashing', () => {
    shallow(
      <Dropzone
        id="id"
        onDrop={() => {
          /* tom */
        }}
      />
    );
  });

  it('renders children', () => {
    const wrapper = shallow(
      <Dropzone
        id="id"
        onDrop={() => {
          /* tom */
        }}
      >
        <div>{'children'}</div>
      </Dropzone>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('renders uploaded files', () => {
    const uploadedFiles: UploadedFile[] = [
      {
        id: 'id1',
        name: 'name1',
      },
      {
        id: 'id2',
        name: 'name2',
      },
    ];

    const wrapper = shallow(
      <Dropzone
        id="id"
        onDrop={() => {
          /* tom */
        }}
        shouldUploadMultiple={true}
        uploadedFiles={uploadedFiles}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});

describe('Dropzone validation rules', () => {
  it('should validate according to validation rules for required, multiple, minFiles, maxFiles and number of uploaded files', () => {
    multiDropzone().withRequired(false).shouldBeValid();
    multiDropzone().withRequired(false).withFiles(1).shouldBeValid();

    multiDropzone().withRequired(true).shouldBeInvalid();
    multiDropzone().withRequired(true).withFiles(1).shouldBeValid();

    multiDropzone().withRequired(false).withMulti(true).shouldBeValid();
    multiDropzone().withRequired(false).withMulti(true).withFiles(1).shouldBeValid();
    multiDropzone().withRequired(false).withMulti(true).withFiles(3).shouldBeValid();

    multiDropzone().withRequired(true).withMulti(true).shouldBeInvalid();
    multiDropzone().withRequired(true).withMulti(true).withFiles(1).shouldBeValid();
    multiDropzone().withRequired(true).withMulti(true).withFiles(3).shouldBeValid();

    multiDropzone().withRequired(false).withMulti(true).withMinFiles(2).shouldBeValid();
    multiDropzone().withRequired(false).withMulti(true).withMinFiles(2).withFiles(1).shouldBeInvalid();
    multiDropzone().withRequired(false).withMulti(true).withMinFiles(2).withFiles(2).shouldBeValid();
    multiDropzone().withRequired(false).withMulti(true).withMinFiles(2).withFiles(3).shouldBeValid();

    multiDropzone().withRequired(true).withMulti(true).withMinFiles(2).shouldBeInvalid();
    multiDropzone().withRequired(true).withMulti(true).withMinFiles(2).withFiles(1).shouldBeInvalid();
    multiDropzone().withRequired(true).withMulti(true).withMinFiles(2).withFiles(2).shouldBeValid();

    multiDropzone().withRequired(false).withMulti(true).withMaxFiles(2).shouldBeValid();
    multiDropzone().withRequired(false).withMulti(true).withMaxFiles(2).withFiles(1).shouldBeValid();
    multiDropzone().withRequired(false).withMulti(true).withMaxFiles(2).withFiles(2).shouldBeValid();
    multiDropzone().withRequired(false).withMulti(true).withMaxFiles(2).withFiles(3).shouldBeInvalid();

    multiDropzone().withRequired(true).withMulti(true).withMaxFiles(2).shouldBeInvalid();
    multiDropzone().withRequired(true).withMulti(true).withMaxFiles(2).withFiles(1).shouldBeValid();
    multiDropzone().withRequired(true).withMulti(true).withMaxFiles(2).withFiles(2).shouldBeValid();
    multiDropzone().withRequired(true).withMulti(true).withMaxFiles(2).withFiles(3).shouldBeInvalid();
  });
});

class MultiDropzoneTester {
  private isRequired: boolean;
  private isMulti: boolean;
  private minFiles: number | undefined;
  private maxFiles: number | undefined;
  private files: UploadedFile[] | undefined;

  withRequired(required: boolean): MultiDropzoneTester {
    this.isRequired = required;
    return this;
  }

  withMulti(multi: boolean): MultiDropzoneTester {
    this.isMulti = multi;
    return this;
  }

  withMinFiles(minFiles: number): MultiDropzoneTester {
    this.minFiles = minFiles;
    return this;
  }

  withMaxFiles(maxFiles: number): MultiDropzoneTester {
    this.maxFiles = maxFiles;
    return this;
  }

  withFiles(num: number): MultiDropzoneTester {
    this.files = this.createFiles(num);
    return this;
  }

  private createFiles(num: number): UploadedFile[] {
    const files = [] as UploadedFile[];
    for (let i = 0; i < num; i++) {
      files.push({ name: `file.${i}`, id: `${i}` });
    }
    return files;
  }

  private mountAndValidate() {
    const wrapper = shallow(
      <Dropzone
        id="1"
        onDrop={() => null}
        isRequired={this.isRequired}
        shouldUploadMultiple={this.isMulti}
        minFiles={this.minFiles}
        maxFiles={this.maxFiles}
        uploadedFiles={this.files}
      />
    );

    const dropzone: Dropzone = wrapper.instance() as Dropzone;
    dropzone.validateField();
    return dropzone;
  }

  shouldBeValid() {
    const dropzone = this.mountAndValidate();
    expect(dropzone.isValid()).toBeTruthy();
  }

  shouldBeInvalid() {
    const dropzone = this.mountAndValidate();
    expect(dropzone.isValid()).toBeFalsy();
  }
}

function multiDropzone() {
  return new MultiDropzoneTester();
}
