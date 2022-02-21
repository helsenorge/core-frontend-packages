import * as React from 'react';
import { SingleDatePickerShape, DateRangePickerShape } from 'react-dates';
import moment from 'moment';

import { ErrorPhrases } from './date-range-picker-utils';
import * as DateRangePickerValidation from './date-range-picker-validation';

describe('DateRangePicker date-range-picker-validation', () => {
  describe('Gitt at isNextMonthValid kalles', () => {
    describe('Når dato er måneden før maximumDate', () => {
      it('Så returnerer isNextMonthValid true', () => {
        const date = moment('20.04.2020', 'DD.MM.YYYY');
        const maximumDate = moment('15.05.2020', 'DD.MM.YYYY');

        const isValid = DateRangePickerValidation.isNextMonthValid(date, maximumDate);

        expect(isValid).toBeTruthy();
      });
    });
    describe('Når dato er samme måned som maximumDate', () => {
      it('Så returnerer isNextMonthValid false', () => {
        const date = moment('20.05.2020', 'DD.MM.YYYY');
        const maximumDate = moment('15.05.2020', 'DD.MM.YYYY');

        const isValid = DateRangePickerValidation.isNextMonthValid(date, maximumDate);

        expect(isValid).toBeFalsy();
      });
    });
    describe('Når dato er måneden etter maximumDate', () => {
      it('Så returnerer isNextMonthValid false', () => {
        const date = moment('20.06.2020', 'DD.MM.YYYY');
        const maximumDate = moment('15.05.2020', 'DD.MM.YYYY');

        const isValid = DateRangePickerValidation.isNextMonthValid(date, maximumDate);

        expect(isValid).toBeFalsy();
      });
    });
  });
  describe('Gitt at isPrevMonthValid kalles', () => {
    describe('Når dato er måneden før minimumDate', () => {
      it('Så returnerer isPrevMonthValid false', () => {
        const date = moment('20.04.2020', 'DD.MM.YYYY');
        const minimumDate = moment('15.05.2020', 'DD.MM.YYYY');

        const isValid = DateRangePickerValidation.isPrevMonthValid(date, minimumDate);

        expect(isValid).toBeFalsy();
      });
    });
    describe('Når dato er samme måned som minimumDate', () => {
      it('Så returnerer isPrevMonthValid false', () => {
        const date = moment('20.05.2020', 'DD.MM.YYYY');
        const minimumDate = moment('15.05.2020', 'DD.MM.YYYY');

        const isValid = DateRangePickerValidation.isPrevMonthValid(date, minimumDate);

        expect(isValid).toBeFalsy();
      });
    });
    describe('Når dato er måneden etter minimumDate', () => {
      it('Så returnerer isPrevMonthValid true', () => {
        const date = moment('20.06.2020', 'DD.MM.YYYY');
        const minimumDate = moment('15.05.2020', 'DD.MM.YYYY');

        const isValid = DateRangePickerValidation.isPrevMonthValid(date, minimumDate);

        expect(isValid).toBeTruthy();
      });
    });
  });
  describe('Gitt at isMinimumDateValid kalles', () => {
    describe('Når den har en dato som er under minDato', () => {
      const a = DateRangePickerValidation.isMinimumDateValid(moment('20.02.2020', 'DD.MM.YYYY'), moment('20.05.2020', 'DD.MM.YYYY'));
      it('Så returnerer den false', () => {
        expect(a).toBeFalsy();
      });
    });
    describe('Når den har en dato som er over minDato', () => {
      const a = DateRangePickerValidation.isMinimumDateValid(moment('20.10.2020', 'DD.MM.YYYY'), moment('20.05.2020', 'DD.MM.YYYY'));
      it('Så returnerer den true', () => {
        expect(a).toBeTruthy();
      });
    });
    describe('Når den har en dato som er lik minDato', () => {
      const a = DateRangePickerValidation.isMinimumDateValid(moment('20.05.2020', 'DD.MM.YYYY'), moment('20.05.2020', 'DD.MM.YYYY'));
      it('Så returnerer den true', () => {
        expect(a).toBeTruthy();
      });
    });
  });

  describe('Gitt at isMaximumDateValid kalles', () => {
    describe('Når den har en dato som er under maxDato', () => {
      const a = DateRangePickerValidation.isMaximumDateValid(moment('20.02.2020', 'DD.MM.YYYY'), moment('20.05.2020', 'DD.MM.YYYY'));
      it('Så returnerer den true', () => {
        expect(a).toBeTruthy();
      });
    });
    describe('Når den har en dato som er over maxDato', () => {
      const a = DateRangePickerValidation.isMaximumDateValid(moment('20.10.2020', 'DD.MM.YYYY'), moment('20.05.2020', 'DD.MM.YYYY'));
      it('Så returnerer den false', () => {
        expect(a).toBeFalsy();
      });
    });
    describe('Når den har en dato som er lik maxDato', () => {
      const a = DateRangePickerValidation.isMaximumDateValid(moment('20.05.2020', 'DD.MM.YYYY'), moment('20.05.2020', 'DD.MM.YYYY'));
      it('Så returnerer den true', () => {
        expect(a).toBeTruthy();
      });
    });
  });

  describe('Gitt at isOutsideRange kalles', () => {
    describe('Når den har en dato som er mellom minDato og maxDato', () => {
      const a = DateRangePickerValidation.isOutsideRange(
        moment('20.05.2020', 'DD.MM.YYYY'),
        moment('20.02.2020', 'DD.MM.YYYY'),
        moment('20.10.2020', 'DD.MM.YYYY')
      );
      it('Så returnerer den false', () => {
        expect(a).toBeFalsy();
      });
    });

    describe('Når den har en dato som er lik minDato', () => {
      const a = DateRangePickerValidation.isOutsideRange(
        moment('20.05.2020', 'DD.MM.YYYY'),
        moment('20.05.2020', 'DD.MM.YYYY'),
        moment('20.10.2020', 'DD.MM.YYYY')
      );
      it('Så returnerer den false', () => {
        expect(a).toBeFalsy();
      });
    });

    describe('Når den har en dato som er lik maxDato', () => {
      const a = DateRangePickerValidation.isOutsideRange(
        moment('20.10.2020', 'DD.MM.YYYY'),
        moment('20.02.2020', 'DD.MM.YYYY'),
        moment('20.10.2020', 'DD.MM.YYYY')
      );
      it('Så returnerer den false', () => {
        expect(a).toBeFalsy();
      });
    });

    describe('Når den har en dato som er under minDato', () => {
      const a = DateRangePickerValidation.isOutsideRange(
        moment('20.01.2020', 'DD.MM.YYYY'),
        moment('20.02.2020', 'DD.MM.YYYY'),
        moment('20.10.2020', 'DD.MM.YYYY')
      );
      it('Så returnerer den true', () => {
        expect(a).toBeTruthy();
      });
    });

    describe('Når den har en dato som er over maxDato', () => {
      const a = DateRangePickerValidation.isOutsideRange(
        moment('20.11.2020', 'DD.MM.YYYY'),
        moment('20.02.2020', 'DD.MM.YYYY'),
        moment('20.10.2020', 'DD.MM.YYYY')
      );
      it('Så returnerer den true', () => {
        expect(a).toBeTruthy();
      });
    });
  });

  describe('Gitt at validateSingleDate kalles', () => {
    const mockedElement = document.createElement('div');
    const mockedInput = document.createElement('input');
    mockedInput.className = 'DateInput_input';

    const dateValidatorMock = jest.fn();

    describe('Når required er satt til true og dato er null', () => {
      const a = DateRangePickerValidation.validateSingleDate(
        {} as unknown as React.RefObject<React.ClassicComponent<SingleDatePickerShape, {}>>,
        null,
        'id',
        true,
        ErrorPhrases,
        undefined,
        undefined,
        dateValidatorMock
      );
      it('Så returnerer den isSingleDateValid false med riktig errorString', () => {
        expect(a.isSingleDateValid).toBeFalsy();
        expect(a.errorString).toEqual('Datoen er påkrevd');
      });
    });

    describe('Når required er satt til true og dato er ugyldig', () => {
      const a = DateRangePickerValidation.validateSingleDate(
        {} as unknown as React.RefObject<React.ClassicComponent<SingleDatePickerShape, {}>>,
        moment('not a real date'),
        'id',
        true,
        ErrorPhrases,
        undefined,
        undefined,
        dateValidatorMock
      );
      it('Så returnerer den isSingleDateValid false med riktig errorString', () => {
        expect(a.isSingleDateValid).toBeFalsy();
        expect(a.errorString).toEqual('Datoen er påkrevd');
      });
    });

    describe('Når required er satt til false og dato er null', () => {
      const a = DateRangePickerValidation.validateSingleDate(
        {} as unknown as React.RefObject<React.ClassicComponent<SingleDatePickerShape, {}>>,
        null,
        'id',
        false,
        ErrorPhrases,
        undefined,
        undefined,
        dateValidatorMock
      );
      it('Så returnerer den isSingleDateValid true uten errorString', () => {
        expect(a.isSingleDateValid).toBeTruthy();
        expect(a.errorString).toEqual(undefined);
      });
    });

    describe('Når required er satt til false og dato er ugyldig', () => {
      const a = DateRangePickerValidation.validateSingleDate(
        {} as unknown as React.RefObject<React.ClassicComponent<SingleDatePickerShape, {}>>,
        moment('not a real date'),
        'id',
        false,
        ErrorPhrases,
        undefined,
        undefined,
        dateValidatorMock
      );
      it('Så returnerer den isSingleDateValid false med riktig errorString', () => {
        expect(a.isSingleDateValid).toBeFalsy();
        expect(a.errorString).toEqual('Datoen er ugyldig');
      });
    });

    describe('Når datoen er gyldig men er satt under minDato', () => {
      const a = DateRangePickerValidation.validateSingleDate(
        {} as unknown as React.RefObject<React.ClassicComponent<SingleDatePickerShape, {}>>,
        moment('20.05.2020', 'DD.MM.YYYY'),
        'id',
        false,
        ErrorPhrases,
        moment('20.10.2020', 'DD.MM.YYYY'),
        undefined,
        dateValidatorMock
      );
      it('Så returnerer den isSingleDateValid false med riktig errorString', () => {
        expect(a.isSingleDateValid).toBeFalsy();
        expect(a.errorString).toEqual('Datoen er før den minste tillatte datoen: 20.10.2020');
      });
    });

    describe('Når datoen er gyldig men er satt over maxDato', () => {
      const a = DateRangePickerValidation.validateSingleDate(
        {} as unknown as React.RefObject<React.ClassicComponent<SingleDatePickerShape, {}>>,
        moment('20.05.2020', 'DD.MM.YYYY'),
        'id',
        false,
        ErrorPhrases,
        undefined,
        moment('20.01.2020', 'DD.MM.YYYY'),

        dateValidatorMock
      );
      it('Så returnerer den isSingleDateValid false med riktig errorString', () => {
        expect(a.isSingleDateValid).toBeFalsy();
        expect(a.errorString).toEqual('Datoen er etter den eldste tillatte datoen: 20.01.2020');
      });
    });

    describe('Når datoen er null men inputValue har en verdi', () => {
      mockedInput.value = '20.05.2020';
      mockedElement.appendChild(mockedInput);
      const mockedRef = { current: { container: mockedElement } };

      const a = DateRangePickerValidation.validateSingleDate(
        mockedRef as unknown as React.RefObject<React.ClassicComponent<SingleDatePickerShape, {}>>,
        null,
        'id',
        false,
        ErrorPhrases,
        undefined,
        undefined,
        dateValidatorMock
      );
      it('Så returnerer den isSingleDateValid false med riktig errorString', () => {
        expect(a.isSingleDateValid).toBeFalsy();
        expect(a.errorString).toEqual('Datoen er ugyldig');
      });
    });

    describe('Når datoen er null men inputValue har en verdi under MinDato', () => {
      const mockedRef = { current: { container: mockedElement } };
      const a = DateRangePickerValidation.validateSingleDate(
        mockedRef as unknown as React.RefObject<React.ClassicComponent<SingleDatePickerShape, {}>>,
        null,
        'id',
        false,
        ErrorPhrases,
        moment('20.10.2020', 'DD.MM.YYYY'),
        undefined,
        dateValidatorMock
      );
      it('Så returnerer den isSingleDateValid false med riktig errorString', () => {
        expect(a.isSingleDateValid).toBeFalsy();
        expect(a.errorString).toEqual('Datoen er før den minste tillatte datoen: 20.10.2020');
      });
    });

    describe('Når datoen er null men inputValue har en verdi over MaxDato', () => {
      const mockedRef = { current: { container: mockedElement } };
      const a = DateRangePickerValidation.validateSingleDate(
        mockedRef as unknown as React.RefObject<React.ClassicComponent<SingleDatePickerShape, {}>>,
        null,
        'id',
        false,
        ErrorPhrases,
        undefined,
        moment('20.01.2020', 'DD.MM.YYYY'),
        dateValidatorMock
      );
      it('Så returnerer den isSingleDateValid false med riktig errorString', () => {
        expect(a.isSingleDateValid).toBeFalsy();
        expect(a.errorString).toEqual('Datoen er etter den eldste tillatte datoen: 20.01.2020');
      });
    });

    describe('Når datoen er gyldig og innen min/maxdato men at optional dateValidator returnerer false', () => {
      dateValidatorMock.mockReturnValue(false);
      const dato = moment('20.05.2020', 'DD.MM.YYYY');
      const a = DateRangePickerValidation.validateSingleDate(
        {} as unknown as React.RefObject<React.ClassicComponent<SingleDatePickerShape, {}>>,
        dato,
        'id',
        true,
        ErrorPhrases,
        moment('20.01.2020', 'DD.MM.YYYY'),
        moment('20.10.2020', 'DD.MM.YYYY'),
        dateValidatorMock
      );
      it('Så kaller den dateValidator med riktig parametre', () => {
        expect(dateValidatorMock).toHaveBeenCalledWith('id', dato);
      });
      it('Så returnerer den isSingleDateValid false med riktig errorString', () => {
        expect(a.isSingleDateValid).toBeFalsy();
        expect(a.errorString).toEqual('Datoen er ugyldig');
      });
    });
  });

  describe('Gitt at validateRangeDate kalles', () => {
    const mockedElement = document.createElement('div');
    const mockedInput1 = document.createElement('input');
    mockedInput1.className = 'DateInput_input';
    const mockedInput2 = document.createElement('input');
    mockedInput2.className = 'DateInput_input';

    const dateValidatorMock = jest.fn();

    describe('Når required er satt til true og dato start og/eller end er null', () => {
      it('Så returnerer den isRangeDateValid false (begge er null) med riktig errorString', () => {
        const a = DateRangePickerValidation.validateRangeDate(
          {} as unknown as React.RefObject<React.ClassicComponent<DateRangePickerShape, {}>>,
          null,
          null,
          'id',
          true,
          ErrorPhrases,
          undefined,
          undefined,
          undefined,
          dateValidatorMock
        );

        expect(a.isRangeDateValid).toBeFalsy();
        expect(a.errorString).toEqual('Både startdato og sluttdato er påkrevd');
      });

      it('Så returnerer den isRangeDateValid false (start er null) med riktig errorString', () => {
        const a = DateRangePickerValidation.validateRangeDate(
          {} as unknown as React.RefObject<React.ClassicComponent<DateRangePickerShape, {}>>,
          moment('20.05.2020', 'DD.MM.YYYY'),
          null,
          'id',
          true,
          ErrorPhrases,
          undefined,
          undefined,
          undefined,
          dateValidatorMock
        );

        expect(a.isRangeDateValid).toBeFalsy();
        expect(a.errorString).toEqual('Både startdato og sluttdato er påkrevd');
      });

      it('Så returnerer den isRangeDateValid false (end er null) med riktig errorString', () => {
        const a = DateRangePickerValidation.validateRangeDate(
          {} as unknown as React.RefObject<React.ClassicComponent<DateRangePickerShape, {}>>,
          null,
          moment('20.05.2020', 'DD.MM.YYYY'),
          'id',
          true,
          ErrorPhrases,
          undefined,
          undefined,
          undefined,
          dateValidatorMock
        );

        expect(a.isRangeDateValid).toBeFalsy();
        expect(a.errorString).toEqual('Både startdato og sluttdato er påkrevd');
      });
    });

    describe('Når required er satt til true og dato start og/eller end er ugyldig', () => {
      it('Så returnerer den isRangeDateValid false (begge er ugyldige) med riktig errorString', () => {
        const a = DateRangePickerValidation.validateRangeDate(
          {} as unknown as React.RefObject<React.ClassicComponent<DateRangePickerShape, {}>>,
          moment('not a real date'),
          moment('not a real date'),
          'id',
          true,
          ErrorPhrases,
          undefined,
          undefined,
          undefined,
          dateValidatorMock
        );

        expect(a.isRangeDateValid).toBeFalsy();
        expect(a.errorString).toEqual('Både startdato og sluttdato er påkrevd');
      });

      it('Så returnerer den isRangeDateValid false (start er ugyldig) med riktig errorString', () => {
        const a = DateRangePickerValidation.validateRangeDate(
          {} as unknown as React.RefObject<React.ClassicComponent<DateRangePickerShape, {}>>,
          moment('not a real date'),
          moment('20.05.2020', 'DD.MM.YYYY'),
          'id',
          true,
          ErrorPhrases,
          undefined,
          undefined,
          undefined,
          dateValidatorMock
        );

        expect(a.isRangeDateValid).toBeFalsy();
        expect(a.errorString).toEqual('Både startdato og sluttdato er påkrevd');
      });
      it('Så returnerer den isRangeDateValid false (end er ugyldig) med riktig errorString', () => {
        const a = DateRangePickerValidation.validateRangeDate(
          {} as unknown as React.RefObject<React.ClassicComponent<DateRangePickerShape, {}>>,
          moment('20.05.2020', 'DD.MM.YYYY'),
          moment('not a real date'),
          'id',
          true,
          ErrorPhrases,
          undefined,
          undefined,
          undefined,
          dateValidatorMock
        );

        expect(a.isRangeDateValid).toBeFalsy();
        expect(a.errorString).toEqual('Både startdato og sluttdato er påkrevd');
      });
    });

    describe('Når required er satt til false og dato start og/eller end er null', () => {
      it('Så returnerer den isRangeDateValid true (begge er null) uten errorString', () => {
        const a = DateRangePickerValidation.validateRangeDate(
          {} as unknown as React.RefObject<React.ClassicComponent<DateRangePickerShape, {}>>,
          null,
          null,
          'id',
          false,
          ErrorPhrases,
          undefined,
          undefined,
          undefined,
          dateValidatorMock
        );

        expect(a.isRangeDateValid).toBeTruthy();
        expect(a.errorString).toEqual(undefined);
      });
      it('Så returnerer den isRangeDateValid true (start er null) uten errorString', () => {
        const a = DateRangePickerValidation.validateRangeDate(
          {} as unknown as React.RefObject<React.ClassicComponent<DateRangePickerShape, {}>>,
          null,
          moment('20.05.2020', 'DD.MM.YYYY'),
          'id',
          false,
          ErrorPhrases,
          undefined,
          undefined,
          undefined,
          dateValidatorMock
        );

        expect(a.isRangeDateValid).toBeTruthy();
        expect(a.errorString).toEqual(undefined);
      });
      it('Så returnerer den isRangeDateValid true (end er null) uten errorString', () => {
        const a = DateRangePickerValidation.validateRangeDate(
          {} as unknown as React.RefObject<React.ClassicComponent<DateRangePickerShape, {}>>,
          moment('20.05.2020', 'DD.MM.YYYY'),
          null,
          'id',
          false,
          ErrorPhrases,
          undefined,
          undefined,
          undefined,
          dateValidatorMock
        );

        expect(a.isRangeDateValid).toBeTruthy();
        expect(a.errorString).toEqual(undefined);
      });
    });
    describe('Når required er satt til false og dato start og/eller end er ugyldig', () => {
      it('Så returnerer den isRangeDateValid false (begge er ugyldige) med riktig errorString', () => {
        const a = DateRangePickerValidation.validateRangeDate(
          {} as unknown as React.RefObject<React.ClassicComponent<DateRangePickerShape, {}>>,
          moment('not a real date'),
          moment('not a real date'),
          'id',
          false,
          ErrorPhrases,
          undefined,
          undefined,
          undefined,
          dateValidatorMock
        );

        expect(a.isRangeDateValid).toBeFalsy();
        expect(a.errorString).toEqual('Perioden som er valgt er ufullstendig eller ugyldig');
      });
      it('Så returnerer den isRangeDateValid false (start er ugyldig) med riktig errorString', () => {
        const a = DateRangePickerValidation.validateRangeDate(
          {} as unknown as React.RefObject<React.ClassicComponent<DateRangePickerShape, {}>>,
          moment('not a real date'),
          moment('20.05.2020', 'DD.MM.YYYY'),
          'id',
          false,
          ErrorPhrases,
          undefined,
          undefined,
          undefined,
          dateValidatorMock
        );

        expect(a.isRangeDateValid).toBeFalsy();
        expect(a.errorString).toEqual('Perioden som er valgt er ufullstendig eller ugyldig');
      });
      it('Så returnerer den isRangeDateValid false (end er ugyldig) med riktig errorString', () => {
        const a = DateRangePickerValidation.validateRangeDate(
          {} as unknown as React.RefObject<React.ClassicComponent<DateRangePickerShape, {}>>,
          moment('20.05.2020', 'DD.MM.YYYY'),
          moment('not a real date'),
          'id',
          false,
          ErrorPhrases,
          undefined,
          undefined,
          undefined,
          dateValidatorMock
        );

        expect(a.isRangeDateValid).toBeFalsy();
        expect(a.errorString).toEqual('Perioden som er valgt er ufullstendig eller ugyldig');
      });
    });

    describe('Når datoen start og/eller end er gyldig men er satt under minDato', () => {
      it('Så returnerer den isRangeDateValid false (begge er under minDate) med riktig errorString', () => {
        const a = DateRangePickerValidation.validateRangeDate(
          {} as unknown as React.RefObject<React.ClassicComponent<DateRangePickerShape, {}>>,
          moment('20.05.2020', 'DD.MM.YYYY'),
          moment('20.05.2020', 'DD.MM.YYYY'),
          'id',
          false,
          ErrorPhrases,
          moment('20.10.2020', 'DD.MM.YYYY'),
          undefined,
          undefined,
          dateValidatorMock
        );

        expect(a.isRangeDateValid).toBeFalsy();
        expect(a.errorString).toEqual('Datoen er før den minste tillatte datoen');
      });

      it('Så returnerer den isRangeDateValid false (start er under minDate) med riktig errorString', () => {
        const a = DateRangePickerValidation.validateRangeDate(
          {} as unknown as React.RefObject<React.ClassicComponent<DateRangePickerShape, {}>>,
          moment('20.05.2020', 'DD.MM.YYYY'),
          moment('21.10.2020', 'DD.MM.YYYY'),
          'id',
          false,
          ErrorPhrases,
          moment('20.10.2020', 'DD.MM.YYYY'),
          undefined,
          undefined,
          dateValidatorMock
        );

        expect(a.isRangeDateValid).toBeFalsy();
        expect(a.errorString).toEqual('Datoen er før den minste tillatte datoen');
      });
    });

    describe('Når datoen start og/eller end er gyldig men er satt over maxDato', () => {
      it('Så returnerer den isRangeDateValid false (begge er over maxDato) med riktig errorString', () => {
        const a = DateRangePickerValidation.validateRangeDate(
          {} as unknown as React.RefObject<React.ClassicComponent<DateRangePickerShape, {}>>,
          moment('20.05.2020', 'DD.MM.YYYY'),
          moment('20.05.2020', 'DD.MM.YYYY'),
          'id',
          false,
          ErrorPhrases,
          undefined,
          moment('20.01.2020', 'DD.MM.YYYY'),
          undefined,
          dateValidatorMock
        );

        expect(a.isRangeDateValid).toBeFalsy();
        expect(a.errorString).toEqual('Datoen er etter den eldste tillatte datoen');
      });
      it('Så returnerer den isRangeDateValid false (end er over maxDato) med riktig errorString', () => {
        const a = DateRangePickerValidation.validateRangeDate(
          {} as unknown as React.RefObject<React.ClassicComponent<DateRangePickerShape, {}>>,
          moment('01.01.2020', 'DD.MM.YYYY'),
          moment('20.05.2020', 'DD.MM.YYYY'),
          'id',
          false,
          ErrorPhrases,
          undefined,
          moment('20.01.2020', 'DD.MM.YYYY'),
          undefined,
          dateValidatorMock
        );

        expect(a.isRangeDateValid).toBeFalsy();
        expect(a.errorString).toEqual('Datoen er etter den eldste tillatte datoen');
      });
    });

    describe('Når datoen start og/eller end utgjør en mindre periode enn tillatt', () => {
      it('Så returnerer den isRangeDateValid false med riktig errorString', () => {
        const a = DateRangePickerValidation.validateRangeDate(
          {} as unknown as React.RefObject<React.ClassicComponent<DateRangePickerShape, {}>>,
          moment('20.01.2020', 'DD.MM.YYYY'),
          moment('21.01.2020', 'DD.MM.YYYY'),
          'id',
          false,
          ErrorPhrases,
          undefined,
          undefined,
          10,
          dateValidatorMock
        );

        expect(a.isRangeDateValid).toBeFalsy();
        expect(a.errorString).toEqual('Perioden er ugyldig. Minimum antall dager er: 10');
      });
    });

    describe('Når datoen er null men inputValue for start har en verdi', () => {
      mockedInput1.value = '20.05.2020';
      mockedInput2.value = '';
      mockedElement.appendChild(mockedInput1);
      mockedElement.appendChild(mockedInput2);
      const mockedRef = { current: { container: mockedElement } };

      const a = DateRangePickerValidation.validateRangeDate(
        mockedRef as unknown as React.RefObject<React.ClassicComponent<DateRangePickerShape, {}>>,
        null,
        null,
        'id',
        false,
        ErrorPhrases,
        undefined,
        undefined,
        undefined,
        dateValidatorMock
      );
      it('Så returnerer den isRangeDateValid false med riktig errorString', () => {
        expect(a.isRangeDateValid).toBeFalsy();
        expect(a.errorString).toEqual('Perioden som er valgt er ufullstendig eller ugyldig');
      });
    });

    describe('Når datoen er null men inputValue for start har en verdi under MinDato', () => {
      const mockedRef = { current: { container: mockedElement } };
      const a = DateRangePickerValidation.validateRangeDate(
        mockedRef as unknown as React.RefObject<React.ClassicComponent<DateRangePickerShape, {}>>,
        null,
        null,
        'id',
        false,
        ErrorPhrases,
        moment('20.10.2020', 'DD.MM.YYYY'),
        undefined,
        undefined,
        dateValidatorMock
      );
      it('Så returnerer den isRangeDateValid false med riktig errorString', () => {
        expect(a.isRangeDateValid).toBeFalsy();
        expect(a.errorString).toEqual('Datoen er før den minste tillatte datoen');
      });
    });

    describe('Når datoen er null men inputValue for start har en verdi over MaxDato', () => {
      const mockedRef = { current: { container: mockedElement } };
      const a = DateRangePickerValidation.validateRangeDate(
        mockedRef as unknown as React.RefObject<React.ClassicComponent<DateRangePickerShape, {}>>,
        null,
        null,
        'id',
        false,
        ErrorPhrases,
        undefined,
        moment('20.01.2020', 'DD.MM.YYYY'),
        undefined,
        dateValidatorMock
      );
      it('Så returnerer den isRangeDateValid false med riktig errorString', () => {
        expect(a.isRangeDateValid).toBeFalsy();
        expect(a.errorString).toEqual('Datoen er etter den eldste tillatte datoen');
      });
    });

    describe('Når datoen er null men inputValue for start har en verdi slik at perioden er under minPerioden', () => {
      const mockedRef = { current: { container: mockedElement } };
      const a = DateRangePickerValidation.validateRangeDate(
        mockedRef as unknown as React.RefObject<React.ClassicComponent<DateRangePickerShape, {}>>,
        null,
        moment('21.05.2020', 'DD.MM.YYYY'),
        'id',
        false,
        ErrorPhrases,
        undefined,
        undefined,
        10,
        dateValidatorMock
      );
      it('Så returnerer den isRangeDateValid false med riktig errorString', () => {
        expect(a.isRangeDateValid).toBeFalsy();
        expect(a.errorString).toEqual('Perioden er ugyldig. Minimum antall dager er: 10');
      });
    });

    describe('Når datoen er null men inputValue for end har en verdi', () => {
      mockedElement.removeChild(mockedInput1);
      mockedElement.removeChild(mockedInput2);
      mockedInput1.value = '';
      mockedInput2.value = '20.05.2020';
      mockedElement.appendChild(mockedInput1);
      mockedElement.appendChild(mockedInput2);
      const mockedRef = { current: { container: mockedElement } };

      const a = DateRangePickerValidation.validateRangeDate(
        mockedRef as unknown as React.RefObject<React.ClassicComponent<DateRangePickerShape, {}>>,
        null,
        null,
        'id',
        false,
        ErrorPhrases,
        undefined,
        undefined,
        undefined,
        dateValidatorMock
      );
      it('Så returnerer den isRangeDateValid false med riktig errorString', () => {
        expect(a.isRangeDateValid).toBeFalsy();
        expect(a.errorString).toEqual('Perioden som er valgt er ufullstendig eller ugyldig');
      });
    });

    describe('Når datoen er null men inputValue for end har en verdi under MinDato', () => {
      const mockedRef = { current: { container: mockedElement } };
      const a = DateRangePickerValidation.validateRangeDate(
        mockedRef as unknown as React.RefObject<React.ClassicComponent<DateRangePickerShape, {}>>,
        null,
        null,
        'id',
        false,
        ErrorPhrases,
        moment('20.10.2020', 'DD.MM.YYYY'),
        undefined,
        undefined,
        dateValidatorMock
      );
      it('Så returnerer den isRangeDateValid false med riktig errorString', () => {
        expect(a.isRangeDateValid).toBeFalsy();
        expect(a.errorString).toEqual('Datoen er før den minste tillatte datoen');
      });
    });

    describe('Når datoen er null men inputValue for end har en verdi over MaxDato', () => {
      const mockedRef = { current: { container: mockedElement } };
      const a = DateRangePickerValidation.validateRangeDate(
        mockedRef as unknown as React.RefObject<React.ClassicComponent<DateRangePickerShape, {}>>,
        null,
        null,
        'id',
        false,
        ErrorPhrases,
        undefined,
        moment('20.01.2020', 'DD.MM.YYYY'),
        undefined,
        dateValidatorMock
      );
      it('Så returnerer den isRangeDateValid false med riktig errorString', () => {
        expect(a.isRangeDateValid).toBeFalsy();
        expect(a.errorString).toEqual('Datoen er etter den eldste tillatte datoen');
      });
    });

    describe('Når datoen er null men inputValue for end har en verdi slik at perioden er under minPerioden', () => {
      const mockedRef = { current: { container: mockedElement } };
      const a = DateRangePickerValidation.validateRangeDate(
        mockedRef as unknown as React.RefObject<React.ClassicComponent<DateRangePickerShape, {}>>,
        moment('19.05.2020', 'DD.MM.YYYY'),
        null,
        'id',
        false,
        ErrorPhrases,
        undefined,
        undefined,
        10,
        dateValidatorMock
      );
      it('Så returnerer den isRangeDateValid false med riktig errorString', () => {
        expect(a.isRangeDateValid).toBeFalsy();
        expect(a.errorString).toEqual('Perioden er ugyldig. Minimum antall dager er: 10');
      });
    });

    describe('Når datoene er gyldige og innen min/maxdato men at optional dateValidator returnerer false', () => {
      dateValidatorMock.mockReturnValue(false);
      const dato1 = moment('20.05.2020', 'DD.MM.YYYY');
      const dato2 = moment('22.05.2020', 'DD.MM.YYYY');
      const a = DateRangePickerValidation.validateRangeDate(
        {} as unknown as React.RefObject<React.ClassicComponent<DateRangePickerShape, {}>>,
        dato1,
        dato2,
        'id',
        true,
        ErrorPhrases,
        moment('20.01.2020', 'DD.MM.YYYY'),
        moment('20.10.2020', 'DD.MM.YYYY'),
        1,
        dateValidatorMock
      );
      it('Så kaller den dateValidator med riktig parametre', () => {
        expect(dateValidatorMock).toHaveBeenCalledWith('id', dato1, dato2);
      });
      it('Så returnerer den isRangeDateValid false med riktig errorString', () => {
        expect(a.isRangeDateValid).toBeFalsy();
        expect(a.errorString).toEqual('Perioden som er valgt er ufullstendig eller ugyldig');
      });
    });
  });
});
