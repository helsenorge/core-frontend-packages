import loggerUtils from '../logger';

describe('Logger', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  const originalEnv = process.env['NODE_ENV'];
  process.env['NODE_ENV'] = 'dev';
  const originalConsole = global.console;
  // adding console functions that are undefined
  console.exception = () => {};
  console.profile = () => {};
  console.profileEnd = () => {};

  const logToServerMock = jest.spyOn(loggerUtils, 'logToServer');

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

    describe('Når debug kalles', () => {
      it('Så logges det riktig', () => {
        const consoleMock = jest.spyOn(global.console, 'debug');

        loggerUtils.debug('message', 'blabla');
        expect(consoleMock.mock.calls[0][0]).toEqual('message');
        expect(consoleMock.mock.calls[0][1]).toEqual(['blabla']);
        expect(logToServerMock).toHaveBeenCalledWith(1, 'message', ['blabla']);
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

    describe('Når error kalles', () => {
      it('Så logges det riktig', () => {
        const consoleMock = jest.spyOn(global.console, 'error');
        try {
          loggerUtils.error('error message', 'error blabla');
        } catch (e) {
          expect(consoleMock.mock.calls[0][0]).toEqual('error message');
          expect(consoleMock.mock.calls[0][1]).toEqual(['error blabla']);
          expect(logToServerMock.mock.calls[1][0]).toEqual(['error message']);
        }
      });
    });

    describe('Når exception kalles', () => {
      it('Så logges det riktig', () => {
        const consoleMock = jest.spyOn(global.console, 'exception');
        try {
          loggerUtils.exception('exception message', 'exception blabla');
        } catch (e) {
          expect(consoleMock.mock.calls[0][0]).toEqual('exception message');
          expect(consoleMock.mock.calls[0][1]).toEqual(['exception blabla']);
          expect(logToServerMock.mock.calls[2][0]).toEqual(['exception message']);
        }
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

    describe('Når info kalles', () => {
      it('Så logges det riktig', () => {
        const consoleMock = jest.spyOn(global.console, 'info');
        loggerUtils.info('info message', 'info blabla');
        expect(consoleMock.mock.calls[0][0]).toEqual('info message');
        expect(consoleMock.mock.calls[0][1]).toEqual(['info blabla']);
        expect(logToServerMock.mock.calls[3][1]).toEqual('info message');
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

    describe('Når trace kalles', () => {
      it('Så logges det riktig', () => {
        const consoleMock = jest.spyOn(global.console, 'trace');
        loggerUtils.trace('trace message', 'trace blabla');
        expect(consoleMock.mock.calls[0][0]).toEqual('trace message');
        expect(consoleMock.mock.calls[0][1]).toEqual(['trace blabla']);
        expect(logToServerMock.mock.calls[4][1]).toEqual('trace message');
      });
    });

    describe('Når warn kalles', () => {
      it('Så logges det riktig', () => {
        const consoleMock = jest.spyOn(global.console, 'warn');
        loggerUtils.warn('warn message', 'warn blabla');
        expect(consoleMock.mock.calls[0][0]).toEqual('warn message');
        expect(consoleMock.mock.calls[0][1]).toEqual(['warn blabla']);
        expect(logToServerMock.mock.calls[5][1]).toEqual('warn message');
      });
    });
  });
  process.env['NODE_ENV'] = originalEnv;
  global.console = originalConsole;
});
