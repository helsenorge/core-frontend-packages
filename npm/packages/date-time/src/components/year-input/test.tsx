import * as React from 'react';

import { mount, ReactWrapper } from 'enzyme';

import '@helsenorge/designsystem-react/__mocks__/matchMedia';

import Form from '@helsenorge/form/components/form';
import Validation from '@helsenorge/form/components/form/validation';

import { YearErrorResources, YearInput } from '.';

describe('Git at YearInput felt rendres', () => {
  let wrapper: ReactWrapper<{}, {}>;

  describe('Når det er skrevet inn mellom 1 og 3 tegn i feltet og feltet mister fokus', () => {
    it('Så visers feilmelding', () => {
      wrapper = mount(<YearInput id="year-input" label="År" errorResources={{ errorInvalidYear: 'Feil år' } as YearErrorResources} />);
      wrapper.find('input').simulate('change', { target: { value: '201' } });
      wrapper.update();
      wrapper.find('input').simulate('blur');
      expect(wrapper.find('.mol_validation__errortext').text()).toBe('Feil år');
    });
  });

  describe('Når år er før minste tillate år og feltet mister fokus', () => {
    it('Så vises feilmelding', () => {
      wrapper = mount(
        <YearInput
          id="year-input"
          label="År"
          minimumYear={2014}
          errorResources={{ errorYearBeforeMinDate: 'Min år' } as YearErrorResources}
        />
      );
      wrapper.find('input').simulate('change', { target: { value: '2013' } });
      wrapper.update();
      wrapper.find('input').simulate('blur');
      expect(wrapper.find('.mol_validation__errortext').text()).toBe('Min år: 2014');
    });
  });

  describe('Når år er etter høyeste tillate år og feltet mister fokus', () => {
    it('så vises feilmelding', () => {
      wrapper = mount(
        <YearInput
          id="year-input"
          label="År"
          maximumYear={2014}
          errorResources={{ errorYearAfterMaxDate: 'Max år' } as YearErrorResources}
        />
      );
      wrapper.find('input').simulate('change', { target: { value: '2015' } });
      wrapper.update();
      wrapper.find('input').simulate('blur');
      expect(wrapper.find('.mol_validation__errortext').text()).toBe('Max år: 2014');
    });
  });

  describe('Når feltet er tomt, påkrevd, del av en form og form sendes inn', () => {
    it('Så vises feilmelding', () => {
      wrapper = mount(
        <Form submitButtonText="Send" onSubmit={jest.fn()}>
          <Validation>
            <YearInput
              id="year-input"
              label="År"
              isRequired={true}
              errorResources={{ errorRequiredYear: 'År er påkrevd' } as YearErrorResources}
            />
          </Validation>
        </Form>
      );

      wrapper.find('button').first().simulate('click');

      wrapper.update();
      expect(wrapper.find('.mol_validation__errortext').text()).toBe('År er påkrevd');
    });
  });

  describe('Når feltet har feilmelding og endres til gyldig verdi', () => {
    it('Så fjernes feilmelding', () => {
      wrapper = mount(
        <YearInput
          id="year-input"
          label="År"
          maximumYear={2014}
          errorResources={{ errorYearAfterMaxDate: 'Max år' } as YearErrorResources}
        />
      );
      wrapper.find('input').simulate('change', { target: { value: '2015' } });
      wrapper.update();
      wrapper.find('input').simulate('blur');
      wrapper.find('input').simulate('change', { target: { value: '2013' } });
      wrapper.update();
      const validation = wrapper.find('.mol_validation__errortext').first();
      expect(validation.length).toBe(1);
      expect(validation.text()).toEqual('');
    });
  });
});
