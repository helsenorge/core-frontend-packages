import * as React from 'react';
import classNames from 'classnames';

import FormSubmitButton from './form-buttons/form-submit-button';
import FormCancelButton from './form-buttons/form-cancel-button';
import FormPauseButton from './form-buttons/form-pause-button';
import FormDraftButton from './form-buttons/form-draft-button';
import { Spinner } from '../../atoms/spinner';
import { ValidationSummaryPlacement } from './validationSummaryPlacement';
import { ValidationProps } from './validation';
import ValidationSummary from './validation-summary';
import ValidationError from './validation-error';

import toolkitstyles from './styles.module.scss';
import './styles.scss';

interface ValidationSummary {
  enable: boolean;
  header: string;
}
export interface FormProps {
  action: string;
  /** Ekstra CSS-class som legges på form'en */
  className?: string;
  /** Om Formen er disabled (submit knapp)*/
  disabled?: boolean;
  /** The CSS classes to be added to the content of the form upon the buttons */
  contentClasses?: string;
  /** Ekstra CSS-class som brukes på button-wrapper'en */
  buttonClasses?: string;

  /** Teksten som vises på submit knappen */
  submitButtonText?: string;
  /** Ekstra CSS-class som legges på submit knappen */
  submitButtonClasses?: string;
  /** Submit button type. Default is 'action' */
  submitButtonType?: 'action' | 'display';
  /** If the submit button has an icon to be shown on the left - only possible if submitButtonType is 'display' */
  submitButtonLeftIcon?: JSX.Element;
  /** If the submit button has an icon to be shown on the right - only possible if submitButtonType is 'display'  */
  submitButtonRightIcon?: JSX.Element;
  /** If the submit button is disabled  */
  submitButtonDisabled?: boolean;

  /** The text to be shown on the cancel button */
  cancelButtonText?: string;
  /** The CSS classes to be added to the cancelbutton */
  cancelButtonClasses?: string;
  /** Om Avbryt knappen vises til venstre */
  cancelButtonLeft?: boolean;
  /** Om Avbryt knappen vises til høyre */
  cancelButtonRight?: boolean;
  /** Cancel button type. Default is 'action' */
  cancelButtonType?: 'action' | 'display';
  /** If the cancel button has an icon to be shown on the left - only possible if cancelButtonType is 'display' */
  cancelButtonLeftIcon?: JSX.Element;
  /** If the cancel button has an icon to be shown on the right - only possible if cancelButtonType is 'display' */
  cancelButtonRightIcon?: JSX.Element;
  /** If the cancel button is disabled  */
  cancelButtonDisabled?: boolean;

  /** Teksten som vises på lagre knappen */
  draftButtonText?: string;
  /** Ekstra CSS-class som legges på lagre knappen */
  draftButtonClasses?: string;
  /** Teksten som vises på pause knappen */

  pauseButtonText?: string;
  /** Ekstra CSS-class som legges på pause knappen */
  pauseButtonClasses?: string;
  /** Pause button type. Default is 'action' */
  pauseButtonType?: 'action' | 'display' | 'function';
  /** If the pause button is a primary, secondary or tertiary button */
  pauseButtonLevel?: 'primary' | 'secondary' | 'tertiary';
  /** If the pause button has an icon to be shown on the left - only possible if submitButtonType is 'display'  */
  pauseButtonLeftIcon?: JSX.Element;
  /** If the pause button is disabled  */
  pauseButtonDisabled?: boolean;

