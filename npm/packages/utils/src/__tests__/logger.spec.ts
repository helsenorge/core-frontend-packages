import loggerUtils from '../logger';

const ORIGINAL_ENV = process.env.NODE_ENV;

describe('Logger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  beforeAll(() => {
    process.env.NODE_ENV = 'dev';
  });
  afterAll(() => {
    process.env.NODE_ENV = ORIGINAL_ENV;
  });

  // adding console functions that are undefined
  console.profile = () => {};
  console.profileEnd = () => {};

  describe('Gitt at process.env.NODE_ENV er ulik prod', () => {
    describe('Når assert kalles', () => {
      it('Så logges det riktig', () => {
        const consoleMock = jest.spyOn(global.console, 'assert').mockImplementation(jest.fn());
        loggerUtils.assert(true, 'testmessage', 'param1');
        expect(consoleMock.mock.calls[0][1]).toEqual('testmessage');
      });
    });

    describe('Når clear kalles', () => {
      it('Så logges det riktig', () => {
        const consoleMock = jest.spyOn(global.console, 'clear').mockImplementation(jest.fn());
        loggerUtils.clear();
        expect(consoleMock).toHaveBeenCalled();
      });
    });

    describe('Når count kalles', () => {
      it('Så logges det riktig', () => {
        const consoleMock = jest.spyOn(global.console, 'count').mockImplementation(jest.fn());
        loggerUtils.count('2');
        expect(consoleMock.mock.calls[0]).toEqual(['2']);
      });
    });

    describe('Når dir kalles', () => {
      it('Så logges det riktig', () => {
        const consoleMock = jest.spyOn(global.console, 'dir').mockImplementation(jest.fn());

        loggerUtils.dir('value', 'param');
        expect(consoleMock.mock.calls[0][0]).toEqual('value');
        expect(consoleMock.mock.calls[0][1]).toEqual(['param']);
      });
    });

    describe('Når dirxml kalles', () => {
      it('Så logges det riktig', () => {
        const consoleMock = jest.spyOn(global.console, 'dirxml').mockImplementation(jest.fn());

        loggerUtils.dirxml('dirxml value');
        expect(consoleMock.mock.calls[0][0]).toEqual('dirxml value');
      });
    });

    describe('Når group kalles', () => {
      it('Så logges det riktig', () => {
        const consoleMock = jest.spyOn(global.console, 'group').mockImplementation(jest.fn());
        loggerUtils.group('group');
        expect(consoleMock.mock.calls[0]).toEqual(['group']);
      });
    });

    describe('Når groupCollapsed kalles', () => {
      it('Så logges det riktig', () => {
        const consoleMock = jest.spyOn(global.console, 'groupCollapsed').mockImplementation(jest.fn());
        loggerUtils.groupCollapsed('groupCollapsed');
        expect(consoleMock.mock.calls[0]).toEqual(['groupCollapsed']);
      });
    });

    describe('Når groupEnd kalles', () => {
      it('Så logges det riktig', () => {
        const consoleMock = jest.spyOn(global.console, 'groupEnd').mockImplementation(jest.fn());
        loggerUtils.groupEnd();
        expect(consoleMock).toHaveBeenCalled();
      });
    });

    describe('Når log kalles', () => {
      it('Så logges det riktig', () => {
        const consoleMock = jest.spyOn(global.console, 'log').mockImplementation(jest.fn());
        loggerUtils.log('log message', 'log blabla');
        expect(consoleMock.mock.calls[0][0]).toEqual('log message');
        expect(consoleMock.mock.calls[0][1]).toEqual(['log blabla']);
      });
    });

    describe('Når profile kalles', () => {
      it('Så logges det riktig', () => {
        const consoleMock = jest.spyOn(global.console, 'profile').mockImplementation(jest.fn());
        loggerUtils.profile('profile');
        expect(consoleMock.mock.calls[0]).toEqual(['profile']);
      });
    });

    describe('Når profileEnd kalles', () => {
      it('Så logges det riktig', () => {
        const consoleMock = jest.spyOn(global.console, 'profileEnd').mockImplementation(jest.fn());
        loggerUtils.profileEnd();
        expect(consoleMock).toHaveBeenCalled();
      });
    });

    describe('Når table kalles', () => {
      it('Så logges det riktig', () => {
        const consoleMock = jest.spyOn(global.console, 'table').mockImplementation(jest.fn());
        loggerUtils.table(['data']);
        expect(consoleMock.mock.calls[0][0][0]).toEqual(['data']);
      });
    });

    describe('Når time kalles', () => {
      it('Så logges det riktig', () => {
        const consoleMock = jest.spyOn(global.console, 'time').mockImplementation(jest.fn());
        loggerUtils.time('timername');
        expect(consoleMock.mock.calls[0]).toEqual(['timername']);
      });
    });

    describe('Når timeEnd kalles', () => {
      it('Så logges det riktig', () => {
        const consoleMock = jest.spyOn(global.console, 'timeEnd').mockImplementation(jest.fn());
        loggerUtils.timeEnd('timername');
        expect(consoleMock.mock.calls[0]).toEqual(['timername']);
      });
    });
  });
});
