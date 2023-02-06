import { mount } from 'enzyme';
import moment from 'moment';

import { DateRangePickerProps } from './date-range-picker-types';
import * as DateRangePickerUtils from './date-range-picker-utils';

describe('DateRangePicker date-range-picker-utils', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('Gitt at renderYearsOptions kalles', () => {
    describe('Når den har min 2010 og max 2020', () => {
      const a = DateRangePickerUtils.renderYearsOptions(2010, 2020);
      it('Så har den en length på 11', () => {
        expect(a.length).toEqual(11);
      });
      it('Så består hver entry av en option med riktig value og text', () => {
        expect(JSON.stringify(a[0])).toEqual(
          '{"type":"option","key":"2010","ref":null,"props":{"value":2010,"children":2010},"_owner":null,"_store":{}}'
        );
      });
    });
  });

  describe('Gitt at renderMonthsPicker kalles', () => {
    const fnMock = jest.fn();
    describe('Når den får minDato i februar og MaxDato i november', () => {
      const a = DateRangePickerUtils.renderMonthsPicker(
        moment('20.10.2020', 'DD.MM.YYYY'),
        fnMock,
        moment().localeData(),
        moment('20.02.2020', 'DD.MM.YYYY'),
        moment('20.11.2020', 'DD.MM.YYYY')
      );

      it('Så returnerer den en dropdown med riktig className', () => {
        expect(a.props.className).toEqual('datepicker__month-selector');
        expect(a).toMatchSnapshot();
      });
      it('Så returnerer den 12 <option>, én for hver måned', () => {
        expect(a.props.children.length).toEqual(12);
      });
      it('Så har den selected verdien satt til riktig måneden (starter fra 0 pga Array index)', () => {
        expect(a.props.value).toEqual(9);
      });
      it('Så har den riktig aria-label', () => {
        expect(a.props['aria-label']).toEqual('Velg måned');
      });
    });

    describe('Når den får en minDato som har lik måned som maxDato', () => {
      const a = DateRangePickerUtils.renderMonthsPicker(
        moment('20.10.2020', 'DD.MM.YYYY'),
        fnMock,
        moment().localeData(),
        moment('01.10.2020', 'DD.MM.YYYY'),
        moment('25.10.2020', 'DD.MM.YYYY')
      );

      it('Så returnerer den visnign av bare den ene måneden - uten dropdown', () => {
        expect(a.props.className).toEqual('datepicker__month-view');
        expect(a.props.children).toEqual('October');
        expect(a).toMatchSnapshot();
      });
    });

    describe('Når locale er satt til engelsk', () => {
      moment.locale('en-GB');
      const a = DateRangePickerUtils.renderMonthsPicker(
        moment('20.10.2020', 'DD.MM.YYYY'),
        fnMock,
        moment().localeData(),
        moment('20.02.2020', 'DD.MM.YYYY'),
        moment('20.11.2020', 'DD.MM.YYYY')
      );

      it('Så er språk riktig oversatt, og aria-label er på engelsk', () => {
        expect(a.props['aria-label']).toEqual('Pick month');
      });
    });
  });

  describe('Gitt at renderYearsPicker kalles', () => {
    moment.locale('nb');
    const fnMock = jest.fn();
    describe('Når min og max dato er undefined', () => {
      const a = DateRangePickerUtils.renderYearsPicker(
        moment('20.10.2015', 'DD.MM.YYYY'),
        fnMock,
        moment().localeData(),
        undefined,
        undefined
      );
      it('Så returnerer den 201 <option>, 100 år fremover og 100 år bakover', () => {
        expect(a.props.children.length).toEqual(201);
      });
      it('Så har den selected verdien satt til riktig år', () => {
        expect(a.props.value).toEqual(2015);
      });
      it('Så er aria-label riktig', () => {
        expect(a.props['aria-label']).toEqual('Velg år');
      });
    });
    describe('Når den får minDato i 2010 og MaxDato i 2020', () => {
      const a = DateRangePickerUtils.renderYearsPicker(
        moment('20.10.2015', 'DD.MM.YYYY'),
        fnMock,
        moment().localeData(),
        moment('20.02.2010', 'DD.MM.YYYY'),
        moment('20.11.2020', 'DD.MM.YYYY')
      );

      it('Så returnerer den en dropdown med riktig className', () => {
        expect(a.props.className).toEqual('datepicker__year-selector');
        expect(a).toMatchSnapshot();
      });
      it('Så returnerer den 11 <option>, én for hvert år', () => {
        expect(a.props.children.length).toEqual(11);
      });
      it('Så har den selected verdien satt til riktig år', () => {
        expect(a.props.value).toEqual(2015);
      });
    });

    describe('Når den får en minDato som har lik år som maxDato', () => {
      const a = DateRangePickerUtils.renderYearsPicker(
        moment('20.10.2020', 'DD.MM.YYYY'),
        fnMock,
        moment().localeData(),
        moment('01.10.2020', 'DD.MM.YYYY'),
        moment('25.10.2020', 'DD.MM.YYYY')
      );

      it('Så returnerer den visning av bare det ene året - uten dropdown', () => {
        expect(a.props.className).toEqual('datepicker__year-view');
        expect(a.props.children).toEqual(2020);
        expect(a).toMatchSnapshot();
      });
    });

    describe('Når locale er satt til engelsk', () => {
      moment.locale('en-GB');
      const a = DateRangePickerUtils.renderYearsPicker(
        moment('20.10.2015', 'DD.MM.YYYY'),
        fnMock,
        moment().localeData(),
        undefined,
        undefined
      );
      it('Så er språk riktig oversatt, og aria-label er på engelsk', () => {
        expect(a.props['aria-label']).toEqual('Pick year');
      });
    });
  });

  describe('Gitt at getCSSClasses kalles', () => {
    moment.locale('nb');
    describe('Når den har både hasValidation og hasErrors false', () => {
      const a = DateRangePickerUtils.getCSSClasses('baseClass', 'errorClass', false, false, 'extraClass');
      it('Så returnerer den riktig class utenom validation og error', () => {
        expect(a).toEqual('baseClass extraClass');
      });
    });

    describe('Når den har hasValidation false og hasErrors true', () => {
      const a = DateRangePickerUtils.getCSSClasses('baseClass', 'errorClass', false, true, 'extraClass');
      it('Så returnerer den riktig class med validation og error', () => {
        expect(a).toEqual('baseClass errorClass extraClass');
      });
    });

    describe('Når den har hasValidation true og hasErrors false', () => {
      const a = DateRangePickerUtils.getCSSClasses('baseClass', 'errorClass', true, false, 'extraClass');
      it('Så returnerer den riktig class med validation og error', () => {
        expect(a).toEqual('baseClass mol_validation extraClass');
      });
    });

    describe('Når den har både hasValidation og hasErrors true', () => {
      const a = DateRangePickerUtils.getCSSClasses('baseClass', 'errorClass', true, true, 'extraClass');
      it('Så returnerer den riktig class med validation og error', () => {
        expect(a).toEqual('baseClass mol_validation mol_validation--active errorClass extraClass');
      });
    });
  });

  describe('Gitt at notifyValidated kalles', () => {
    describe('Når datoen er gyldig', () => {
      it('Så kaller den callbacks methoder med riktig argumenter', () => {
        const onValidatedMock1 = jest.fn();
        const onErrorMock1 = jest.fn();
        DateRangePickerUtils.notifyValidated('id', moment('20.10.2020', 'DD.MM.YYYY'), true, '', onValidatedMock1, onErrorMock1);

        expect(onValidatedMock1).toHaveBeenCalledWith(true);
        expect(onErrorMock1).not.toHaveBeenCalled();
      });
    });

    describe('Når datoen er ikke gyldig', () => {
      it('Så kaller den callbacks methoder med riktig argumenter', () => {
        const onValidatedMock2 = jest.fn();
        const onErrorMock2 = jest.fn();
        DateRangePickerUtils.notifyValidated('id', moment('20.10.2020', 'DD.MM.YYYY'), false, 'myErrorMsg', onValidatedMock2, onErrorMock2);

        expect(onValidatedMock2).toHaveBeenCalledWith(false);
        expect(onErrorMock2).toHaveBeenCalledWith(moment('20.10.2020', 'DD.MM.YYYY'), 'myErrorMsg', 'id');
      });
    });
  });

  describe('Gitt at renderCalendarIcon kalles', () => {
    describe('Når den instansieres med onClick method og custom css class', () => {
      const a = DateRangePickerUtils.renderCalendarIcon(jest.fn(), 'customClassName');
      const wrapper = mount(a);
      it('Så renderes ikonet riktig', () => {
        expect(wrapper.render()).toMatchSnapshot();
      });
    });
  });

  describe('Gitt at renderChevronIcon kalles', () => {
    describe('Når den instansieres med "prev" direction og custom css class', () => {
      const a = DateRangePickerUtils.renderChevronIcon('prev', 'customClassName');
      const wrapper = mount(a);
      it('Så renderes ikonet riktig', () => {
        expect(wrapper.render()).toMatchSnapshot();
      });
    });

    describe('Når den instansieres med "next" direction og custom css class', () => {
      const a = DateRangePickerUtils.renderChevronIcon('next', 'customClassName');
      const wrapper = mount(a);
      it('Så renderes ikonet riktig', () => {
        expect(wrapper.render()).toMatchSnapshot();
      });
    });
  });

  describe('Gitt at renderMonthHeaderSimplified kalles', () => {
    describe('Når den får datoen 20.10.2015', () => {
      const a = DateRangePickerUtils.renderMonthHeaderSimplified({ month: moment('20.10.2015', 'DD.MM.YYYY') }, moment.localeData());
      it('Så returnerer den riktig string', () => {
        expect(a).toEqual('oktober 2015');
      });
    });
  });

  describe('Gitt at renderMonthHeader kalles', () => {
    describe('Når den får datoen 20.10.2015', () => {
      const a = DateRangePickerUtils.renderMonthHeader(
        { month: moment('20.10.2015', 'DD.MM.YYYY'), onMonthSelect: jest.fn(), onYearSelect: jest.fn() },
        moment.localeData(),
        moment('20.02.2010', 'DD.MM.YYYY'),
        moment('20.11.2020', 'DD.MM.YYYY')
      );
      it('Så returnerer den en komponent med riktig className og nested dropdowns (som er allerede testet dypere over)', () => {
        expect(a.props.className).toEqual('datepicker__month-year-selector');
        expect(a).toMatchSnapshot();
      });
    });
  });

  describe('Gitt at getDateNOString kalles', () => {
    describe('Når den kalles med datoen 20.10.2015', () => {
      const a = DateRangePickerUtils.getDateNOString(moment('20.10.2015', 'DD.MM.YYYY'));
      it('Så returnerer den 20.10.2015', () => {
        expect(a).toEqual('20.10.2015');
      });
    });

    describe('Når den kalles med undefined', () => {
      it('Så returnerer den tom streng', () => {
        const a = DateRangePickerUtils.getDateNOString(undefined);
        expect(a).toEqual('');
      });
    });

    describe('Når den kalles med null', () => {
      const a = DateRangePickerUtils.getDateNOString(null);
      it('Så returnerer den tom streng', () => {
        expect(a).toEqual('');
      });
    });
  });

  describe('Gitt at getDefaultVisibleMonth kalles', () => {
    describe('Når singleDateValue, startDateValue, endDateValue, initialDate og minimumDate er satt', () => {
      it('Så returnerer den måneden for singleDateValue', () => {
        const props = {
          singleDateValue: moment('01.01.2021', 'DD.MM.YYYY'),
          startDateValue: moment('01.02.2021', 'DD.MM.YYYY'),
          endDateValue: moment('01.03.2021', 'DD.MM.YYYY'),
          initialDate: moment('01.04.2021', 'DD.MM.YYYY'),
          minimumDate: moment('01.05.2021', 'DD.MM.YYYY'),
        } as DateRangePickerProps;

        const date = DateRangePickerUtils.getDefaultVisibleMonth(props);

        expect((date as moment.Moment).format('MM-YYYY')).toEqual('01-2021');
      });
    });
    describe('Når startDateValue, endDateValue, initialDate og minimumDate er satt', () => {
      it('Så returnerer den måneden for startDateValue', () => {
        const props = {
          startDateValue: moment('01.02.2021', 'DD.MM.YYYY'),
          endDateValue: moment('01.03.2021', 'DD.MM.YYYY'),
          initialDate: moment('01.04.2021', 'DD.MM.YYYY'),
          minimumDate: moment('01.05.2021', 'DD.MM.YYYY'),
        } as DateRangePickerProps;

        const date = DateRangePickerUtils.getDefaultVisibleMonth(props);

        expect((date as moment.Moment).format('MM-YYYY')).toEqual('02-2021');
      });
    });
    describe('Når endDateValue, initialDate og minimumDate er satt', () => {
      it('Så returnerer den måneden for endDateValue', () => {
        const props = {
          endDateValue: moment('01.03.2021', 'DD.MM.YYYY'),
          initialDate: moment('01.04.2021', 'DD.MM.YYYY'),
          minimumDate: moment('01.05.2021', 'DD.MM.YYYY'),
        } as DateRangePickerProps;

        const date = DateRangePickerUtils.getDefaultVisibleMonth(props);

        expect((date as moment.Moment).format('MM-YYYY')).toEqual('03-2021');
      });
    });
    describe('Når initialDate og minimumDate er satt', () => {
      it('Så returnerer den måneden for initialDate', () => {
        const props = {
          initialDate: moment('01.04.2021', 'DD.MM.YYYY'),
          minimumDate: moment('01.05.2021', 'DD.MM.YYYY'),
        } as DateRangePickerProps;

        const date = DateRangePickerUtils.getDefaultVisibleMonth(props);

        expect((date as moment.Moment).format('MM-YYYY')).toEqual('04-2021');
      });
    });
    describe('Når minimumDate er satt', () => {
      it('Så returnerer den måneden for minimumDate', () => {
        const props = {
          minimumDate: moment('01.05.2021', 'DD.MM.YYYY'),
        } as DateRangePickerProps;

        const date = DateRangePickerUtils.getDefaultVisibleMonth(props);

        expect((date as moment.Moment).format('MM-YYYY')).toEqual('05-2021');
      });
    });
    describe('Når ingen av singleDateValue, startDateValue, endDateValue, initialDate og minimumDate er satt', () => {
      it('Så returnerer den nåværende måned', () => {
        const originalDateNow = Date.now;
        Date.now = jest.fn(() => new Date('2050-12-01T12:13:14.000Z').getTime());
        const props = {} as DateRangePickerProps;

        const date = DateRangePickerUtils.getDefaultVisibleMonth(props);

        expect((date as moment.Moment).format('MM-YYYY')).toEqual('12-2050');

        Date.now = originalDateNow;
      });
    });
  });
});