  /** Feilmeldingen som vises ved Error */
  errorMessage?: string;
  /** Custom validator function which will be called before submit function*/
  submitValidator?: () => Promise<void>;
  /** Function som kalles ved Submit */
  onSubmit?: (event?: React.FormEvent<{}>) => void;
  /** Function som kalles ved lagring */
  onDraft?: (event?: React.FormEvent<{}>) => void;
  /** Function som kalles ved klikk på Avrbyt */
  onCancel?: (event?: React.FormEvent<{}>) => void;
  /** Function som kalles ved pause */
  onPause?: () => void;
  /** Function som kalles som callback etter onSubmit når det brukes <SaveButton> component */
  saveButtonOnClick?: () => void;
  /** Om Formen holder på med å lagre */
  saving?: boolean;
  /** Om Formen er lagret */
  saved?: boolean;
  /** Tekst som vises når formen er lagret (brukes videre på <SaveButton>) */
  savedText?: string;
  /** Tekst som vises når formen holder på med å lagre (brukes videre på <SaveButton>) */
  saveText?: string;
  /** Gjør det mulig å overskrive optionalLabel, requiredLabel, showOptionalLabel og showRequired Label + bruke custom notifyValidated på komponent'en i en form */
  allowChildPropOverride?: boolean;
  /** Teksten til required label */
  requiredLabel?: string;
  /** Teksten til optional label */
  optionalLabel?: string;
  /** Om required label skal vises eller ikke */
  showRequiredLabel?: boolean;
  /** Om ekstra label skal vises eller ikke */
  showOptionalLabel?: boolean;
  /** Om det legges et preventDefault lag på submit */
  triggerPreventDefaultOnSubmit?: boolean;
  /** Selve ValidationSummary kompomnent som oppsumerer alle valideringsfeilene */
  validationSummary?: ValidationSummary;
  /** Plasseringen til ValidationSummary */
  validationSummaryPlacement?: ValidationSummaryPlacement;
  /** Innhold som vises i formen */
  children?: React.ReactNode;
  /** Id som benyttes for å hente ut SaveButton i automatiske tester */
  saveButtonTestId?: string;
  /** Id som benyttes for å hente ut DraftButton i automatiske tester */
  draftButtonTestId?: string;
  /** Id som benyttes for å hente ut SubmitButton i automatiske tester */
  submitButtonTestId?: string;
  /** Id som benyttes for å hente ut CancelButton i automatiske tester */
  cancelButtonTestId?: string;
  /** Id som benyttes for å hente ut PauseButton i automatiske tester */
  pauseButtonTestId?: string;
  /** Id som benyttes for å hente ut ValidationError i automatiske tester */
  validationTestId?: string;
}

export interface FormState {
  valid?: boolean;
  submitted?: boolean;
  formComponents: Array<FormChild>;
}

export interface FormChild extends Element {
  label?: string;
  legend?: string;
  validateField: () => Promise<void>;
  isValid: () => boolean;
  getWrappedInstance: () => FormChild;
  getText: () => string;
  getId: () => string;
  notifyValidated?: (valid: boolean) => void;
  props: FormChildProps;
}

export interface FormChildProps extends Element {
  id: string;
  key: string;
  label?: string;
  legend?: string;
  requiredLabel?: string;
  optionalLabel?: string;
  validateField?: () => Promise<void>;
  isValid?: () => boolean;
  isRequired?: boolean;
  /** Optional ref som overskriver lokal ref*/
  ref?: React.RefObject<HTMLButtonElement>;
}

export default class Form extends React.Component<FormProps, FormState> {
  public static defaultProps: FormProps = {
    action: '#',
    submitButtonType: 'action',
    cancelButtonType: 'action',
    pauseButtonType: 'action',
    pauseButtonLevel: 'tertiary',
  };

  validationSummaryRef: React.RefObject<HTMLDivElement>;

  constructor(props: FormProps) {
    super(props);
    this.state = {
      valid: true,
      submitted: false,
      formComponents: [],
    };
    this.validationSummaryRef = React.createRef();
  }

  validateForm(cb?: () => void): void {
    const promises: Array<Promise<void>> = [];
    this.state.formComponents.forEach((child: FormChild) => {
      const childToValidate = child && child.getWrappedInstance ? child.getWrappedInstance() : child;
      if (childToValidate && childToValidate.props && childToValidate.props.validateField) {
        promises.push(childToValidate.props.validateField());
      } else if (childToValidate && childToValidate.validateField) {
        const returnedPromise = childToValidate.validateField();
        promises.push(returnedPromise);
      }
    });
    if (this.props.submitValidator) {
      promises.push(this.props.submitValidator());
    }
    Promise.all(promises).then(cb);
  }

  areAllFieldsValid = (): boolean => {
    for (let i = 0; i < this.state.formComponents.length; i++) {
      const child: FormChild = this.state.formComponents[i];
      const childToValidate = child && child.getWrappedInstance ? child.getWrappedInstance() : child;
      if (childToValidate && childToValidate.props && childToValidate.props.isValid && !childToValidate.props.isValid()) {
        return false;
      } else if (childToValidate && childToValidate.isValid && !childToValidate.isValid()) {
        return false;
      }
    }
    return true;
  };

