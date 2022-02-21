import loggerUtils from '../logger';

describe('Logger', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  const originalEnv = process.env['NODE_ENV'];
  process.env['NODE_ENV'] = 'dev';
  const originalConsole = global.console;
  // adding console functions that are undefined
  console.profile = () => {};
  console.profileEnd = () => {};

  describe('Gitt at process.env.NODE_ENV er ulik prod', () => {
    describe('Når assert kalles', () => {
      it('Så logges det riktig', () => {
        const consoleMock = jest.spyOn(global.console, 'assert');
        loggerUtils.assert(true, 'testmessage', 'param1');
        expect(consoleMock.mock.calls[0][1]).toEqual('testmessage');
      });
    });

    describe('Når clear kalles', () => {
      it('Så logges det riktig', () => {
        const consoleMock = jest.spyOn(global.console, 'clear');
        loggerUtils.clear();
        expect(consoleMock).toHaveBeenCalled();
      });
    });

    describe('Når count kalles', () => {
      it('Så logges det riktig', () => {
        const consoleMock = jest.spyOn(global.console, 'count');
        loggerUtils.count('2');
        expect(consoleMock.mock.calls[0]).toEqual(['2']);
      });
    });

    describe('Når dir kalles', () => {
      it('Så logges det riktig', () => {
        const consoleMock = jest.spyOn(global.console, 'dir');

        loggerUtils.dir('value', 'param');
        expect(consoleMock.mock.calls[0][0]).toEqual('value');
        expect(consoleMock.mock.calls[0][1]).toEqual(['param']);
      });
    });

    describe('Når dirxml kalles', () => {
      it('Så logges det riktig', () => {
        const consoleMock = jest.spyOn(global.console, 'dirxml');

        loggerUtils.dirxml('dirxml value');
        expect(consoleMock.mock.calls[0][0]).toEqual('dirxml value');
      });
    });

    describe('Når group kalles', () => {
      it('Så logges det riktig', () => {
        const consoleMock = jest.spyOn(global.console, 'group');
        loggerUtils.group('group');
        expect(consoleMock.mock.calls[0]).toEqual(['group']);
      });
    });

    describe('Når groupCollapsed kalles', () => {
      it('Så logges det riktig', () => {
        const consoleMock = jest.spyOn(global.console, 'groupCollapsed');
        loggerUtils.groupCollapsed('groupCollapsed');
        expect(consoleMock.mock.calls[0]).toEqual(['groupCollapsed']);
      });
    });

    describe('Når groupEnd kalles', () => {
      it('Så logges det riktig', () => {
        const consoleMock = jest.spyOn(global.console, 'groupEnd');
        loggerUtils.groupEnd();
        expect(consoleMock).toHaveBeenCalled();
      });
    });

    describe('Når log kalles', () => {
      it('Så logges det riktig', () => {
        const consoleMock = jest.spyOn(global.console, 'log');
        loggerUtils.log('log message', 'log blabla');
        expect(consoleMock.mock.calls[0][0]).toEqual('log message');
        expect(consoleMock.mock.calls[0][1]).toEqual(['log blabla']);
      });
    });

    describe('Når profile kalles', () => {
      it('Så logges det riktig', () => {
        const consoleMock = jest.spyOn(global.console, 'profile');
        loggerUtils.profile('profile');
        expect(consoleMock.mock.calls[0]).toEqual(['profile']);
      });
    });

    describe('Når profileEnd kalles', () => {
      it('Så logges det riktig', () => {
        const consoleMock = jest.spyOn(global.console, 'profileEnd');
        loggerUtils.profileEnd();
        expect(consoleMock).toHaveBeenCalled();
      });
    });

    describe('Når table kalles', () => {
      it('Så logges det riktig', () => {
        const consoleMock = jest.spyOn(global.console, 'table');
        loggerUtils.table(['data']);
        expect(consoleMock.mock.calls[0][0][0]).toEqual(['data']);
      });
    });

    describe('Når time kalles', () => {
      it('Så logges det riktig', () => {
        const consoleMock = jest.spyOn(global.console, 'time');
        loggerUtils.time('timername');
        expect(consoleMock.mock.calls[0]).toEqual(['timername']);
      });
    });

    describe('Når timeEnd kalles', () => {
      it('Så logges det riktig', () => {
        const consoleMock = jest.spyOn(global.console, 'timeEnd');
        loggerUtils.timeEnd('timername');
        expect(consoleMock.mock.calls[0]).toEqual(['timername']);
      });
    });
  });
  process.env['NODE_ENV'] = originalEnv;
  global.console = originalConsole;
});
