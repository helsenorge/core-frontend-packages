import moment from 'moment';

import { DateRangePicker } from '../date-range-picker';
import TimeInput from '../time-input';
import { DatePickerErrorPhrases } from './../date-range-picker/date-range-picker-types';
import * as DateTimePickerUtils from './date-time-picker-utils';

describe('DateTimePicker date-time-picker-utils', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Gitt at getFullMomentDate kalles', () => {
    describe('Når den kalles med undefined date', () => {
      const a = DateTimePickerUtils.getFullMomentDate(undefined, '12:00');
      it('Så returnerer den undefined', () => {
        expect(a).toEqual(undefined);
      });
    });
    describe('Når den kalles med undefined time', () => {
      const d = moment('01.01.2020', 'DD.MM.YYYY');
      const a = DateTimePickerUtils.getFullMomentDate(d, undefined);
      it('Så returnerer den datoen med 00:00 i tid', () => {
        expect(a?.format('DD.MM.YYYY HH:mm')).toEqual('01.01.2020 00:00');
      });
    });
    describe('Når den kalles med både date og time', () => {
      const d = moment('01.01.2020', 'DD.MM.YYYY');
      const t = '12:30';
      const a = DateTimePickerUtils.getFullMomentDate(d, t);
      it('Så returnerer den en moment dato med riktig dag og tidspunkt', () => {
        expect(a?.format('DD.MM.YYYY HH:mm')).toEqual('01.01.2020 12:30');
      });
    });
  });

  describe('Gitt at isFullDateTimeValid kalles', () => {
    describe('Når den kalles med undefined dato og required = true', () => {
      const a = DateTimePickerUtils.isFullDateTimeValid(undefined, '12:00', true, undefined, undefined, true);
      it('Så returnerer den isValid = false', () => {
        expect(a).toBeFalsy();
      });
    });
    describe('Når den kalles med undefined tid og required = true', () => {
      const d = moment('01.01.2020', 'DD.MM.YYYY');
      const a = DateTimePickerUtils.isFullDateTimeValid(d, undefined, true, undefined, undefined, true);
      it('Så returnerer den isValid = false', () => {
        expect(a).toBeFalsy();
      });
    });
    describe('Når den kalles med undefined dato men required = false', () => {
      const a = DateTimePickerUtils.isFullDateTimeValid(undefined, '12:00', false, undefined, undefined, true);
      it('Så returnerer den isValid = true', () => {
        expect(a).toBeTruthy();
      });
    });
    describe('Når den kalles med undefined tid men required = false', () => {
      const d = moment('01.01.2020', 'DD.MM.YYYY');
      const a = DateTimePickerUtils.isFullDateTimeValid(d, undefined, false, undefined, undefined, true);
      it('Så returnerer den isValid = true', () => {
        expect(a).toBeTruthy();
      });
    });
    describe('Når den kalles med en dato større enn minTid', () => {
      const d = moment('01.01.2020', 'DD.MM.YYYY');
      const min = moment('01.01.2019', 'DD.MM.YYYY');
      const a = DateTimePickerUtils.isFullDateTimeValid(d, '12:00', false, min, undefined, true);
      it('Så returnerer den isValid = true', () => {
        expect(a).toBeTruthy();
      });
    });

    describe('Når den kalles med en dato mindre enn minTid', () => {
      const d = moment('01.01.2020', 'DD.MM.YYYY');
      const min = moment('15.01.2020', 'DD.MM.YYYY');
      const a = DateTimePickerUtils.isFullDateTimeValid(d, '12:00', false, min, undefined, true);
      it('Så returnerer den isValid = false', () => {
        expect(a).toBeFalsy();
      });
    });

    describe('Når den kalles med en dato lik minTid', () => {
      const d = moment('01.01.2020', 'DD.MM.YYYY');
      const min = moment('01.01.2020', 'DD.MM.YYYY');
      const a = DateTimePickerUtils.isFullDateTimeValid(d, '00:00', false, min, undefined, true);
      it('Så returnerer den isValid = true', () => {
        expect(a).toBeTruthy();
      });
    });

    describe('Når den kalles med en dato før maxTid', () => {
      const d = moment('01.01.2020', 'DD.MM.YYYY');
      const max = moment('20.01.2020', 'DD.MM.YYYY');
      const a = DateTimePickerUtils.isFullDateTimeValid(d, '12:00', false, undefined, max, true);
      it('Så returnerer den isValid = true', () => {
        expect(a).toBeTruthy();
      });
    });

    describe('Når den kalles med en dato som overstiger maxTid', () => {
      const d = moment('01.01.2020', 'DD.MM.YYYY');
      const max = moment('20.12.2019', 'DD.MM.YYYY');
      const a = DateTimePickerUtils.isFullDateTimeValid(d, '12:00', false, undefined, max, true);
      it('Så returnerer den isValid = false', () => {
        expect(a).toBeFalsy();
      });
    });

    describe('Når den kalles med en dato lik maxTid', () => {
      const d = moment('01.01.2020', 'DD.MM.YYYY');
      const max = moment('01.01.2020', 'DD.MM.YYYY');
      const a = DateTimePickerUtils.isFullDateTimeValid(d, '00:00', false, undefined, max, true);
      it('Så returnerer den isValid = true', () => {
        expect(a).toBeTruthy();
      });
    });

    describe('Når den kalles med isOtherFieldValidated false, mens feltene er required', () => {
      const d = moment('01.01.2020', 'DD.MM.YYYY');
      const a = DateTimePickerUtils.isFullDateTimeValid(d, '12:00', true, undefined, undefined, false);
      it('Så verifiserer den begge feltene på nytt og returnerer isValid = true', () => {
        expect(a).toBeTruthy();
      });
    });

    describe('Når den kalles med isOtherFieldValidated false, mens feltene ikke er required', () => {
      const d = moment('01.01.2020', 'DD.MM.YYYY');
      const a = DateTimePickerUtils.isFullDateTimeValid(d, '12:00', false, undefined, undefined, false);
      it('Så er den systematisk isValid = false', () => {
        expect(a).toBeFalsy();
      });
    });

    describe('Når isOtherFieldValidated er false', () => {
      describe('Når den er required', () => {
        describe('Når den kalles med 60 minutter', () => {
          const d = moment('01.01.2020', 'DD.MM.YYYY');
          const a = DateTimePickerUtils.isFullDateTimeValid(d, '12:60', true, undefined, undefined, false);
          it('Så er den false', () => {
            expect(a).toBeFalsy();
          });
        });

        describe('Når den kalles med 111 minutter', () => {
          const d = moment('01.01.2020', 'DD.MM.YYYY');
          const a = DateTimePickerUtils.isFullDateTimeValid(d, '12:111', true, undefined, undefined, false);
          it('Så er den false', () => {
            expect(a).toBeFalsy();
          });
        });

        describe('Når den kalles med 555 minutter', () => {
          const d = moment('01.01.2020', 'DD.MM.YYYY');
          const a = DateTimePickerUtils.isFullDateTimeValid(d, '12:555', true, undefined, undefined, false);
          it('Så er den false', () => {
            expect(a).toBeFalsy();
          });
        });

        describe('Når den kalles med 666 minutter', () => {
          const d = moment('01.01.2020', 'DD.MM.YYYY');
          const a = DateTimePickerUtils.isFullDateTimeValid(d, '12:666', true, undefined, undefined, false);
          it('Så er den false', () => {
            expect(a).toBeFalsy();
          });
        });
      });

      describe('Når den ikke er required ', () => {
        describe('Når den kalles med 60 minutter', () => {
          const d = moment('01.01.2020', 'DD.MM.YYYY');
          const a = DateTimePickerUtils.isFullDateTimeValid(d, '12:60', false, undefined, undefined, false);
          it('Så er den false', () => {
            expect(a).toBeFalsy();
          });
        });

        describe('Når den kalles med 111 minutter', () => {
          const d = moment('01.01.2020', 'DD.MM.YYYY');
          const a = DateTimePickerUtils.isFullDateTimeValid(d, '12:111', false, undefined, undefined, false);
          it('Så er den false', () => {
            expect(a).toBeFalsy();
          });
        });

        describe('Når den kalles med 555 minutter', () => {
          const d = moment('01.01.2020', 'DD.MM.YYYY');
          const a = DateTimePickerUtils.isFullDateTimeValid(d, '12:555', false, undefined, undefined, false);
          it('Så er den false', () => {
            expect(a).toBeFalsy();
          });
        });

        describe('Når den kalles med 666 minutter', () => {
          const d = moment('01.01.2020', 'DD.MM.YYYY');
          const a = DateTimePickerUtils.isFullDateTimeValid(d, '12:666', false, undefined, undefined, false);
          it('Så er den false', () => {
            expect(a).toBeFalsy();
          });
        });
      });
    });
    describe('Når isOtherFieldValidated er true', () => {
      describe('Når den er required', () => {
        describe('Når den kalles med 60 minutter', () => {
          const d = moment('01.01.2020', 'DD.MM.YYYY');
          const a = DateTimePickerUtils.isFullDateTimeValid(d, '12:60', true, undefined, undefined, true);
          it('Så er den false', () => {
            expect(a).toBeFalsy();
          });
        });

        describe('Når den kalles med 111 minutter', () => {
          const d = moment('01.01.2020', 'DD.MM.YYYY');
          const a = DateTimePickerUtils.isFullDateTimeValid(d, '12:111', true, undefined, undefined, true);
          it('Så er den false', () => {
            expect(a).toBeFalsy();
          });
        });

        describe('Når den kalles med 555 minutter', () => {
          const d = moment('01.01.2020', 'DD.MM.YYYY');
          const a = DateTimePickerUtils.isFullDateTimeValid(d, '12:555', true, undefined, undefined, true);
          it('Så er den false', () => {
            expect(a).toBeFalsy();
          });
        });

        describe('Når den kalles med 666 minutter', () => {
          const d = moment('01.01.2020', 'DD.MM.YYYY');
          const a = DateTimePickerUtils.isFullDateTimeValid(d, '12:666', true, undefined, undefined, true);
          it('Så er den false', () => {
            expect(a).toBeFalsy();
          });
        });
      });

      describe('Når den ikke er required ', () => {
        describe('Når den kalles med 60 minutter', () => {
          const d = moment('01.01.2020', 'DD.MM.YYYY');
          const a = DateTimePickerUtils.isFullDateTimeValid(d, '12:60', false, undefined, undefined, true);
          it('Så er den false', () => {
            expect(a).toBeFalsy();
          });
        });

        describe('Når den kalles med 111 minutter', () => {
          const d = moment('01.01.2020', 'DD.MM.YYYY');
          const a = DateTimePickerUtils.isFullDateTimeValid(d, '12:111', false, undefined, undefined, true);
          it('Så er den false', () => {
            expect(a).toBeFalsy();
          });
        });

        describe('Når den kalles med 555 minutter', () => {
          const d = moment('01.01.2020', 'DD.MM.YYYY');
          const a = DateTimePickerUtils.isFullDateTimeValid(d, '12:555', false, undefined, undefined, true);
          it('Så er den false', () => {
            expect(a).toBeFalsy();
          });
        });

        describe('Når den kalles med 666 minutter', () => {
          const d = moment('01.01.2020', 'DD.MM.YYYY');
          const a = DateTimePickerUtils.isFullDateTimeValid(d, '12:666', false, undefined, undefined, true);
          it('Så er den false', () => {
            expect(a).toBeFalsy();
          });
        });
      });
    });
  });

  describe('Gitt at getErrorString kalles', () => {
    describe('Når den er valid som default, har ingen verdi og ikke er required', () => {
      const a = DateTimePickerUtils.getErrorString({
        valid: true,
        isRequired: false,
      });
      it('Så returnerer den undefined', () => {
        expect(a).toEqual(undefined);
      });
    });

    describe('Når den ikke er valid har ingen verdi og ikke er required', () => {
      it('Så returnerer den default meldingen for Ugyldig verdi', () => {
        const a = DateTimePickerUtils.getErrorString({
          valid: false,
          isRequired: false,
        });
        expect(a).toEqual('Tidspunktet er ugyldig');
      });
      it('Så returnerer den resources meldingen for Ugyldig verdi', () => {
        const a = DateTimePickerUtils.getErrorString({
          valid: false,
          resources: { timeResources: { errorResources: { errorInvalidTime: 'errorInvalidTime' } } },
          isRequired: false,
        });

        expect(a).toEqual('errorInvalidTime');
      });
    });

    describe('Når den har ingen verdi og er required', () => {
      it('Så returnerer den default meldingen for Påkrevd dato', () => {
        const a = DateTimePickerUtils.getErrorString({
          valid: false,
          isRequired: true,
        });

        expect(a).toEqual('Datoen er påkrevd');
      });
      it('Så returnerer den default meldingen for Påkrevd dato', () => {
        const a = DateTimePickerUtils.getErrorString({
          valid: false,
          resources: { dateErrorResources: { errorRequiredDate: 'errorRequiredDate' } as DatePickerErrorPhrases },
          isRequired: true,
        });

        expect(a).toEqual('errorRequiredDate');
      });
    });

    describe('Når den har ingen dato (men har tid) og er required', () => {
      it('Så returnerer den default meldingen for Påkrevd dato', () => {
        const a = DateTimePickerUtils.getErrorString({
          timeString: '12:00',
          valid: false,
          isRequired: true,
        });

        expect(a).toEqual('Datoen er påkrevd');
      });
      it('Så returnerer den default meldingen for Påkrevd dato', () => {
        const a = DateTimePickerUtils.getErrorString({
          timeString: '12:00',
          resources: { dateErrorResources: { errorRequiredDate: 'errorRequiredDate' } as DatePickerErrorPhrases },
          valid: false,
          isRequired: true,
        });

        expect(a).toEqual('errorRequiredDate');
      });
    });

    describe('Når den har ingen dato (men har tid) og har isDateRequired', () => {
      it('Så returnerer den default meldingen for Påkrevd dato', () => {
        const a = DateTimePickerUtils.getErrorString({
          timeString: '12:00',
          valid: false,
          isDateRequired: true,
        });

        expect(a).toEqual('Datoen er påkrevd');
      });
      it('Så returnerer den default meldingen for Påkrevd dato', () => {
        const a = DateTimePickerUtils.getErrorString({
          timeString: '12:00',
          resources: { dateErrorResources: { errorRequiredDate: 'errorRequiredDate' } as DatePickerErrorPhrases },
          valid: false,
          isDateRequired: true,
        });

        expect(a).toEqual('errorRequiredDate');
      });
    });

    describe('Når den har ingen tid og er required', () => {
      const d = moment('20.01.2020', 'DD.MM.YYYY');
      it('Så returnerer den default meldingen for Påkrevd tid', () => {
        const a = DateTimePickerUtils.getErrorString({
          date: d,

          valid: false,
          isRequired: true,
        });

        expect(a).toEqual('Tidspunktet er påkrevd');
      });
      it('Så returnerer den default meldingen for Påkrevd tid', () => {
        const a = DateTimePickerUtils.getErrorString({
          date: d,
          resources: { timeResources: { errorResources: { errorRequiredTime: 'errorRequiredTime' } } },
          valid: false,
          isRequired: true,
        });

        expect(a).toEqual('errorRequiredTime');
      });
    });

    describe('Når den har ingen tid og har isTimeRequired', () => {
      const d = moment('20.01.2020', 'DD.MM.YYYY');
      it('Så returnerer den default meldingen for Påkrevd tid', () => {
        const a = DateTimePickerUtils.getErrorString({
          date: d,
          valid: false,
          isTimeRequired: true,
        });

        expect(a).toEqual('Tidspunktet er påkrevd');
      });
      it('Så returnerer den default meldingen for Påkrevd tid', () => {
        const a = DateTimePickerUtils.getErrorString({
          date: d,
          resources: { timeResources: { errorResources: { errorRequiredTime: 'errorRequiredTime' } } },
          valid: false,
          isTimeRequired: true,
        });

        expect(a).toEqual('errorRequiredTime');
      });
    });

    describe('Når den har dato som er mindre enn minDate', () => {
      const d = moment('01.01.2020', 'DD.MM.YYYY');
      const min = moment('20.01.2020', 'DD.MM.YYYY');
      it('Så returnerer den default meldingen for minDato', () => {
        const a = DateTimePickerUtils.getErrorString({
          date: d,
          valid: false,
          minimumDateTime: min,
        });

        expect(a).toEqual('Tispunktet som er valgt er før det minste tillatte tidspunktet: 20.01.2020 00:00');
      });

      it('Så returnerer den default meldingen for minDato', () => {
        const a = DateTimePickerUtils.getErrorString({
          date: d,
          resources: { timeResources: { errorResources: { errorTimeBeforeMin: 'errorTimeBeforeMin' } } },
          valid: false,
          minimumDateTime: min,
        });

        expect(a).toEqual('errorTimeBeforeMin: 20.01.2020 00:00');
      });
    });

    describe('Når den har dato som overstiger maxDate', () => {
      const d = moment('20.01.2020', 'DD.MM.YYYY');
      const max = moment('01.01.2020', 'DD.MM.YYYY');
      it('Så returnerer den default meldingen for minDato', () => {
        const a = DateTimePickerUtils.getErrorString({
          date: d,
          valid: false,
          maximumDateTime: max,
        });
        expect(a).toEqual('Tispunktet som er valgt er etter det eldste tillatte tidspunktet: 01.01.2020 00:00');
      });

      it('Så returnerer den default meldingen for maxDate', () => {
        const a = DateTimePickerUtils.getErrorString({
          date: d,
          resources: { timeResources: { errorResources: { errorTimeAfterMax: 'errorTimeAfterMax' } } },
          valid: false,
          maximumDateTime: max,
        });

        expect(a).toEqual('errorTimeAfterMax: 01.01.2020 00:00');
      });
    });

    describe('Når nested TimeInput instance ikke er valid', () => {
      const timeFieldInstance = { isValid: () => false, getErrorString: () => 'timeFieldErrorString' } as TimeInput;
      it('Så returnerer den errorString fra TimeInput', () => {
        const a = DateTimePickerUtils.getErrorString({
          valid: false,
          timeFieldInstance,
        });

        expect(a).toEqual('timeFieldErrorString');
      });
    });

    describe('Når nested DateRangePicker instance ikke er valid', () => {
      const dateFieldInstance = { isValid: () => false, getErrorString: () => 'dateFieldErrorString' } as DateRangePicker;
      it('Så returnerer den errorString fra DateRangePicker', () => {
        const a = DateTimePickerUtils.getErrorString({
          valid: false,
          dateFieldInstance,
        });

        expect(a).toEqual('dateFieldErrorString');
      });
    });

    describe('Når det brukes custom errorMessage stringog at feltet ikke er valid', () => {
      it('Så returnerer den custom stringen', () => {
        const a = DateTimePickerUtils.getErrorString({
          date: moment(),
          timeString: '12:00',
          valid: false,
          errorMessage: 'errorMessageString',
        });

        expect(a).toEqual('errorMessageString');
      });
    });

    describe('Når det brukes custom errorMessage funksjon og at feltet ikke er valid', () => {
      it('Så kjører den funkjsonen og returnerer den errorString', () => {
        const a = DateTimePickerUtils.getErrorString({
          date: moment(),
          timeString: '12:00',
          valid: false,
          errorMessage: () => 'errorMessageString',
        });
        expect(a).toEqual('errorMessageString');
      });
    });
  });
});
