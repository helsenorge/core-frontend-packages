import { vi } from 'vitest';

import { getQueryStrings } from '../querystring-utils';

describe('Querystrings-utils', () => {
  const oldWindowLocation = global.window.location;

  beforeAll(() => {
    delete global.window.location;

    global.window.location = Object.defineProperties(
      {},
      {
        ...Object.getOwnPropertyDescriptors(oldWindowLocation),
        assign: {
          configurable: true,
          value: vi.fn(),
        },
        search: {
          configurable: true,
          value: '?paramtest=myvalue&paramtest2=myvalue2',
        },
      }
    );
  });

  afterAll(() => {
    global.window.location = oldWindowLocation;
    vi.clearAllMocks();
  });

  describe('Gitt at window-location-search har url params', () => {
    describe('Når getQueryStrings kalles', () => {
      it('Så returnerer den alle urlParams', () => {
        const urlParams = getQueryStrings();
        expect(urlParams).toEqual({ paramtest: 'myvalue', paramtest2: 'myvalue2' });
      });
    });
  });
});
