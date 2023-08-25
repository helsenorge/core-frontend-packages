import React from 'react';

import { FieldValues, RegisterOptions, UseFormRegister, UseFormRegisterReturn, ValidateResult } from 'react-hook-form';

import { AllFilesValidation, SingleFileValidation } from './validate-utils';

import { UploadFile } from '.';

type UseFileUploadReturn<T extends FieldValues> = {
  // eslint-disable-next-line
  register: UseFormRegister<T>;
  acceptedFiles: UploadFile[];
  setAcceptedFiles: React.Dispatch<React.SetStateAction<UploadFile[]>>;
  rejectedFiles: UploadFile[];
  setRejectedFiles: React.Dispatch<React.SetStateAction<UploadFile[]>>;
};

/**
 * En hook som gjør det lettere å bruke react-hook-form med FileUpload.
 * Send inn register fra useForm() og validation reglene som skal brukes.
 * @returns register, acceptedFiles, setAcceptedFiles, rejectedFiles, setRejectedFiles
 */
export const useFileUpload = <T extends FieldValues>(
  register: UseFormRegister<T>,
  validationSingleFileRulesList?: SingleFileValidation[],
  validationAllFilesRulesList?: AllFilesValidation[]
): UseFileUploadReturn<T> => {
  const [acceptedFiles, setAcceptedFiles] = React.useState<UploadFile[]>([]);
  const [rejectedFiles, setRejectedFiles] = React.useState<UploadFile[]>([]);

  const validateFiles = (data: UploadFile[]): true | string => {
    const newAcceptedFiles: UploadFile[] = [];
    const newRejectedFiles: UploadFile[] = [];
    let validateResponse: true | string = true;

    // validationSingleFileRulesList kjøres per fil, og beholder første feilmelding i listen
    for (const file of data) {
      let singleValidateResponse: true | string = true;

      validationSingleFileRulesList &&
        validationSingleFileRulesList.forEach(vf => {
          typeof singleValidateResponse !== 'string' && (singleValidateResponse = vf(file));
        });

      if (typeof singleValidateResponse === 'string') {
        newRejectedFiles.push(file);
        typeof validateResponse !== 'string' && (validateResponse = singleValidateResponse);
      } else {
        newAcceptedFiles.push(file);
      }
    }

    // validationAllFilesRulesList kjøres på alle filene og setter første feilmelding hvis den ikke allerede er satt
    validationAllFilesRulesList &&
      validationAllFilesRulesList.forEach(vf => {
        typeof validateResponse !== 'string' && (validateResponse = vf(data));
      });

    if (typeof validationSingleFileRulesList === 'undefined' || validationSingleFileRulesList.length === 0) {
      setAcceptedFiles([...data]);
    } else {
      setAcceptedFiles(newAcceptedFiles);
      setRejectedFiles(newRejectedFiles);
    }

    return validateResponse;
  };

  // eslint-disable-next-line
  const registerInterceptor = (ref: any, rules?: RegisterOptions): UseFormRegisterReturn<any> => {
    const originalValidate = rules?.validate;

    if (originalValidate && typeof originalValidate === 'function') {
      rules.validate = async (value: UploadFile[]): Promise<ValidateResult> => {
        return validateFiles(value);
      };
    }

    return register(ref, rules);
  };

  return {
    register: registerInterceptor,
    acceptedFiles,
    setAcceptedFiles,
    rejectedFiles,
    setRejectedFiles,
  };
};
