import { Location } from 'react-router-dom';

import { navigate, navigateAdd, goBackOrUp } from '../navigation-utils';

describe('Navigation-utils', () => {
  let globalNavigationTrail = [];
  const mockedNavigate = jest.fn();
  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate,
  }));

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('Gitt at navigationTrail har noe location lagret', () => {
    describe('Når goBackOrUp kalles for den aller første gang', () => {
      it('Så navigerer den tilbake til path /', () => {
        goBackOrUp(mockedNavigate);
        expect(mockedNavigate).toHaveBeenCalledWith('/', { replace: true });
      });
    });
  });

  describe('Gitt at navigate kalles', () => {
    describe('Når det brukes PUSH action', () => {
      it('Så er navigationTrail oppdatert med riktig location', () => {
        const locationTest: Location = {
          pathname: '/mypath',
          search: 'search',
          state: 'whateverState',
          hash: 'abc',
          key: '1',
        };
        const focusFn = jest.fn();

        const navigationTrail = navigate(locationTest, 'PUSH', focusFn);
        expect(navigationTrail[0].location).toEqual(locationTest);
        globalNavigationTrail = navigationTrail;
      });
    });

    describe('Når det brukes REPLACE action', () => {
      it('Så er navigationTrail oppdatert med riktig location', () => {
        const newLocationTest: Location = {
          pathname: '/mypath',
          search: 'search',
          state: 'whateverState',
          hash: 'abc',
          key: '1',
        };
        const focusFn = jest.fn();

        const navigationTrail = navigate(newLocationTest, 'REPLACE', focusFn);
        expect(navigationTrail[0].location).toEqual(newLocationTest);
        globalNavigationTrail = navigationTrail;
      });
    });

    describe('Når det brukes POP action', () => {
      it('Så er navigationTrail oppdatert med riktig location', () => {
        const newLocationTest: Location = {
          pathname: '/mypath2',
          search: 'search2',
          state: 'whateverState2',
          hash: 'abcdef',
          key: '2',
        };
        const focusFn = jest.fn();

        const navigationTrail = navigate(newLocationTest, 'POP', focusFn);
        expect(navigationTrail[0].location).toEqual(newLocationTest);
        globalNavigationTrail = navigationTrail;
      });
    });
  });

  describe('Gitt at navigateAdd kalles', () => {
    describe('Når det sendes en HTML section som target', () => {
      it('Så legges section til i targets Array på navigationTrail', () => {
        const mockElement = document.createElement('section');
        mockElement.focus = jest.fn();
        const a = navigateAdd(mockElement);

        expect(a[0].targets[0].nodeName).toEqual('SECTION');
      });
    });
  });

  describe('Gitt at navigationTrail har noe location lagret ', () => {
    describe('Når goBackOrUp kalles igjen mot slutten', () => {
      it('Så navigerer den tilbake', () => {
        goBackOrUp(mockedNavigate);
        expect(mockedNavigate).toHaveBeenCalledWith(-1);
      });
    });
  });
});
