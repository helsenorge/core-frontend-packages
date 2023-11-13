import * as React from 'react';

import classNames from 'classnames';

import Icon from '@helsenorge/designsystem-react/components/Icon';
import ChevronDown from '@helsenorge/designsystem-react/components/Icons/ChevronDown';
import ChevronRight from '@helsenorge/designsystem-react/components/Icons/ChevronRight';
import ChevronUp from '@helsenorge/designsystem-react/components/Icons/ChevronUp';

import { theme } from '@helsenorge/designsystem-react';

import { FormChild } from '../form';
import ValidationError from '../form/validation-error';
import { Label } from '../label';

import './styles.scss';

export interface DropdownProps {
  /** Unik ID */
  id?: string;
  /** Label til dropdown > skal renames til Label */
  name: string;
  /** Påkrev prop som sendes til toggleDropdown brukes for å skille Dropdownene ved bruk av multiple Dropdowns */
  index: number;
  /** Verdi til children - vises ikke i feltet, brukes bare til å triggere validateField */
  value?: string | Array<string>;
  /** Function som kalles ved klikk på Dropdown */
  toggleDropdown: (index: number) => void;
  /** Om dropdown er åpen */
  open: boolean;
  /* Optional - ikon som vises ved siden av label */
  icon?: JSX.Element;
  /** Om dropdown skal tilpasses bredden til innholdet */
  respectContent?: boolean;
  /** Om dropdown skal ta hele bredden */
  isFullWidth?: boolean;
  /** Om det vises en pil som peker mot høyre - brukes ofte på mobil */
  arrowRight?: boolean;
  /** Ekstra CSS-class som legges på div'en */
  className?: string;
  /** Innhold som vises i komponentet */
  children?: React.ReactNode;
  /** An array of refs to the children to validate */
  childrenToValidate?: Array<React.RefObject<FormChild>>;
  /** Teksten til required label */
  requiredLabel?: string;
  /** Teksten til optional label */
  optionalLabel?: string;
  /** Om required label skal vises eller ikke */
  showRequiredLabel?: boolean;
  /** Om optional label skal vises eller ikke */
  showOptionalLabel?: boolean;
  /** Function som kalles når feltet valideres riktig */
  onValidated?: (valid: boolean | undefined) => void;
  /** ErrorMessage som vises gjennom validering */
  errorMessage?: string;
  /** Component som vises ved validation error */
  validationErrorRenderer?: JSX.Element;
  /** Om feltet er påkrevd eller ikke */
  isRequired?: boolean;
  /** Id som benyttes for å hente ut Button i automatiske tester */
  buttonTestId?: string;
  /** Id som benyttes for å hente ut ValidationError i automatiske tester */
  validationTestId?: string;
}

interface DropdownState {
  focus: boolean;
  isValid: boolean;
  value?: string | Array<string>;
  validated: boolean;
}

export class Dropdown extends React.Component<DropdownProps, DropdownState> {
  buttonRef: React.RefObject<HTMLButtonElement>;
  dropdownRef: React.RefObject<HTMLDivElement>;

  constructor(props: DropdownProps) {
    super(props);

    this.buttonRef = React.createRef();
    this.dropdownRef = React.createRef();
    this.state = {
      focus: false,
      isValid: true,
      value: undefined,
      validated: false,
    };
  }

  componentDidMount(): void {
    if (this.props.open) {
      this.addClickListener();
    }

    if (this.props.respectContent && this.buttonRef.current) {
      const width: number = this.buttonRef.current.offsetWidth + 15;
      this.buttonRef.current.style.width = `${width}px`;
    }
  }

  static getDerivedStateFromProps(nextProps: DropdownProps, prevState: DropdownState): DropdownState | null {
    // Used in combination with componentDidUpdate to trigger validation when the nested value is changed
    if (nextProps.value !== prevState.value) {
      return { value: nextProps.value, ...prevState };
    }
    return null;
  }

  componentDidUpdate(prevProps: DropdownProps): void {
    if (prevProps.value !== this.props.value) {
      this.validateField();
    }
    if (!prevProps.open && this.props.open) {
      this.addClickListener();
    } else if (prevProps.open && !this.props.open) {
      this.removeClickListener();
    }
  }

  componentWillUnmount(): void {
    this.removeClickListener();
  }

  getChildValidation = (child: FormChild): Promise<boolean> => {
    return child.validateField().then(() => {
      return child.isValid();
    });
  };

