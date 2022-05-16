import * as React from 'react';

import { mount, ReactWrapper } from 'enzyme';

import '@helsenorge/designsystem-react/__mocks__/matchMedia';
import LanguageLocales from '@helsenorge/core-utils/constants/languages';
import Form from '@helsenorge/form/components/form';
import Validation from '@helsenorge/form/components/form/validation';
import SafeSelectField from '@helsenorge/form/components/safe-select';

import { YearMonthResources, YearMonthInput } from '.';

describe('Gitt at YearMonthInput felt rendres', () => {
  let wrapper: ReactWrapper<{}, {}>;

  describe('Når det er skrevet inn mellom 1 og 3 tegn i årsfeltet og feltet mister fokus', () => {
    it('Så vises feilmelding', () => {
      wrapper = mount(
        <YearMonthInput id="year-month-input" legend="År + måned" resources={{ errorInvalidYear: 'Feil år' } as YearMonthResources} />
      );
      wrapper.find('input').simulate('change', { target: { value: '201' } });
      wrapper.update();
      wrapper.find('input').simulate('blur');
      expect(wrapper.find('.mol_validation__errortext').first().text()).toBe('Feil år');
    });
  });

  describe('Når kun årsfeltet er fyllt ut og måned endres til "ikke valgt"', () => {
    it('Så vises feilmelding', () => {
      wrapper = mount(
        <YearMonthInput
          id="year-month-input"
          legend="År + måned"
          resources={{ errorInvalidYearMonth: 'Ugyldig verdi' } as YearMonthResources}
        />
      );
      wrapper.find('input').simulate('change', { target: { value: '2014' } });
      wrapper.find('select').simulate('change', { target: { value: '-1' } });
      wrapper.update();
      expect(wrapper.find('.mol_validation__errortext').first().text()).toBe('Ugyldig verdi');
    });
  });

  describe('Når kun måned er fyllt ut og måned endres', () => {
    it('Så vises feilmelding', () => {
      wrapper = mount(
        <YearMonthInput
          id="year-month-input"
          legend="År + måned"
          resources={{ errorInvalidYearMonth: 'Ugyldig verdi' } as YearMonthResources}
        />
      );
      wrapper.find('select').simulate('change', { target: { value: '1' } });
      wrapper.update();
      expect(wrapper.find('.mol_validation__errortext').first().text()).toBe('Ugyldig verdi');
    });
  });

  describe('Når valgt måned og år er etter max dato ', () => {
    it('Så vises feilmelding', () => {
      wrapper = mount(
        <YearMonthInput
          id="year-month-input"
          legend="År + måned"
          locale={LanguageLocales.NORWEGIAN}
          maximumYearMonth={{ year: 2014, month: 0 }}
          resources={{ errorAfterMaxDate: 'Etter max dato' } as YearMonthResources}
        />
      );
      wrapper.find('input').simulate('change', { target: { value: '2014' } });
      wrapper.update();
      wrapper.find('select').simulate('change', { target: { value: '3' } });
      wrapper.update();
      expect(wrapper.find('.mol_validation__errortext').first().text()).toBe('Etter max dato: januar 2014');
    });
  });

  describe('Når valgt måned og år er før min dato ', () => {
    it('Så vises feilmelding', () => {
      wrapper = mount(
        <YearMonthInput
          id="year-month-input"
          legend="År + måned"
          locale={LanguageLocales.NORWEGIAN}
          minimumYearMonth={{ year: 2014, month: 0 }}
          resources={{ errorBeforeMinDate: 'Før min dato' } as YearMonthResources}
        />
      );
      wrapper.find('input').simulate('change', { target: { value: '2013' } });
      wrapper.update();
      wrapper.find('select').simulate('change', { target: { value: '11' } });
      wrapper.update();
      expect(wrapper.find('.mol_validation__errortext').first().text()).toBe('Før min dato: januar 2014');
    });
  });

  describe('Når feltet er tomt, påkrevd, del av en form og form sendes inn', () => {
    it('Så vises feilmelding', () => {
      wrapper = mount(
        <Form submitButtonText="Send" onSubmit={jest.fn()}>
          <Validation>
            <YearMonthInput
              id="year-input"
              legend="År + måned"
              isRequired={true}
              resources={{ errorRequiredField: 'Feltet er påkrevd' } as YearMonthResources}
            />
          </Validation>
        </Form>
      );

      wrapper.find('button').first().simulate('click');

      wrapper.update();
      expect(wrapper.find('.mol_validation__errortext').first().text()).toBe('Feltet er påkrevd');
    });
  });

  describe('Når feltet har feilmelding og år endres til gyldig verdi', () => {
    it('Så fjernes feilmelding', () => {
      wrapper = mount(
        <YearMonthInput
          id="year-month-input"
          legend="År + måned"
          locale={LanguageLocales.NORWEGIAN}
          minimumYearMonth={{ year: 2014, month: 0 }}
          resources={{ errorBeforeMinDate: 'Før min dato' } as YearMonthResources}
        />
      );
      wrapper.find('input').simulate('change', { target: { value: '2013' } });
      wrapper.update();
      wrapper.find('select').simulate('change', { target: { value: '11' } });
      wrapper.update();
      wrapper.find('input').simulate('change', { target: { value: '2014' } });
      wrapper.update();
      const validation = wrapper.find('.mol_validation__errortext').first();
      expect(validation.length).toBe(1);
      expect(validation.text()).toEqual('');
    });
  });
  describe('Når feltet har feilmelding og måned endres til gyldig verdi', () => {
    it('Så fjernes feilmelding', () => {
      wrapper = mount(
        <YearMonthInput
          id="year-month-input"
          legend="År + måned"
          locale={LanguageLocales.NORWEGIAN}
          minimumYearMonth={{ year: 2014, month: 3 }}
          resources={{ errorBeforeMinDate: 'Før min dato' } as YearMonthResources}
        />
      );
      wrapper.find('input').simulate('change', { target: { value: '2014' } });
      wrapper.update();
      wrapper.find('select').simulate('change', { target: { value: '2' } });
      wrapper.update();
      wrapper.find('select').simulate('change', { target: { value: '5' } });
      wrapper.update();
      const validation = wrapper.find('.mol_validation__errortext').first();
      expect(validation.length).toBe(1);
      expect(validation.text()).toEqual('');
    });
  });

  describe('Når feltet ikke er påkrevd', () => {
    it('Så vises tom verdi for måned i dropdown', () => {
      wrapper = mount(<YearMonthInput id="year-month-input" legend="År + måned" locale={LanguageLocales.NORWEGIAN} isRequired={false} />);
      expect(wrapper.find(SafeSelectField).props().options![0].value).toBe('-1');
    });
  });

  describe('Når locale er norsk', () => {
    it('Så vises månedene i dropdown på norsk', () => {
      wrapper = mount(
        <YearMonthInput
          id="year-month-input"
          legend="År + måned"
          locale={LanguageLocales.NORWEGIAN}
          minimumYearMonth={{ year: 2014, month: 3 }}
          isRequired={true}
        />
      );
      expect(wrapper.find(SafeSelectField).props().options![0].text).toBe('januar');
    });
  });

  describe('Når locale er engelsk', () => {
    it('Så vises månedene i dropdown på engelsk', () => {
      wrapper = mount(
        <YearMonthInput
          id="year-month-input"
          legend="År + måned"
          locale={LanguageLocales.ENGLISH}
          minimumYearMonth={{ year: 2014, month: 3 }}
          isRequired={true}
        />
      );
      expect(wrapper.find(SafeSelectField).props().options![0].text).toBe('January');
    });
  });
});
