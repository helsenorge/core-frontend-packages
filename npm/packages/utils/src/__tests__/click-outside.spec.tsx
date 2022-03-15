import * as React from 'react';

import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';


import clickOutside from '../click-outside';

interface CounterProps {
  counter?: number;
}

const Counter: (props: CounterProps) => JSX.Element = ({ counter }: CounterProps) => <h2>{counter}</h2>;

const BasicClickOutsideComponent: React.FunctionComponent<{}> = () => {
  const [count, setCount] = React.useState(0);
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  const handleClickOnOutsideAction = (): void => {
    setCount(count + 1);
  };

  clickOutside(wrapperRef, handleClickOnOutsideAction);

  return (
    <div ref={wrapperRef}>
      {'En funksjon for å registere klikk eller focus utenfor en komponent.'}
      <Counter counter={count} />
      <span id="mySpan">{'Klikk/Focus utenfor'}</span>
    </div>
  );
};

describe('Click-outside', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('Gitt at det finnes en wrapper med en click counter', () => {
    describe('Når det klikkes utenfor wrapperen', () => {
      it('Så kalles det clickOutside og counter øker', () => {
        const map = {};
        document.addEventListener = jest.fn((event, callback) => {
          map[event] = callback;
        });

        const wrapper = mount(<BasicClickOutsideComponent />);

        expect(wrapper.find('h2').text()).toEqual('0');
        act(() => {
          map.mousedown({ target: document.createElement('a') });
        });

        wrapper.update();

        expect(wrapper.find('h2').text()).toEqual('1');
        //expect(document.addEventListener).toBeCalledTimes(2); TODO: AUDUN HVA ER GREIA
      });
    });

    describe('Når det klikkes inne i wrapperen', () => {
      it('Så kalles det clickCounter og counter øker ikke', () => {
        const map = {};
        document.addEventListener = jest.fn((event, callback) => {
          map[event] = callback;
        });

        const wrapper = mount(<BasicClickOutsideComponent />);

        expect(wrapper.find('h2').text()).toEqual('0');

        act(() => {
          const child = document.createElement('span');
          wrapper.getDOMNode().appendChild(child);
          map.mousedown({ target: child });
        });
        wrapper.update();

        expect(wrapper.find('h2').text()).toEqual('0');

        expect(document.addEventListener).toBeCalledTimes(1);
      });
    });
  });
});