  // Denne funksjonen blir kalt på submit i form
  // Check wether or not children are valid and sets state accordingly
  validateField = async (): Promise<void> => {
    if (this.props.childrenToValidate) {
      const childrenValidityPromises: Array<Promise<boolean>> = this.props.childrenToValidate.map(async (childRef): Promise<boolean> => {
        return childRef.current ? this.getChildValidation(childRef.current) : false;
      });
      const childrenValidity = await Promise.all(childrenValidityPromises);
      const isValid = childrenValidity.every(v => v === true);
      return new Promise<void>((resolve: () => void) => {
        this.setState(
          {
            isValid,
            validated: true,
          },
          () => {
            this.notifyValidated();
            resolve();
          }
        );
      });
    }
  };

  // Used with <Validation>
  notifyValidated = (): void => {
    if (this.props.onValidated) {
      this.props.onValidated(this.state.isValid);
    }
  };

  // Used with <Validation>
  isValid = (): boolean => {
    return this.state.isValid;
  };

  // Used with <Validation>
  renderErrorMessage = (): JSX.Element => {
    if (this.props.validationErrorRenderer && !this.state.isValid) {
      return this.props.validationErrorRenderer;
    }

    let error: string;
    if (this.props.errorMessage) {
      error = this.props.errorMessage;
    } else {
      error = 'Ugyldig verdi';
    }

    return <ValidationError isValid={this.state.isValid} error={error} testId={this.props.validationTestId} />;
  };

  renderLabel = (): JSX.Element => {
    const { name, isRequired, requiredLabel, optionalLabel, showRequiredLabel, showOptionalLabel } = this.props;
    const labelText = (
      <React.Fragment>
        {name}
        {isRequired && requiredLabel && showRequiredLabel ? <em> {requiredLabel}</em> : ''}
        {!isRequired && optionalLabel && showOptionalLabel ? <em> {optionalLabel}</em> : ''}
      </React.Fragment>
    );

    return <Label labelText={labelText} isNotBold />;
  };

  clickListener = (evt: MouseEvent): void => {
    const target: Element = evt.target as Element;
    if (
      this.dropdownRef.current &&
      !this.dropdownRef.current.contains(target) &&
      !target.classList.contains('mol_dropdown__button') &&
      !target.classList.contains('CalendarDay')
    ) {
      this.toggleDropdown();
    }
  };

  addClickListener = (): void => {
    document.addEventListener('click', this.clickListener);
  };

  removeClickListener = (): void => {
    document.removeEventListener('click', this.clickListener);
  };

  toggleDropdown = (): void => {
    this.props.toggleDropdown(this.props.index);
  };

  onFocus = (): void => {
    this.setState({ focus: true });
  };

  onBlur = (): void => {
    this.setState({ focus: false });
  };

  render(): JSX.Element {
    const { open, icon, children, className, respectContent, isFullWidth, arrowRight } = this.props;
    const { validated, isValid, focus } = this.state;

    const dropdownClasses: string = classNames(
      {
        mol_dropdown: true,
        mol_validation: true,
        'mol_validation--active': validated && !isValid,
        'mol_dropdown--open': open,
        'mol_dropdown--focused': focus,
        'mol_dropdown--full-width': isFullWidth,
      },
      className
    );

    const dropdownButtonClasses: string = classNames({
      mol_dropdown__button: true,
      'mol_dropdown__button--selected': open,
      'mol_dropdown__button--full-width': isFullWidth || respectContent,
    });

    const dropdownContentClasses: string = classNames({
      mol_dropdown__content: true,
      'mol_dropdown__content--open': open,
      'mol_dropdown__content--focused': this.state.focus,
    });

    const joinedName = this.props.name ? this.props.name.replace(' ', '_') : '';

    return (
      <div className={dropdownClasses} ref={this.dropdownRef}>
        {this.renderErrorMessage()}
        <button
          type="button"
          onClick={this.toggleDropdown}
          className={dropdownButtonClasses}
          ref={this.buttonRef}
          aria-expanded={open}
          aria-controls={joinedName}
          data-testid={this.props.buttonTestId}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
        >
          {icon}
          <span className={'mol_dropdown__button-text'}>{this.renderLabel()}</span>
          {arrowRight ? (
            <Icon
              color={theme.palette.blueberry500}
              svgIcon={ChevronRight}
              className={'mol_dropdown__button-arrow mol_dropdown__button-arrow--right'}
            />
          ) : open ? (
            <Icon
              color={theme.palette.blueberry500}
              svgIcon={ChevronUp}
              className={'mol_dropdown__button-arrow mol_dropdown__button-arrow--up'}
            />
          ) : (
            <Icon
              color={theme.palette.blueberry500}
              svgIcon={ChevronDown}
              className={'mol_dropdown__button-arrow mol_dropdown__button-arrow--down'}
            />
          )}
        </button>
        <div className={'mol_dropdown__container'} id={joinedName}>
          <div className={dropdownContentClasses}>{children}</div>
        </div>
      </div>
    );
  }
}
