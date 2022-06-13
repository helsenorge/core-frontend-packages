import * as React from 'react';

import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mount } from 'enzyme';
import moment, { Moment } from 'moment';
import { SingleDatePicker as AirbnbSingleDatePicker, DateRangePicker as AirbnbDateRangePicker, FocusedInputShape } from 'react-dates';

import { LanguageLocales } from '@helsenorge/core-utils/constants/languages';
import ValidationError from '@helsenorge/form/components/form/validation-error';

import DateNativeInput from './date-native-input';
import DateRangePickerLabel from './date-range-picker-label';
import { DateRangePickerState } from './date-range-picker-types';

import DateRangePicker from '.';

/**
 * Returnerer den synlige måneden i daterangepicker, det vil si DIVen
 * som inneholder navigasjon til andre måneder og knapper for å velge dato
 */
const getVisibleMonthContainer = (): HTMLDivElement => {
  const containerList = document.querySelectorAll<HTMLDivElement>("[role='application'] [data-visible='true']");
  if (containerList.length !== 1) {
    throw Error('Fant mer enn én kalender');
  }

  return containerList[0];
};

describe('DateRangePicker index', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  describe('Gitt at DateRangePicker skal rendres', () => {
    const onChangeMock = jest.fn();

    describe('Når den har default locale og type single', () => {
      const wrapper = mount(
        <DateRangePicker type={'single'} onDateChange={onChangeMock} singleDateValue={moment('10.09.2019', 'DD.MM.YYYY')} />
      );
      it('Så er kalendertekstene på norsk', () => {
        expect(wrapper.find('input').prop('value')).toEqual('10.09.2019');
        expect(wrapper.state('momentLocale')._abbr).toEqual('nb');
        expect(wrapper.state('momentLocale')._config.weekdaysMin).toEqual(['sø', 'ma', 'ti', 'on', 'to', 'fr', 'lø']);
        expect(wrapper.render()).toMatchSnapshot();
      });
      it('Så bruker den default placeholder', () => {
        expect(wrapper.find('input').prop('placeholder')).toEqual('dd.mm.åååå');
      });
      it('Så er singleDateValue satt som default date i state', () => {
        expect((wrapper.state('singleDate') as DateRangePickerState).toString()).toEqual(moment('10.09.2019', 'DD.MM.YYYY').toString());
      });
      it('Så er default validation state riktig', () => {
        expect(wrapper.state('validated')).toBeFalsy();
        expect(wrapper.state('isSingleDateValid')).toBeTruthy();
      });
      it('Så er fokus riktig', () => {
        expect(wrapper.state('isSingleDateFocused')).toEqual(null);
        expect(wrapper.state('focusedInput')).toEqual(null);
      });
    });

    describe('Når den har engelsk locale', () => {
      const wrapper = mount(
        <DateRangePicker
          type={'single'}
          onDateChange={onChangeMock}
          singleDateValue={moment('10.09.2019', 'DD.MM.YYYY')}
          locale={LanguageLocales.ENGLISH}
        />
      );
      it('Så er kalendertekstene på engelsk', () => {
        expect(wrapper.state('momentLocale')._abbr).toEqual('en-gb');
        expect(wrapper.state('momentLocale')._config.weekdaysMin).toEqual(['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']);
      });
    });

    describe('Når den har samisk locale', () => {
      it('Så er DateRangePicker samiske tekster', async () => {
        render(
          <DateRangePicker
            type={'single'}
            onDateChange={onChangeMock}
            singleDateValue={moment('10.09.2019', 'DD.MM.YYYY')}
            locale={LanguageLocales.SAMI_NORTHERN}
            resources={{
              focusStartDate: 'Velg dato',
            }}
          />
        );

        const input = screen.getByLabelText('bb.mm.jjjj');
        expect(input).toBeVisible();

        const button = screen.getByLabelText('Velg dato');
        await userEvent.click(button);

        const monthSelect = within(getVisibleMonthContainer()).getByRole('combobox', {
          name: 'Vállje mánu',
        });
        expect(monthSelect).toBeVisible();

        const yearSelect = within(getVisibleMonthContainer()).getByRole('combobox', {
          name: 'Vállje jagi',
        });
        expect(yearSelect).toBeVisible();
      });
    });

    describe('Når den har placeholder', () => {
      const wrapper = mount(<DateRangePicker type={'single'} placeholder="Velg en dato :)" onDateChange={onChangeMock} />);
      it('Så sender den med riktig placeholder', () => {
        expect(wrapper.find('input').prop('placeholder')).toEqual('Velg en dato :)');
      });
    });

    describe('Når den har id og custom className', () => {
      const wrapper = mount(<DateRangePicker id="single-1" type={'single'} className={'testclassname'} />);
      it('Så rendres den med riktig id og className', () => {
        expect(wrapper.find('div').first().prop('id')).toEqual('single-1-wrapper');
        expect(wrapper.find('div').first().prop('className')).toEqual('datepicker mol_validation testclassname');
      });
    });

    describe('Når den har alle mulige labels', () => {
      const wrapper = mount(
        <DateRangePicker
          id="single-1"
          type={'single'}
          label={'Vanlig single daterangepicker'}
          requiredLabel={'My required label'}
          optionalLabel={'med optional label'}
          className={'testclassname'}
          placeholder="Velg en dato :)"
          onDateChange={onChangeMock}
          singleDateValue={moment('10.09.2019', 'DD.MM.YYYY')}
          isRequired
        />
      );
      it('Så sendes de videre til Label komponenten', () => {
        expect(wrapper.find(DateRangePickerLabel).render()).toMatchSnapshot();
      });
    });

    describe('Når den har type range', () => {
      const wrapper = mount(
        <DateRangePicker
          type={'range'}
          onDateChange={onChangeMock}
          startDateValue={moment('10.09.2019', 'DD.MM.YYYY')}
          endDateValue={moment('10.09.2019', 'DD.MM.YYYY')}
        />
      );

      it('Så bruker den default placeholder', () => {
        expect(wrapper.find('input').first().prop('placeholder')).toEqual('Startdato');
        expect(wrapper.find('input').last().prop('placeholder')).toEqual('Sluttdato');
      });
      it('Så er startDate og endDate satt som default date i state', () => {
        expect((wrapper.state('startDate') as DateRangePickerState).toString()).toEqual(moment('10.09.2019', 'DD.MM.YYYY').toString());
        expect((wrapper.state('endDate') as DateRangePickerState).toString()).toEqual(moment('10.09.2019', 'DD.MM.YYYY').toString());
      });
      it('Så er default validation state riktig', () => {
        expect(wrapper.state('validated')).toBeFalsy();
        expect(wrapper.state('isRangeDateValid')).toBeTruthy();
      });
      it('Så er fokus riktig', () => {
        expect(wrapper.state('focusedInput')).toEqual(null);
      });
    });

    describe('Når den har minDate og maxDate (gjelder kun rangepicker)', () => {
      const wrapper = mount(
        <DateRangePicker type={'range'} minimumDate={moment('05.09.2019', 'DD.MM.YYYY')} maximumDate={moment('15.09.2019', 'DD.MM.YYYY')} />
      );
      it('Så sendes de videre til AirbnbSingleDatePicker ', () => {
        expect(wrapper.find(AirbnbDateRangePicker).props().minDate.toString()).toEqual(moment('05.09.2019', 'DD.MM.YYYY').toString());

        expect(wrapper.find(AirbnbDateRangePicker).props().maxDate.toString()).toEqual(moment('15.09.2019', 'DD.MM.YYYY').toString());
      });
    });
    describe('Når den har type single', () => {
      it('Så er ingen dato valgt i utgangspunktet, men man kan bla tilbake i tid og velge en dato i en tidligere måned', async () => {
        const originalDateNow = Date.now;
        Date.now = jest.fn(() => new Date('2050-12-01T12:13:14.000Z').getTime());
        const mockDateChange = jest.fn();

        render(<DateRangePicker type={'single'} placeholder="Velg en dato" onDateChange={mockDateChange} />);

        const input = screen.getByRole('textbox', { name: 'Velg en dato' });
        expect((input as HTMLInputElement).value).toBe('');

        const openCalendarButton = screen.getByRole('button', { name: 'Bruk kalenderen og velg dato.' });
        fireEvent.click(openCalendarButton);

        const previousMonthButton = screen.getByRole('button', { name: 'Gå bakover til forrige måned' });
        fireEvent.click(previousMonthButton);

        const dateButton = within(getVisibleMonthContainer()).getByRole('button', { name: '17.11.2050' });
        fireEvent.click(dateButton);

        expect(mockDateChange).toHaveBeenCalledTimes(1);
        expect((mockDateChange.mock.calls[0][0] as Moment).format('DD.MM.YYYY')).toEqual('17.11.2050');
        expect((input as HTMLInputElement).value).toBe('17.11.2050');

        Date.now = originalDateNow;
      });
    });
    describe('Når den har type single og singleDateValue satt', () => {
      it('Så er dato satt til singleDateValue i utgangspunktet, og man bytte år/måned fra dropdown og velge en ny dato', async () => {
        const mockDateChange = jest.fn();

        render(
          <DateRangePicker
            type={'single'}
            placeholder="Velg en dato"
            onDateChange={mockDateChange}
            singleDateValue={moment('01.01.2050', 'DD.MM.YYYY')}
          />
        );

        const input = screen.getByRole('textbox', { name: 'Velg en dato' });
        expect((input as HTMLInputElement).value).toBe('01.01.2050');

        const openCalendarButton = screen.getByRole('button', { name: 'Bruk kalenderen og velg dato.' });
        fireEvent.click(openCalendarButton);

        const yearSelect = within(getVisibleMonthContainer()).getByRole('combobox', {
          name: 'Velg år',
        });
        await userEvent.selectOptions(yearSelect, '2049');

        const monthSelect = within(getVisibleMonthContainer()).getByRole('combobox', {
          name: 'Velg måned',
        });
        // Måned starter på 0, så 11 er desember
        await userEvent.selectOptions(monthSelect, '11');

        const dateButton = within(getVisibleMonthContainer()).getByRole('button', {
          name: '24.12.2049',
        });
        fireEvent.click(dateButton);

        expect(mockDateChange).toHaveBeenCalledTimes(1);
        expect((mockDateChange.mock.calls[0][0] as Moment).format('DD.MM.YYYY')).toEqual('24.12.2049');
        expect((input as HTMLInputElement).value).toBe('24.12.2049');
      });
    });
    describe('Når den har type single og initialDate/minimumDate/maximumDate satt', () => {
      it('Så kan man velge år/måned fra dropdown og velge en ny dato', async () => {
        const mockDateChange = jest.fn();

        render(
          <DateRangePicker
            type={'single'}
            placeholder="Velg en dato"
            onDateChange={mockDateChange}
            initialDate={moment('01.06.2021', 'DD.MM.YYYY')}
            minimumDate={moment('01.06.2020', 'DD.MM.YYYY')}
            maximumDate={moment('01.06.2021', 'DD.MM.YYYY')}
          />
        );

        const input = screen.getByRole('textbox', { name: 'Velg en dato' });
        expect((input as HTMLInputElement).value).toBe('');

        const openCalendarButton = screen.getByRole('button', { name: 'Bruk kalenderen og velg dato.' });
        fireEvent.click(openCalendarButton);

        const yearSelect = within(getVisibleMonthContainer()).getByRole('combobox', {
          name: 'Velg år',
        });
        await userEvent.selectOptions(yearSelect, '2020');

        const monthSelect = within(getVisibleMonthContainer()).getByRole('combobox', {
          name: 'Velg måned',
        });
        // Måned starter på 0, så 11 er desember
        await userEvent.selectOptions(monthSelect, '11');

        const dateButton = within(getVisibleMonthContainer()).getByRole('button', {
          name: '24.12.2020',
        });
        fireEvent.click(dateButton);

        expect(mockDateChange).toHaveBeenCalledTimes(1);
        expect((mockDateChange.mock.calls[0][0] as Moment).format('DD.MM.YYYY')).toEqual('24.12.2020');
        expect((input as HTMLInputElement).value).toBe('24.12.2020');
      });
    });
    describe('Når den har type single og minimumDate/maximumDate satt til samme år/måned', () => {
      it('Så er det ikke dropdowns for år eller måned', async () => {
        const mockDateChange = jest.fn();

        render(
          <DateRangePicker
            type={'single'}
            placeholder="Velg en dato"
            onDateChange={mockDateChange}
            minimumDate={moment('01.06.2021', 'DD.MM.YYYY')}
            maximumDate={moment('30.06.2021', 'DD.MM.YYYY')}
          />
        );

        const input = screen.getByRole('textbox', { name: 'Velg en dato' });
        expect((input as HTMLInputElement).value).toBe('');

        const openCalendarButton = screen.getByRole('button', { name: 'Bruk kalenderen og velg dato.' });
        fireEvent.click(openCalendarButton);

        const yearSelect = within(getVisibleMonthContainer()).queryByRole('combobox', {
          name: 'Velg år',
        });
        expect(yearSelect).not.toBeInTheDocument();

        const monthSelect = within(getVisibleMonthContainer()).queryByRole('combobox', {
          name: 'Velg måned',
        });
        expect(monthSelect).not.toBeInTheDocument();

        const dateButton = within(getVisibleMonthContainer()).getByRole('button', {
          name: '15.06.2021',
        });
        fireEvent.click(dateButton);

        expect(mockDateChange).toHaveBeenCalledTimes(1);
        expect((mockDateChange.mock.calls[0][0] as Moment).format('DD.MM.YYYY')).toEqual('15.06.2021');
        expect((input as HTMLInputElement).value).toBe('15.06.2021');
      });
    });
    describe('Når den har type single og singleDateValue satt', () => {
      it('Så er ingen dato valgt i utgangspunktet, og man gå til et annet år/måned og velge en ny dato', async () => {
        const mockDateChange = jest.fn();

        render(
          <DateRangePicker
            type={'single'}
            placeholder="Velg en dato"
            onDateChange={mockDateChange}
            initialDate={moment('01.01.2040', 'DD.MM.YYYY')}
          />
        );

        const input = screen.getByRole('textbox', { name: 'Velg en dato' });
        expect((input as HTMLInputElement).value).toBe('');

        const openCalendarButton = screen.getByRole('button', { name: 'Bruk kalenderen og velg dato.' });
        fireEvent.click(openCalendarButton);

        const yearSelect = within(getVisibleMonthContainer()).getByRole('combobox', {
          name: 'Velg år',
        });
        await userEvent.selectOptions(yearSelect, '2030');

        const monthSelect = within(getVisibleMonthContainer()).getByRole('combobox', {
          name: 'Velg måned',
        });
        await userEvent.selectOptions(monthSelect, '5');

        const dateButton = within(getVisibleMonthContainer()).getByRole('button', {
          name: '10.06.2030',
        });
        fireEvent.click(dateButton);

        expect(mockDateChange).toHaveBeenCalledTimes(1);
        expect((mockDateChange.mock.calls[0][0] as Moment).format('DD.MM.YYYY')).toEqual('10.06.2030');
        expect((input as HTMLInputElement).value).toBe('10.06.2030');
      });
    });
    describe('Når den har type single og minimumDate satt', () => {
      it('Så kan man ikke velge dato før minimumDate', async () => {
        const mockDateChange = jest.fn();

        render(
          <DateRangePicker
            type={'single'}
            placeholder="Velg en dato"
            onDateChange={mockDateChange}
            minimumDate={moment('10.04.2020', 'DD.MM.YYYY')}
          />
        );

        const input = screen.getByRole('textbox', { name: 'Velg en dato' });
        expect((input as HTMLInputElement).value).toBe('');

        const openCalendarButton = screen.getByRole('button', { name: 'Bruk kalenderen og velg dato.' });
        fireEvent.click(openCalendarButton);

        const dateButton = within(getVisibleMonthContainer()).getByRole('button', {
          name: /09\.04\.2020/,
        });
        expect(dateButton).toHaveAttribute('aria-disabled', 'true');
        fireEvent.click(dateButton);

        expect(mockDateChange).toHaveBeenCalledTimes(0);
        expect((input as HTMLInputElement).value).toBe('');
      });
    });
    describe('Når den har type single og maximumDate satt', () => {
      it('Så kan man ikke velge dato etter maximumDate', async () => {
        const mockDateChange = jest.fn();

        render(
          <DateRangePicker
            type={'single'}
            placeholder="Velg en dato"
            onDateChange={mockDateChange}
            initialDate={moment('01.04.2020', 'DD.MM.YYYY')}
            maximumDate={moment('10.04.2020', 'DD.MM.YYYY')}
          />
        );

        const input = screen.getByRole('textbox', { name: 'Velg en dato' });
        expect((input as HTMLInputElement).value).toBe('');

        const openCalendarButton = screen.getByRole('button', { name: 'Bruk kalenderen og velg dato.' });
        fireEvent.click(openCalendarButton);

        const dateButton = within(getVisibleMonthContainer()).getByRole('button', {
          name: /11\.04\.2020/,
        });
        fireEvent.click(dateButton);

        expect(mockDateChange).toHaveBeenCalledTimes(0);
        expect((input as HTMLInputElement).value).toBe('');
      });
    });
    describe('Når type er single, minimumDate er for ett år siden og singleDateValue/initialDate/maximumDate er samme dag', () => {
      it('Så kan man bla tilbake i tid og velge en dato i en tidligere måned', async () => {
        const mockDateChange = jest.fn();

        render(
          <DateRangePicker
            type={'single'}
            placeholder="Velg en dato"
            onDateChange={mockDateChange}
            singleDateValue={moment('01.06.2021', 'DD.MM.YYYY')}
            initialDate={moment('01.06.2021', 'DD.MM.YYYY')}
            minimumDate={moment('01.06.2021', 'DD.MM.YYYY').subtract(1, 'year')}
            maximumDate={moment('01.06.2021', 'DD.MM.YYYY')}
          />
        );

        const input = screen.getByRole('textbox', { name: 'Velg en dato' });
        expect((input as HTMLInputElement).value).toBe('01.06.2021');

        const openCalendarButton = screen.getByRole('button', { name: 'Bruk kalenderen og velg dato.' });
        fireEvent.click(openCalendarButton);

        const initialHeader = within(getVisibleMonthContainer()).getByText('juni');
        expect(initialHeader).toBeVisible();

        const previousMonthButton = screen.getByRole('button', { name: 'Gå bakover til forrige måned' });

        // Gå tilbake to måneder for å sørge for at komponenten må rendre en ny måned (forrige og neste måned ligger skjult i DOMen)
        fireEvent.click(previousMonthButton);
        fireEvent.click(previousMonthButton);

        const dateButton = within(getVisibleMonthContainer()).getByRole('button', { name: '17.04.2021' });
        fireEvent.click(dateButton);

        expect(mockDateChange).toHaveBeenCalledTimes(1);
        expect((mockDateChange.mock.calls[0][0] as Moment).format('DD.MM.YYYY')).toEqual('17.04.2021');
        expect((input as HTMLInputElement).value).toBe('17.04.2021');
      });
    });

    describe('Når det er to datepickere med type single som brukes for å velge startdato og sluttdato', () => {
      it('Så kan man velge en tidligere startdato og så gå tilbake og velge tidligere sluttdato', async () => {
        const mockStartDateChange = jest.fn();
        const mockEndDateChange = jest.fn();

        const StartEndDatePicker: React.FC = () => {
          const [startDatoValue, setStartDatoValue] = React.useState<moment.Moment>(moment('02.06.2021', 'DD.MM.YYYY'));
          const [sluttDatoValue, setSluttDatoValue] = React.useState<moment.Moment>(moment('03.06.2021', 'DD.MM.YYYY'));

          const onDateChangeStart = (date: moment.Moment) => {
            setStartDatoValue(date);
            mockStartDateChange(date);
          };
          const onDateChangeSlutt = (date: moment.Moment) => {
            setSluttDatoValue(date);
            mockEndDateChange(date);
          };

          return (
            <>
              <DateRangePicker
                id="start-dato"
                type="single"
                label={'Startdato'}
                onDateChange={onDateChangeStart}
                singleDateValue={startDatoValue}
                minimumDate={moment('04.06.2018', 'DD.MM.YYYY')}
                maximumDate={moment('04.06.2021', 'DD.MM.YYYY')}
                initialDate={moment('04.06.2021', 'DD.MM.YYYY')}
                placeholder="Velg startdato"
                isRequired={true}
              />
              <DateRangePicker
                id="slutt-dato"
                type="single"
                label={'Sluttdato'}
                onDateChange={onDateChangeSlutt}
                singleDateValue={sluttDatoValue}
                minimumDate={startDatoValue}
                maximumDate={moment('04.06.2021', 'DD.MM.YYYY')}
                initialDate={moment('04.06.2021', 'DD.MM.YYYY')}
                placeholder="Velg sluttdato"
                isRequired={true}
              />
            </>
          );
        };

        render(<StartEndDatePicker />);

        const startInput = screen.getByRole('textbox', { name: 'Velg startdato' });
        expect((startInput as HTMLInputElement).value).toBe('02.06.2021');
        const endInput = screen.getByRole('textbox', { name: 'Velg sluttdato' });
        expect((endInput as HTMLInputElement).value).toBe('03.06.2021');

        const openCalendarButtonList = screen.getAllByRole('button', { name: 'Bruk kalenderen og velg dato.' });
        expect(openCalendarButtonList.length).toBe(2);
        const [startDateOpenCalendarButton, endDateOpenCalendarButton] = openCalendarButtonList;
        fireEvent.click(startDateOpenCalendarButton);

        const startDatePreviousMonthButton = screen.getByRole('button', { name: 'Gå bakover til forrige måned' });
        fireEvent.click(startDatePreviousMonthButton);
        const startDateButton = within(getVisibleMonthContainer()).getByRole('button', { name: '01.05.2021' });
        fireEvent.click(startDateButton);

        fireEvent.click(endDateOpenCalendarButton);

        const endDatePreviousMonthButton = screen.getByRole('button', { name: 'Gå bakover til forrige måned' });
        fireEvent.click(endDatePreviousMonthButton);
        const endDateButton = within(getVisibleMonthContainer()).getByRole('button', { name: '15.05.2021' });
        fireEvent.click(endDateButton);

        expect(mockStartDateChange).toHaveBeenCalledTimes(1);
        expect((mockStartDateChange.mock.calls[0][0] as Moment).format('DD.MM.YYYY')).toEqual('01.05.2021');
        expect((startInput as HTMLInputElement).value).toBe('01.05.2021');

        expect(mockEndDateChange).toHaveBeenCalledTimes(1);
        expect((mockEndDateChange.mock.calls[0][0] as Moment).format('DD.MM.YYYY')).toEqual('15.05.2021');
        expect((endInput as HTMLInputElement).value).toBe('15.05.2021');
      });
    });
    describe('Når det er to datepickere der sluttdato oppdateres når man endrer startdato', () => {
      it('Så er visibleMonth i datepicker for sluttdato oppdatert når man endrer startdato', async () => {
        const mockStartDateChange = jest.fn();
        const mockEndDateChange = jest.fn();

        const StartEndDatePicker: React.FC = () => {
          const [startDatoValue, setStartDatoValue] = React.useState<moment.Moment>(moment('02.06.2021', 'DD.MM.YYYY'));
          const [sluttDatoValue, setSluttDatoValue] = React.useState<moment.Moment>(moment('03.06.2021', 'DD.MM.YYYY'));

          const onDateChangeStart = (date: moment.Moment) => {
            setStartDatoValue(date);
            setSluttDatoValue(date);
            mockStartDateChange(date);
          };
          const onDateChangeSlutt = (date: moment.Moment) => {
            setSluttDatoValue(date);
            mockEndDateChange(date);
          };

          return (
            <>
              <DateRangePicker
                id="start-dato"
                type="single"
                label={'Startdato'}
                onDateChange={onDateChangeStart}
                singleDateValue={startDatoValue}
                minimumDate={moment('04.06.2018', 'DD.MM.YYYY')}
                maximumDate={moment('04.06.2021', 'DD.MM.YYYY')}
                initialDate={moment('04.06.2021', 'DD.MM.YYYY')}
                placeholder="Velg startdato"
                isRequired={true}
              />
              <DateRangePicker
                id="slutt-dato"
                type="single"
                label={'Sluttdato'}
                onDateChange={onDateChangeSlutt}
                singleDateValue={sluttDatoValue}
                minimumDate={startDatoValue}
                maximumDate={moment('04.06.2021', 'DD.MM.YYYY')}
                initialDate={moment('04.06.2021', 'DD.MM.YYYY')}
                placeholder="Velg sluttdato"
                isRequired={true}
              />
            </>
          );
        };

        render(<StartEndDatePicker />);

        const startInput = screen.getByRole('textbox', { name: 'Velg startdato' });
        expect((startInput as HTMLInputElement).value).toBe('02.06.2021');
        const endInput = screen.getByRole('textbox', { name: 'Velg sluttdato' });
        expect((endInput as HTMLInputElement).value).toBe('03.06.2021');

        const openCalendarButtonList = screen.getAllByRole('button', { name: 'Bruk kalenderen og velg dato.' });
        expect(openCalendarButtonList.length).toBe(2);
        const [startDateOpenCalendarButton, endDateOpenCalendarButton] = openCalendarButtonList;
        fireEvent.click(startDateOpenCalendarButton);

        const startDatePreviousMonthButton = screen.getByRole('button', { name: 'Gå bakover til forrige måned' });
        fireEvent.click(startDatePreviousMonthButton);
        const startDateButton = within(getVisibleMonthContainer()).getByRole('button', { name: '01.05.2021' });
        fireEvent.click(startDateButton);

        expect((endInput as HTMLInputElement).value).toBe('01.05.2021');

        fireEvent.click(endDateOpenCalendarButton);

        const endDateButton = within(getVisibleMonthContainer()).getByRole('button', { name: '15.05.2021' });
        fireEvent.click(endDateButton);

        expect(mockStartDateChange).toHaveBeenCalledTimes(1);
        expect((mockStartDateChange.mock.calls[0][0] as Moment).format('DD.MM.YYYY')).toEqual('01.05.2021');
        expect((startInput as HTMLInputElement).value).toBe('01.05.2021');

        expect(mockEndDateChange).toHaveBeenCalledTimes(1);
        expect((mockEndDateChange.mock.calls[0][0] as Moment).format('DD.MM.YYYY')).toEqual('15.05.2021');
        expect((endInput as HTMLInputElement).value).toBe('15.05.2021');
      });
    });
    describe('Når type er range og minimumDate/maximumDate er satt', () => {
      it('Så kan man velge en range innenfor mimimumDate/maximumDate', async () => {
        const mockDateChange = jest.fn();

        render(
          <DateRangePicker
            type={'range'}
            onDateChange={mockDateChange}
            minimumDate={moment('10.02.2020', 'DD.MM.YYYY')}
            maximumDate={moment('20.04.2020', 'DD.MM.YYYY')}
          />
        );

        const startDate = screen.getByRole('textbox', { name: 'Startdato' });
        expect((startDate as HTMLInputElement).value).toBe('');
        const endDate = screen.getByRole('textbox', { name: 'Sluttdato' });
        expect((endDate as HTMLInputElement).value).toBe('');

        const openCalendarButton = screen.getByRole('button', { name: 'Bruk kalenderen og velg dato.' });
        fireEvent.click(openCalendarButton);

        const calendar = screen.getByRole('application', { name: 'Kalender' });

        const initialHeader = within(getVisibleMonthContainer()).getByText('februar');
        expect(initialHeader).toBeVisible();

        const startDateButton = within(getVisibleMonthContainer()).getByRole('button', { name: /11\.02\.2020/ });
        fireEvent.click(startDateButton);

        const nextMonthButton = within(calendar).getByRole('button', { name: 'Gå fremover til neste måned' });
        fireEvent.click(nextMonthButton);
        fireEvent.click(nextMonthButton);

        const endDateButton = within(getVisibleMonthContainer()).getByRole('button', { name: /19\.04\.2020/ });
        fireEvent.click(endDateButton);

        expect(mockDateChange).toHaveBeenCalledTimes(2);
        expect((mockDateChange.mock.calls[1][0].start as Moment).format('DD.MM.YYYY')).toEqual('11.02.2020');
        expect((mockDateChange.mock.calls[1][0].end as Moment).format('DD.MM.YYYY')).toEqual('19.04.2020');
        expect((startDate as HTMLInputElement).value).toBe('11.02.2020');
        expect((endDate as HTMLInputElement).value).toBe('19.04.2020');
      });
    });
  });

  describe('Gitt at DateRangePicker får nye props underveis', () => {
    const onChangeMock = jest.fn();

    describe('Når typen er single', () => {
      it('Så oppdateres det singleDate state basert på den siste singleDateValue prop og ny validering kjøres', () => {
        const wrapper = mount(
          <DateRangePicker type={'single'} onDateChange={onChangeMock} singleDateValue={moment('10.09.2019', 'DD.MM.YYYY')} />
        );

        const singleDateValidatorSpy = jest.spyOn(wrapper.instance() as DateRangePicker, 'singleDateValidator');
        expect((wrapper.state('singleDate') as DateRangePickerState).toString()).toEqual(moment('10.09.2019', 'DD.MM.YYYY').toString());
        wrapper.setProps({ singleDateValue: moment('15.09.2019', 'DD.MM.YYYY') });
        expect((wrapper.state('singleDate') as DateRangePickerState).toString()).toEqual(moment('15.09.2019', 'DD.MM.YYYY').toString());
        expect(singleDateValidatorSpy).toHaveBeenCalledWith(moment('15.09.2019', 'DD.MM.YYYY'));
      });
    });

    describe('Når typen er range', () => {
      it('Så oppdateres det startDate og endDate state basert på de siste propsene', () => {
        const wrapper = mount(
          <DateRangePicker
            type={'range'}
            onDateChange={onChangeMock}
            startDateValue={moment('10.09.2019', 'DD.MM.YYYY')}
            endDateValue={moment('10.09.2019', 'DD.MM.YYYY')}
          />
        );
        const rangeDateValidatorSpy = jest.spyOn(wrapper.instance() as DateRangePicker, 'rangeDateValidator');
        expect((wrapper.state('startDate') as DateRangePickerState).toString()).toEqual(moment('10.09.2019', 'DD.MM.YYYY').toString());
        expect((wrapper.state('endDate') as DateRangePickerState).toString()).toEqual(moment('10.09.2019', 'DD.MM.YYYY').toString());
        wrapper.setProps({ startDateValue: moment('15.09.2019', 'DD.MM.YYYY') });
        expect((wrapper.state('startDate') as DateRangePickerState).toString()).toEqual(moment('15.09.2019', 'DD.MM.YYYY').toString());
        wrapper.setProps({ endDateValue: moment('15.09.2019', 'DD.MM.YYYY') });
        expect((wrapper.state('endDate') as DateRangePickerState).toString()).toEqual(moment('15.09.2019', 'DD.MM.YYYY').toString());
        expect(rangeDateValidatorSpy).toHaveBeenCalledWith(moment('15.09.2019', 'DD.MM.YYYY'), moment('15.09.2019', 'DD.MM.YYYY'));
      });
    });
  });

  describe('Gitt at enkle funksjoner fra DateRangePicker skal testes', () => {
    const onChangeMock = jest.fn();

    describe('Når onSingleDateChange kalles', () => {
      it('Så oppdateres singleDate staten og kalles videre onDateChange. . Validering kalles ikke (kun etter blur)', () => {
        const wrapper = mount(
          <DateRangePicker id={'id'} type={'single'} onDateChange={onChangeMock} singleDateValue={moment('10.09.2019', 'DD.MM.YYYY')} />
        );
        const validateFieldSpy = jest.spyOn(wrapper.instance() as DateRangePicker, 'validateField');

        (wrapper.instance() as DateRangePicker).onSingleDateChange(moment('15.09.2019', 'DD.MM.YYYY'));

        expect((wrapper.state('singleDate') as DateRangePickerState).toString()).toEqual(moment('15.09.2019', 'DD.MM.YYYY').toString());

        expect(onChangeMock).toHaveBeenCalledWith(moment('15.09.2019', 'DD.MM.YYYY'), 'id');
        expect(validateFieldSpy).not.toHaveBeenCalled();
      });
    });

    describe('Når onStartDateChange onEndDateChange eller onRangeDatesChange kalles', () => {
      it('Så oppdateres startDate og endDate i staten og kalles videre onDateChange og ny validering. Validering kalles ikke (kun etter blur)', () => {
        const wrapper = mount(
          <DateRangePicker id={'id'} type={'range'} onDateChange={onChangeMock} startDateValue={moment('10.09.2019', 'DD.MM.YYYY')} />
        );
        const rangeDateValidatorSpy = jest.spyOn(wrapper.instance() as DateRangePicker, 'rangeDateValidator');
        const validateFieldSpy = jest.spyOn(wrapper.instance() as DateRangePicker, 'validateField');

        (wrapper.instance() as DateRangePicker).onStartDateChange(moment('15.09.2019', 'DD.MM.YYYY'));
        expect((wrapper.state('startDate') as DateRangePickerState).toString()).toEqual(moment('15.09.2019', 'DD.MM.YYYY').toString());
        expect(onChangeMock).toHaveBeenCalledWith({ end: null, start: moment('15.09.2019', 'DD.MM.YYYY') }, 'id');

        expect(validateFieldSpy).not.toHaveBeenCalled();
        expect(rangeDateValidatorSpy).not.toHaveBeenCalled();

        (wrapper.instance() as DateRangePicker).onEndDateChange(moment('15.09.2019', 'DD.MM.YYYY'));
        expect((wrapper.state('endDate') as DateRangePickerState).toString()).toEqual(moment('15.09.2019', 'DD.MM.YYYY').toString());
        expect(onChangeMock).toHaveBeenCalledWith(
          { end: moment('15.09.2019', 'DD.MM.YYYY'), start: moment('15.09.2019', 'DD.MM.YYYY') },
          'id'
        );

        (wrapper.instance() as DateRangePicker).onRangeDatesChange({
          startDate: moment('05.09.2019', 'DD.MM.YYYY'),
          endDate: moment('05.09.2019', 'DD.MM.YYYY'),
        });
        expect((wrapper.state('startDate') as DateRangePickerState).toString()).toEqual(moment('05.09.2019', 'DD.MM.YYYY').toString());
        expect((wrapper.state('endDate') as DateRangePickerState).toString()).toEqual(moment('05.09.2019', 'DD.MM.YYYY').toString());
        expect(onChangeMock).toHaveBeenCalledWith(
          { end: moment('05.09.2019', 'DD.MM.YYYY'), start: moment('05.09.2019', 'DD.MM.YYYY') },
          'id'
        );
      });
    });

    describe('Når onSingleDateFocusChange kalles', () => {
      it('Så settes det riktig focus state', () => {
        const wrapper = mount(<DateRangePicker id={'id'} type={'single'} onDateChange={onChangeMock} />);
        (wrapper.instance() as DateRangePicker).onSingleDateFocusChange({ focused: true });
        expect(wrapper.state('isSingleDateFocused')).toBeTruthy();
      });

      it('Så kalles det validering ved onBlur ut av DatePickeren', () => {
        jest.useFakeTimers();
        const wrapper = mount(<DateRangePicker id={'id'} type={'single'} onDateChange={onChangeMock} />);
        const validateFieldSpy = jest.spyOn(wrapper.instance() as DateRangePicker, 'validateField');
        (wrapper.instance() as DateRangePicker).onSingleDateFocusChange({ focused: false });
        jest.runAllTimers();
        expect(validateFieldSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('Når onRangeDatesFocusChange kalles', () => {
      it('Så settes det riktig focus state', () => {
        const wrapper = mount(<DateRangePicker id={'id'} type={'range'} onDateChange={onChangeMock} />);
        (wrapper.instance() as DateRangePicker).onRangeDatesFocusChange('startDate');
        expect(wrapper.state('focusedInput')).toEqual('startDate');
        (wrapper.instance() as DateRangePicker).onRangeDatesFocusChange('endDate');
        expect(wrapper.state('focusedInput')).toEqual('endDate');
      });

      it('Så kalles det validering ved onBlur ut av DatePickeren', () => {
        jest.useFakeTimers();
        const wrapper = mount(<DateRangePicker id={'id'} type={'range'} onDateChange={onChangeMock} />);
        const validateFieldSpy = jest.spyOn(wrapper.instance() as DateRangePicker, 'validateField');
        wrapper.setState({ focusedInput: null });
        expect(wrapper.state('focusedInput')).toEqual(null);
        (wrapper.instance() as DateRangePicker).onRangeDatesFocusChange(null as unknown as FocusedInputShape); // cannot be null, has to be startDate / endDate - has to be truthy just for testing
        jest.runAllTimers();
        expect(validateFieldSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('Når onCalenderIconClick kalles', () => {
      it('Så nullstilles det focus', () => {
        const wrapper = mount(<DateRangePicker id={'id'} type={'single'} onDateChange={onChangeMock} />);

        (wrapper.instance() as DateRangePicker).onCalenderIconClick();
        expect(wrapper.state('isSingleDateFocused')).toBeFalsy();
        wrapper.setState({ isSingleDateFocused: true });
        (wrapper.instance() as DateRangePicker).onCalenderIconClick();
        expect(wrapper.state('isSingleDateFocused')).toBeFalsy();
        expect(wrapper.state('focusedInput')).toEqual(null);
        wrapper.setState({ focusedInput: true }); // cannot be true, has to be Element - has to be truthy just for testing
        (wrapper.instance() as DateRangePicker).onCalenderIconClick();
        expect(wrapper.state('focusedInput')).toEqual(null);
      });
    });

    describe('Når validateField kalles', () => {
      it('Så kaller den riktig methode for type single', () => {
        const wrapper = mount(<DateRangePicker id={'id'} type={'single'} onDateChange={onChangeMock} />);
        const singleDateValidatorSpy = jest.spyOn(wrapper.instance() as DateRangePicker, 'singleDateValidator');
        (wrapper.instance() as DateRangePicker).validateField();
        expect(singleDateValidatorSpy).toHaveBeenCalled();
      });
      it('Så kaller den riktig methode for type range', () => {
        const wrapper = mount(<DateRangePicker id={'id'} type={'range'} onDateChange={onChangeMock} />);
        const rangeDateValidatorSpy = jest.spyOn(wrapper.instance() as DateRangePicker, 'rangeDateValidator');
        (wrapper.instance() as DateRangePicker).validateField();
        expect(rangeDateValidatorSpy).toHaveBeenCalled();
      });
    });

    describe('Når isValid kalles', () => {
      it('Så returnerer riktig state for type single', () => {
        const wrapper = mount(<DateRangePicker id={'id'} type={'single'} onDateChange={onChangeMock} />);

        let isValid = (wrapper.instance() as DateRangePicker).isValid();
        expect(isValid).toBeTruthy();
        wrapper.setState({ isSingleDateValid: false, isRangeDateValid: true });
        isValid = (wrapper.instance() as DateRangePicker).isValid();
        expect(isValid).toBeFalsy();
      });
      it('Så returnerer riktig state for type range', () => {
        const wrapper = mount(<DateRangePicker id={'id'} type={'range'} onDateChange={onChangeMock} />);

        let isValid = (wrapper.instance() as DateRangePicker).isValid();
        expect(isValid).toBeTruthy();
        wrapper.setState({ isSingleDateValid: true, isRangeDateValid: false });
        isValid = (wrapper.instance() as DateRangePicker).isValid();
        expect(isValid).toBeFalsy();
      });
    });

    describe('Når DateRangePicker har valideringsfeil', () => {
      it('Så returnerer den ValidationError som default', () => {
        const wrapper = mount(<DateRangePicker id={'id'} type={'single'} onDateChange={onChangeMock} />);
        wrapper.setState({ isSingleDateValid: false });
        expect(wrapper.find(ValidationError).length).toBe(1);
      });

      it('Så returnerer den ikke ValidationError med isValidationHidden false', () => {
        const wrapper = mount(<DateRangePicker id={'id'} type={'single'} onDateChange={onChangeMock} isValidationHidden />);
        expect(wrapper.find(ValidationError).length).toBe(0);
      });

      it('Så returnerer den validationErrorRenderer når den finnes', () => {
        const wrapper = mount(
          <DateRangePicker
            id={'id'}
            type={'single'}
            onDateChange={onChangeMock}
            validationErrorRenderer={<span id="validationErrorRenderer"></span>}
          />
        );
        wrapper.setState({ isSingleDateValid: false });
        expect(wrapper.find('#validationErrorRenderer').length).toBe(1);
      });
    });

    describe('Når helpElement er gitt som prop', () => {
      it('Så vises den riktig', () => {
        const wrapper = mount(
          <DateRangePicker id={'id'} type={'single'} onDateChange={onChangeMock} helpElement={<span id="helpElement"></span>} />
        );
        expect(wrapper.find('#helpElement').length).toBe(1);
      });
    });

    describe('Når man er på desktop', () => {
      it('Så rendres det mobile versjon av datepickeren (single)', () => {
        const wrapper = mount(<DateRangePicker id={'id'} type={'single'} onDateChange={onChangeMock} />);
        wrapper.setState({ isMobile: false });
        expect(wrapper.find(DateNativeInput).length).toBe(0);
        expect(wrapper.find(AirbnbSingleDatePicker).length).toBe(1);
      });
      it('Så rendres det mobile versjon av datepickeren (range)', () => {
        const wrapper = mount(<DateRangePicker id={'id'} type={'range'} onDateChange={onChangeMock} />);
        wrapper.setState({ isMobile: false });
        expect(wrapper.find(DateNativeInput).length).toBe(0);
        expect(wrapper.find(AirbnbSingleDatePicker).length).toBe(0);
        expect(wrapper.find(AirbnbDateRangePicker).length).toBe(1);
      });
    });

    describe('Når man er på mobil', () => {
      it('Så rendres det mobile versjon av datepickeren (single)', () => {
        const wrapper = mount(<DateRangePicker id={'id'} type={'single'} onDateChange={onChangeMock} />);
        wrapper.setState({ isMobile: true });
        expect(wrapper.find(DateNativeInput).length).toBe(1);
      });
      it('Så rendres det mobile versjon av datepickeren (range)', () => {
        const wrapper = mount(<DateRangePicker id={'id'} type={'range'} onDateChange={onChangeMock} />);
        wrapper.setState({ isMobile: true });
        expect(wrapper.find(DateNativeInput).length).toBe(2);
      });

      it('Så reagerer native single datepickeren til onBlur og kaller validering videre', () => {
        jest.useFakeTimers();
        const wrapper = mount(<DateRangePicker id={'id'} type={'single'} onDateChange={onChangeMock} />);
        const onBlurHandlerSpy = jest.spyOn(wrapper.instance() as DateRangePicker, 'onBlurHandler');
        const validateFieldSpy = jest.spyOn(wrapper.instance() as DateRangePicker, 'validateField');

        wrapper.setState({ isMobile: true });

        const e = { target: { value: 'some value' } };
        wrapper.find('input').first().simulate('blur', e);
        jest.runAllTimers();
        wrapper.update();

        expect(onBlurHandlerSpy).toHaveBeenCalledTimes(1);
        expect(validateFieldSpy).toHaveBeenCalledTimes(1);
      });

      it('Så reagerer native range datepickeren til onBlur og kaller validering videre', () => {
        jest.useFakeTimers();
        const wrapper = mount(<DateRangePicker id={'id'} type={'range'} onDateChange={onChangeMock} />);
        const onBlurHandlerSpy = jest.spyOn(wrapper.instance() as DateRangePicker, 'onBlurHandler');
        const validateFieldSpy = jest.spyOn(wrapper.instance() as DateRangePicker, 'validateField');

        wrapper.setState({ isMobile: true });

        const e = { target: { value: 'some value' } };
        wrapper.find('input').first().simulate('blur', e);
        jest.runAllTimers();
        wrapper.update();

        expect(onBlurHandlerSpy).toHaveBeenCalledTimes(1);
        expect(validateFieldSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('Når onChangeMonthHandler kalles', () => {
      const wrapper = mount(
        <DateRangePicker type={'range'} minimumDate={moment('01.06.2021', 'DD.MM.YYYY')} maximumDate={moment('10.06.2021', 'DD.MM.YYYY')} />
      );

      it('Så deaktiveres navPrev og navNext riktig', () => {
        jest.useFakeTimers();
        wrapper.find('button').first().simulate('click');
        jest.runAllTimers();
        wrapper.update();

        const navELement = wrapper.find('.datepicker__header-navigation--disabled');
        expect(navELement.length).toBe(4);
      });
    });
  });
});