  onFormSubmit = (cb: () => void): void => {
    this.setState({ submitted: true }, () => {
      this.validateForm(() => {
        if (this.areAllFieldsValid()) {
          cb();
        } else {
          this.setState({ valid: false });
          if (this.props.validationSummary && this.props.validationSummary.enable && this.validationSummaryRef.current) {
            this.validationSummaryRef.current.scrollIntoView();
            this.validationSummaryRef.current.focus();
          }
        }
      });
    });
  };

  onChildValidated = (): void => {
    // a field has changed status to valid, revalidate form
    if (this.state.submitted) {
      this.setState({
        valid: this.areAllFieldsValid(),
      });
    }
  };

  isSubmitted = (): boolean | undefined => {
    return this.state.submitted;
  };

  renderErrorMessage(): JSX.Element {
    let isValid = true;
    if (!this.state.valid && this.state.submitted) {
      isValid = false;
    }

    return (
      <ValidationError
        isValid={isValid}
        error={this.props.errorMessage ? this.props.errorMessage : ''}
        className="mol_form__formerror"
        textClassName="mol_validation__formerrortext"
        testId={this.props.validationTestId}
      />
    );
  }

  renderButtons(): JSX.Element | null {
    const submitButton = (
      <FormSubmitButton
        submitButtonText={this.props.submitButtonText}
        submitButtonClasses={this.props.submitButtonClasses}
        submitButtonLeftIcon={this.props.submitButtonLeftIcon}
        submitButtonRightIcon={this.props.submitButtonRightIcon}
        submitButtonType={this.props.submitButtonType}
        submitButtonDisabled={this.props.submitButtonDisabled}
        saving={this.props.saving}
        saved={this.props.saved}
        saveText={this.props.saveText}
        savedText={this.props.savedText}
        saveButtonOnClick={this.props.saveButtonOnClick}
        onFormSubmit={this.onFormSubmit}
        onSubmit={this.props.onSubmit}
        saveButtonTestId={this.props.saveButtonTestId}
        submitButtonTestId={this.props.submitButtonTestId}
      />
    );
    const cancelButton = (
      <FormCancelButton
        cancelButtonText={this.props.cancelButtonText}
        cancelButtonClasses={this.props.cancelButtonClasses}
        cancelButtonLeft={this.props.cancelButtonLeft}
        cancelButtonRight={this.props.cancelButtonRight}
        cancelButtonType={this.props.cancelButtonType}
        cancelButtonLeftIcon={this.props.cancelButtonLeftIcon}
        cancelButtonRightIcon={this.props.cancelButtonRightIcon}
        cancelButtonDisabled={this.props.cancelButtonDisabled}
        onCancel={this.props.onCancel}
        cancelButtonTestId={this.props.cancelButtonTestId}
      />
    );
    const pauseButton = (
      <FormPauseButton
        pauseButtonText={this.props.pauseButtonText}
        pauseButtonClasses={this.props.pauseButtonClasses}
        pauseButtonType={this.props.pauseButtonType}
        pauseButtonLevel={this.props.pauseButtonLevel}
        pauseButtonLeftIcon={this.props.pauseButtonLeftIcon}
        pauseButtonDisabled={this.props.pauseButtonDisabled}
        onPause={this.props.onPause}
        pauseButtonTestId={this.props.pauseButtonTestId}
      />
    );
    const draftButton = (
      <FormDraftButton
        draftButtonText={this.props.draftButtonText}
        draftButtonClasses={this.props.draftButtonClasses}
        onFormSubmit={this.onFormSubmit}
        onDraft={this.props.onDraft}
        draftButtonTestId={this.props.draftButtonTestId}
      />
    );
    if (!submitButton && !cancelButton && !pauseButton && !draftButton) {
      return null;
    }
    if (this.props.cancelButtonLeft) {
      return (
        <div>
          {cancelButton}
          {submitButton}
          {draftButton}
          {pauseButton}
        </div>
      );
    }
    if (this.props.cancelButtonRight) {
      return (
        <div>
          {submitButton}
          {draftButton}
          {pauseButton}
          {cancelButton}
        </div>
      );
    }
    return (
      <div>
        {submitButton}
        {draftButton}
        {cancelButton}
        {pauseButton}
      </div>
    );
  }

