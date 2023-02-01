import { setImmediate } from 'timers';

import * as React from 'react';

import { render, screen } from '@testing-library/react';
import { mount, ReactWrapper } from 'enzyme';
import moment from 'moment';
import { act } from 'react-dom/test-utils';

import LanguageLocales from '@helsenorge/core-utils/constants/languages';
import ValidationError from '@helsenorge/form/components/form/validation-error';

import { DateRangePicker } from '../date-range-picker';
import TimeInput from '../time-input';
import { DateTimePickerLegend } from './date-time-picker-legend';
import * as DateTimePickerUtils from './date-time-picker-utils';

import DateTimePicker from '.';

describe('DateTimePicker', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  let wrapper: ReactWrapper<{}, {}>;
  const onChangeMock = jest.fn();
  const DateTimeWrapperProps = {
    ref: 'datetime1',
    id: 'datetime1',
    className: 'customclassname',
    legend: 'Når ble du behandlet?',
    dateLabel: 'dato',
    timeLabel: 'klokke',
    initialDate: moment('18.07.2020 12:10', 'DD.MM.YYYY HH:mm'),
    dateValue: moment('18.07.2020', 'DD.MM.YYYY'),
    timeValue: '12:10',
    minimumDateTime: moment('18.07.2020 12:10', 'DD.MM.YYYY HH:mm'),
    maximumDateTime: moment('20.07.2020 22:00', 'DD.MM.YYYY HH:mm'),
    onChange: onChangeMock,
    isRequired: true,
  };

  describe('Når den instansieres for første gang', () => {
    wrapper = mount(<DateTimePicker {...DateTimeWrapperProps} />);
    it('Så renderes den riktig', () => {
      expect(wrapper.find(DateTimePicker).state('date').format('DD.MM.YYYY')).toEqual('18.07.2020');

      expect(wrapper.find('fieldset').first().prop('id')).toEqual('datetime1-wrapper');
      expect(wrapper.find('fieldset').find('div').first().prop('className')).toEqual('mol_validation customclassname');
      expect(wrapper.find(DateTimePickerLegend).length).toEqual(1);
      expect(wrapper.find(DateRangePicker).length).toEqual(1);
      expect(wrapper.find(TimeInput).length).toEqual(1);
      expect(wrapper.find(DateTimePicker).state('time')).toEqual('12:10');
      expect(wrapper.render()).toMatchSnapshot();
    });
  });

  describe('Når DateTimePicker skal vises på samisk', () => {
    it('Så renderes den riktig', () => {
      render(<DateTimePicker id="test" legend="Når ble du behandlet?" locale={LanguageLocales.SAMI_NORTHERN} />);
      const input = screen.getByLabelText('bb.mm.jjjj');
      expect(input).toBeVisible();
    });
  });

  describe('Når value i props oppdateres underveis', () => {
    wrapper = mount(<DateTimePicker {...DateTimeWrapperProps} />);
    it('Så renderes den riktig', () => {
      expect(wrapper.find(DateTimePicker).state('date').format('DD.MM.YYYY')).toEqual('18.07.2020');
      expect(wrapper.find(DateTimePicker).state('time')).toEqual('12:10');
    });

    it('Så oppdateres den iht incomingProps', () => {
      wrapper.setProps({ dateValue: moment('20.07.2020', 'DD.MM.YYYY'), timeValue: '15:30' });
      expect(wrapper.find(DateTimePicker).state('date').format('DD.MM.YYYY')).toEqual('20.07.2020');
      expect(wrapper.find(DateTimePicker).state('time')).toEqual('15:30');
    });
  });

  describe('Når den ikke er valid ', () => {
    it('Så renderes den ValidationError i tillegg, med riktig props', () => {
      act(() => {
        wrapper = mount(<DateTimePicker {...DateTimeWrapperProps} />);
        wrapper.setState({ validated: false, valid: false, errorString: 'errorString' });
        (wrapper.instance() as DateTimePicker).onChildDateValidated();
      });
      expect(wrapper.find('fieldset').find('div').first().prop('className')).toEqual(
        'mol_validation customclassname mol_validation--active'
      );
      expect(wrapper.find(ValidationError).length).toEqual(1);
      expect(wrapper.find(ValidationError).prop('isValid')).toEqual(false);
      expect(wrapper.find(ValidationError).prop('error')).toEqual('errorString');
    });
  });

  describe('Når isValid kalles', () => {
    it('Så returnerer den riktig isValid state', () => {
      act(() => {
        wrapper = mount(<DateTimePicker {...DateTimeWrapperProps} />);
        wrapper.setState({ validated: true, valid: true, errorString: undefined });
        (wrapper.instance() as DateTimePicker).onChildDateValidated();
      });

      expect(wrapper.state('valid')).toEqual(true);
      const isValid = (wrapper.instance() as DateTimePicker).isValid();
      expect(isValid).toEqual(true);
      const areAllFieldsValid = (wrapper.instance() as DateTimePicker).areAllFieldsValid();
      expect(areAllFieldsValid).toEqual(true);
    });
  });

  describe('Når validateField kalles', () => {
    const validateMock = jest.fn();
    it('Så kalles det videre validate funksjon', () => {
      act(() => {
        wrapper = mount(<DateTimePicker {...DateTimeWrapperProps} />);
        (wrapper.instance() as DateTimePicker).validate = validateMock;
        (wrapper.instance() as DateTimePicker).validateField();
      });
      expect(validateMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('Når validate kalles', () => {
    const isFullDateTimeValidMock = jest.spyOn(DateTimePickerUtils, 'isFullDateTimeValid');

    it('Så sjekkes det om datoen er valid, så kalles det videre notifyValidated funksjon og callback', async () => {
      const cbMock = jest.fn();
      const notifyMock = jest.fn();
      const areAllFieldsValidMock = jest.fn();
      const flushPromises = () => new Promise(setImmediate);

      await act(async () => {
        wrapper = mount(<DateTimePicker {...DateTimeWrapperProps} />);

        wrapper.instance()['timeInputRef'] = {
          current: {
            validateField: () => true,
            isValid: () => true,
          },
        };
        (wrapper.instance() as DateTimePicker).areAllFieldsValid = areAllFieldsValidMock;
        (wrapper.instance() as DateTimePicker).notifyValidated = notifyMock;
        (wrapper.instance() as DateTimePicker).validate(cbMock);
      });
      await flushPromises();
      wrapper.update();

      expect(areAllFieldsValidMock).toHaveBeenCalledTimes(1);
      expect(notifyMock).toHaveBeenCalledTimes(1);
      expect(cbMock).toHaveBeenCalledTimes(1);
      expect(isFullDateTimeValidMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('Når validateOnlyDate kalles', () => {
    const isFullDateTimeValidMock = jest.spyOn(DateTimePickerUtils, 'isFullDateTimeValid');

    it('Så sjekkes det om datoen er valid, så kalles det videre notifyValidated funksjon og callback', async () => {
      const cbMock = jest.fn();
      const notifyMock = jest.fn();
      const areAllFieldsValidMock = jest.fn();
      const flushPromises = () => new Promise(setImmediate);

      await act(async () => {
        wrapper = mount(<DateTimePicker {...DateTimeWrapperProps} />);

        wrapper.instance()['timeInputRef'] = {
          current: {
            validateField: () => true,
            isValid: () => true,
          },
        };
        (wrapper.instance() as DateTimePicker).areAllFieldsValid = areAllFieldsValidMock;
        (wrapper.instance() as DateTimePicker).notifyValidated = notifyMock;
        (wrapper.instance() as DateTimePicker).validateOnlyDate(cbMock);
      });
      await flushPromises();
      wrapper.update();

      expect(areAllFieldsValidMock).toHaveBeenCalledTimes(0);
      expect(notifyMock).toHaveBeenCalledTimes(1);
      expect(cbMock).toHaveBeenCalledTimes(1);
      expect(isFullDateTimeValidMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('Når notifyValidated kalles', () => {
    it('Så oppdateres det errorMeldingen og kalles onValidated', () => {
      const updateErrorMessageMock = jest.fn();
      const onValidatedMock = jest.fn();
      act(() => {
        wrapper = mount(<DateTimePicker {...DateTimeWrapperProps} onValidated={onValidatedMock} />);
        (wrapper.instance() as DateTimePicker).updateErrorMessage = updateErrorMessageMock;
        (wrapper.instance() as DateTimePicker).notifyValidated();
      });
      expect(updateErrorMessageMock).toHaveBeenCalledTimes(1);
      expect(onValidatedMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('Når onChildDateValidated kalles uten at komponenten er validated', () => {
    it('Så stopper den opp og sjekker den ikke noe validering', () => {
      const isFullDateTimeValidMock = jest.spyOn(DateTimePickerUtils, 'isFullDateTimeValid');

      act(() => {
        wrapper = mount(<DateTimePicker {...DateTimeWrapperProps} />);
        wrapper.setState({ validated: false });
        (wrapper.instance() as DateTimePicker).onChildDateValidated();
      });
      expect(isFullDateTimeValidMock).toHaveBeenCalledTimes(0);
    });
  });

  describe('Når onChildDateValidated kalles med en tid som er lik den opprinnelige verdien', () => {
    it('Så stopper den opp og  sjekker den ikke noe validering', () => {
      const isFullDateTimeValidMock = jest.spyOn(DateTimePickerUtils, 'isFullDateTimeValid');

      act(() => {
        wrapper = mount(<DateTimePicker {...DateTimeWrapperProps} />);
        wrapper.setState({ time: '12:10' });
        (wrapper.instance() as DateTimePicker).onChildDateValidated();
      });
      expect(isFullDateTimeValidMock).toHaveBeenCalledTimes(0);
    });
  });

  describe('Når onChildDateValidated kalles uten prop value men med state time', () => {
    const isFullDateTimeValidMock = jest.spyOn(DateTimePickerUtils, 'isFullDateTimeValid');
    const notifyMock = jest.fn();
    const areAllFieldsValidMock = jest.fn();
    it('Så sjekker den validering og kaller notifyValidated videre', async () => {
      const flushPromises = () => new Promise(setImmediate);
      await act(async () => {
        wrapper = mount(<DateTimePicker {...DateTimeWrapperProps} />);
        wrapper.instance()['timeInputRef'] = {
          current: {
            isValid: () => true,
          },
        };
        (wrapper.instance() as DateTimePicker).notifyValidated = notifyMock;
        (wrapper.instance() as DateTimePicker).areAllFieldsValid = areAllFieldsValidMock;
        wrapper.setState({ validated: true, time: '18:10' });
      });
      await flushPromises();
      wrapper.update();
      await act(async () => {
        expect(wrapper.find(DateTimePicker).state('time')).toEqual('18:10');
        (wrapper.instance() as DateTimePicker).onChildDateValidated();
      });
      await flushPromises();
      wrapper.update();
      expect(isFullDateTimeValidMock).toHaveBeenCalledTimes(1);
      expect(notifyMock).toHaveBeenCalledTimes(1);
      expect(notifyMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('Når onDateBlur kalles ', () => {
    it('Så sjekkes det validering (date only)og kalles videre notify og onBlur', () => {
      const onBlurMock = jest.fn();
      const notifyMock = jest.fn();
      const validateOnlyDateMock = jest.fn();
      const getFullMomentDateMock = jest.spyOn(DateTimePickerUtils, 'getFullMomentDate');

      act(() => {
        wrapper = mount(<DateTimePicker {...DateTimeWrapperProps} onBlur={onBlurMock} />);
        (wrapper.instance() as DateTimePicker).validateOnlyDate = validateOnlyDateMock;
        (wrapper.instance() as DateTimePicker).notifyValidated = notifyMock;
        (wrapper.instance() as DateTimePicker).onDateBlur();
      });
      expect(getFullMomentDateMock).toHaveBeenCalledTimes(1);
      expect(validateOnlyDateMock).toHaveBeenCalledTimes(1);
      expect(validateOnlyDateMock).toHaveBeenCalledWith(notifyMock);
      expect(onBlurMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('Når onTimeBlur kalles ', () => {
    it('Så sjekkes det validering og kalles videre notify og onBlur', () => {
      const onBlurMock = jest.fn();
      const notifyMock = jest.fn();
      const validateMock = jest.fn();
      const getFullMomentDateMock = jest.spyOn(DateTimePickerUtils, 'getFullMomentDate');

      act(() => {
        wrapper = mount(<DateTimePicker {...DateTimeWrapperProps} onBlur={onBlurMock} />);
        (wrapper.instance() as DateTimePicker).validate = validateMock;
        (wrapper.instance() as DateTimePicker).notifyValidated = notifyMock;
        (wrapper.instance() as DateTimePicker).onTimeBlur();
      });
      expect(getFullMomentDateMock).toHaveBeenCalledTimes(1);
      expect(validateMock).toHaveBeenCalledTimes(1);
      expect(validateMock).toHaveBeenCalledWith(notifyMock);
      expect(onBlurMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('Når onTimeChange kalles ', () => {
    it('Så kalles det videre onChange prop', () => {
      const onChangeMock = jest.fn();

      act(() => {
        wrapper = mount(<DateTimePicker {...DateTimeWrapperProps} onChange={onChangeMock} />);
        (wrapper.instance() as DateTimePicker).onTimeChange('12:10');
      });

      expect(onChangeMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('Når onDateChange kalles ', () => {
    it('Så kalles det videre onChange prop', () => {
      const onChangeMock = jest.fn();

      act(() => {
        wrapper = mount(<DateTimePicker {...DateTimeWrapperProps} onChange={onChangeMock} />);
        (wrapper.instance() as DateTimePicker).onDateChange(moment());
      });

      expect(onChangeMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('Når updateErrorMessage kalles ', () => {
    it('Så kalles det videre onChange prop', () => {
      const getErrorStringMock = jest.spyOn(DateTimePickerUtils, 'getErrorString');

      act(() => {
        wrapper = mount(<DateTimePicker {...DateTimeWrapperProps} />);
        (wrapper.instance() as DateTimePicker).updateErrorMessage();
      });

      expect(getErrorStringMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('Når den har helpElement', () => {
    it('Så rendres den med helpElement under legend', () => {
      wrapper = mount(<DateTimePicker {...DateTimeWrapperProps} helpElement={<span className="helpElement">{`help`}</span>} />);
      expect(wrapper.find('.helpElement').length).toEqual(1);
    });
  });
});
