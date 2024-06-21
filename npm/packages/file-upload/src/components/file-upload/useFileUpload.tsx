import React from 'react';

import { FieldValues, UseFormRegister, ValidateResult, Path, RegisterOptions, UseFormRegisterReturn, PathValue } from 'react-hook-form';

import { AllFilesValidation, SingleFileValidation } from './validate-utils';

import { UploadFile } from '.';

type UseFileUploadReturn<T extends FieldValues> = {
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

  const registerInterceptor: UseFormRegister<T> = <TFieldName extends Path<T>>(
    name: TFieldName,
    rules?: RegisterOptions<T, TFieldName>
  ): UseFormRegisterReturn<TFieldName> => {
    const registeredField = register(name, {
      ...rules,
      validate: async (value: UploadFile[], formValues: T): Promise<ValidateResult> => {
        const validationResult = validateFiles(value);

        const originalValidate = rules?.validate;
        if (originalValidate) {
          if (typeof originalValidate === 'function') {
            const originalResult = await originalValidate(value as PathValue<T, TFieldName>, formValues);
            if (originalResult !== true) {
              return originalResult;
            }
          } else if (typeof originalValidate === 'object') {
            for (const key in originalValidate) {
              if (Object.prototype.hasOwnProperty.call(originalValidate, key)) {
                const result = await originalValidate[key](value as PathValue<T, TFieldName>, formValues);
                if (result !== true) {
                  return result;
                }
              }
            }
          }
        }

        return validationResult;
      },
    });

    const { onChange, onBlur, ...rest } = registeredField;

    // Vi validerer og kjører den originale onChange handleren
    const handleChange: React.ChangeEventHandler<HTMLInputElement> = event => {
      const files = Array.from(event.target.files || []) as UploadFile[];
      validateFiles(files);
      onChange(event);
    };

    // Vi validerer og kjører den originale onBlur handleren
    const handleBlur: React.FocusEventHandler<HTMLInputElement> = event => {
      const files = Array.from(event.target.files || []) as UploadFile[];
      validateFiles(files);
      onBlur(event); // Call the original onBlur handler
    };

    return {
      ...rest,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onChange: handleChange as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onBlur: handleBlur as any,
    };
  };

  return {
    register: registerInterceptor,
    acceptedFiles,
    setAcceptedFiles,
    rejectedFiles,
    setRejectedFiles,
  };
};