  renderSpinner = (): JSX.Element | void => {
    if (this.props.disabled) {
      return <Spinner local />;
    }
  };

  addFormComponent = (comp: FormChild): Array<FormChild> | void => {
    this.setState(({ formComponents }) => {
      formComponents.push(comp);
      return { formComponents };
    });
  };

  removeFormComponent = (comp: FormChild): Array<FormChild> | void => {
    this.setState(
      ({ formComponents }) => {
        const index = formComponents.indexOf(comp);
        formComponents.splice(index, 1);
        return { formComponents };
      },
      () => {
        // Invalid field removed. Revalidate form
        if (!this.state.valid && comp.isValid && !comp.isValid()) {
          this.onChildValidated();
        }
      }
    );
  };

  renderValidationSummary = (): JSX.Element | void => {
    if (this.props.validationSummary && this.props.validationSummary.enable) {
      return (
        <div className="mol_validation-summary_wrapper" ref={this.validationSummaryRef} tabIndex={-1} aria-atomic="true">
          <ValidationSummary
            header={this.props.validationSummary.header}
            components={this.state.formComponents}
            submitted={this.state.submitted}
          />
        </div>
      );
    }
  };

  renderChildren = () => {
    const { children } = this.props;
    if (!children) {
      return null;
    }
    const childrenWithProp = React.Children.map(children, (child: JSX.Element) => {
      if (child) {
        // gets the props that are directly written on component to override automatic copies if allowChildPropOverride is true
        const childPreviousProps =
          typeof child.type === 'function' && child.props && child.props.children && child.props.children.props
            ? child.props.children.props
            : undefined;

        const childProps: ValidationProps = {
          addFormComponent: this.addFormComponent,
          removeFormComponent: this.removeFormComponent,
          onValidated: this.onChildValidated,
          optionalLabel:
            this.props.allowChildPropOverride && childPreviousProps && childPreviousProps.optionalLabel
              ? childPreviousProps.optionalLabel
              : this.props.optionalLabel,
          requiredLabel:
            this.props.allowChildPropOverride && childPreviousProps && childPreviousProps.requiredLabel
              ? childPreviousProps.requiredLabel
              : this.props.requiredLabel,
          isSubmitted: this.isSubmitted,
          showOptionalLabel:
            this.props.allowChildPropOverride && childPreviousProps && childPreviousProps.showOptionalLabel
              ? childPreviousProps.showOptionalLabel
              : this.props.showOptionalLabel
              ? this.props.showOptionalLabel
              : true,
          showRequiredLabel:
            this.props.showRequiredLabel && childPreviousProps && childPreviousProps.showRequiredLabel
              ? childPreviousProps.showRequiredLabel
              : this.props.showRequiredLabel
              ? this.props.showRequiredLabel
              : false,
        };

        // clones and adds ValidationProps only if the child is a FunctionComponent or ClassComponent, not if a DOM component
        return React.cloneElement(child, typeof child.type === 'function' || typeof child.type === 'object' ? childProps : {});
      }
    });
    return childrenWithProp;
  };

  render(): JSX.Element {
    const formClasses = classNames('mol_form', this.props.className);
    const contentClasses = classNames('mol_form--content', this.props.contentClasses);
    const validationSummaryPlacement = this.props.validationSummaryPlacement || ValidationSummaryPlacement.Top;
    return (
      <form
        method="post"
        action={this.props.action}
        onSubmit={(e): void => {
          if (this.props.triggerPreventDefaultOnSubmit) {
            e.preventDefault();
            e.stopPropagation();
          }

          this.onFormSubmit(() => {
            if (this.props.onSubmit) {
              this.props.onSubmit(e);
            }
          });
        }}
        className={formClasses}
      >
        {validationSummaryPlacement === ValidationSummaryPlacement.Top && this.renderValidationSummary()}
        <div className={contentClasses}>{this.renderChildren()}</div>
        {validationSummaryPlacement === ValidationSummaryPlacement.Bottom && this.renderValidationSummary()}
        <div className={`${toolkitstyles.form__buttonwrapper} ${this.props.buttonClasses}`}>
          {this.renderErrorMessage()}
          {this.renderButtons()}
          {this.renderSpinner()}
        </div>
      </form>
    );
  }
}
