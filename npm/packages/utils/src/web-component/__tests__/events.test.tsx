import { SessionTimeoutAction } from '../../types/entities';
import {
  HNeventRefreshVarslinger,
  HNeventRefreshVarslingerOgHendelsesmeny,
  HNeventSetAnonymousHeader,
  HNeventSetDriftsmeldingPath,
  HNeventSetHiddenFooter,
  HNeventSetHiddenHeader,
  HNeventSetHiddenPromopanel,
  HNeventSetOnShowSignoutbox,
  HNeventSetSimplifiedFooter,
  HNeventSetSimplifiedHeader,
} from '../events';

const header = document.createElement('hn-webcomp-header');
document.body.append(header);
const headerEventSpy = jest.spyOn(header, 'dispatchEvent');

const footer = document.createElement('hn-webcomp-footer');
document.body.append(footer);
const footerEventSpy = jest.spyOn(footer, 'dispatchEvent');

const driftspanel = document.createElement('hn-webcomp-driftspanel');
document.body.append(driftspanel);
const driftspanelEventSpy = jest.spyOn(driftspanel, 'dispatchEvent');

const promopanel = document.createElement('hn-webcomp-cms-block-promopanel');
document.body.append(promopanel);
const promopanelEventSpy = jest.spyOn(promopanel, 'dispatchEvent');

describe('Gitt at HNeventSetSimplifiedHeader kalles', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('Når HNeventSetSimplifiedHeader kalles uten argumenter', () => {
    it('Så dispatches en event med simplifiedHeader true', () => {
      HNeventSetSimplifiedHeader(true);

      expect(headerEventSpy).toHaveBeenCalledTimes(1);
      expect((headerEventSpy.mock.calls[0][0] as CustomEvent).type).toEqual('hn-webcomp-header-footer-event-setsimplifiedheader');
      expect((headerEventSpy.mock.calls[0][0] as CustomEvent).detail).toEqual({
        simplifiedHeader: true,
      });
    });
  });

  describe('Når HNeventSetSimplifiedHeader kalles uten argumenter', () => {
    it('Så dispatches en event med simplifiedHeader false', () => {
      HNeventSetSimplifiedHeader(false);

      expect(headerEventSpy).toHaveBeenCalledTimes(1);
      expect((headerEventSpy.mock.calls[0][0] as CustomEvent).type).toEqual('hn-webcomp-header-footer-event-setsimplifiedheader');
      expect((headerEventSpy.mock.calls[0][0] as CustomEvent).detail).toEqual({
        simplifiedHeader: false,
      });
    });
  });
});

describe('Gitt at HNeventSetAnonymousHeader kalles', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('Når HNeventSetAnonymousHeader kalles uten argumenter', () => {
    it('Så dispatches en event med anonymousHeader true', () => {
      HNeventSetAnonymousHeader(true);

      expect(headerEventSpy).toHaveBeenCalledTimes(1);
      expect((headerEventSpy.mock.calls[0][0] as CustomEvent).type).toEqual('hn-webcomp-header-footer-event-setanonymousheader');
      expect((headerEventSpy.mock.calls[0][0] as CustomEvent).detail).toEqual({
        anonymousHeader: true,
      });
    });
  });

  describe('Når HNeventSetAnonymousHeader kalles uten argumenter', () => {
    it('Så dispatches en event med anonymousHeader false', () => {
      HNeventSetAnonymousHeader(false);

      expect(headerEventSpy).toHaveBeenCalledTimes(1);
      expect((headerEventSpy.mock.calls[0][0] as CustomEvent).type).toEqual('hn-webcomp-header-footer-event-setanonymousheader');
      expect((headerEventSpy.mock.calls[0][0] as CustomEvent).detail).toEqual({
        anonymousHeader: false,
      });
    });
  });
});

describe('Gitt at HNeventSetHiddenHeader kalles', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('Når HNeventSetHiddenHeader kalles uten argumenter', () => {
    it('Så dispatches en event med hiddenHeader true', () => {
      HNeventSetHiddenHeader(true);

      expect(headerEventSpy).toHaveBeenCalledTimes(1);
      expect((headerEventSpy.mock.calls[0][0] as CustomEvent).type).toEqual('hn-webcomp-header-footer-event-sethiddenheader');
      expect((headerEventSpy.mock.calls[0][0] as CustomEvent).detail).toEqual({
        hiddenHeader: true,
      });
    });
  });

  describe('Når HNeventSetHiddenHeader kalles uten argumenter', () => {
    it('Så dispatches en event med hiddenHeader false', () => {
      HNeventSetHiddenHeader(false);

      expect(headerEventSpy).toHaveBeenCalledTimes(1);
      expect((headerEventSpy.mock.calls[0][0] as CustomEvent).type).toEqual('hn-webcomp-header-footer-event-sethiddenheader');
      expect((headerEventSpy.mock.calls[0][0] as CustomEvent).detail).toEqual({
        hiddenHeader: false,
      });
    });
  });
});

describe('Gitt at HNeventSetSimplifiedFooter kalles', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('Når HNeventSetSimplifiedFooter kalles uten argumenter', () => {
    it('Så dispatches en event med simplifiedFooter true', () => {
      HNeventSetSimplifiedFooter('litt tekst');

      expect(footerEventSpy).toHaveBeenCalledTimes(1);
      expect((footerEventSpy.mock.calls[0][0] as CustomEvent).type).toEqual('hn-webcomp-header-footer-event-setsimplifiedfooter');
      expect((footerEventSpy.mock.calls[0][0] as CustomEvent).detail).toEqual({
        simplifiedFooter: true,
        simplifiedFooterText: 'litt tekst',
      });
    });
  });

  describe('Når HNeventSetSimplifiedFooter kalles uten argumenter', () => {
    it('Så dispatches en event med simplifiedFooter false', () => {
      HNeventSetSimplifiedFooter('litt tekst', false);

      expect(footerEventSpy).toHaveBeenCalledTimes(1);
      expect((footerEventSpy.mock.calls[0][0] as CustomEvent).type).toEqual('hn-webcomp-header-footer-event-setsimplifiedfooter');
      expect((footerEventSpy.mock.calls[0][0] as CustomEvent).detail).toEqual({
        simplifiedFooter: false,
        simplifiedFooterText: 'litt tekst',
      });
    });
  });
});

describe('Gitt at HNeventSetHiddenFooter kalles', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('Når HNeventSetHiddenFooter kalles uten argumenter', () => {
    it('Så dispatches en event med hiddenFooter true', () => {
      HNeventSetHiddenFooter();

      expect(footerEventSpy).toHaveBeenCalledTimes(1);
      expect((footerEventSpy.mock.calls[0][0] as CustomEvent).type).toEqual('hn-webcomp-header-footer-event-sethiddenfooter');
      expect((footerEventSpy.mock.calls[0][0] as CustomEvent).detail).toEqual({
        hiddenFooter: true,
      });
    });
  });

  describe('Når HNeventSetHiddenFooter kalles uten argumenter', () => {
    it('Så dispatches en event med hiddenFooter false', () => {
      HNeventSetHiddenFooter(false);

      expect(footerEventSpy).toHaveBeenCalledTimes(1);
      expect((footerEventSpy.mock.calls[0][0] as CustomEvent).type).toEqual('hn-webcomp-header-footer-event-sethiddenfooter');
      expect((footerEventSpy.mock.calls[0][0] as CustomEvent).detail).toEqual({
        hiddenFooter: false,
      });
    });
  });
});

describe('Gitt at HNeventRefreshVarslinger kalles', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('Når HNeventRefreshVarslinger kalles uten argumenter', () => {
    it('Så dispatches en event', () => {
      HNeventRefreshVarslinger();

      expect(headerEventSpy).toHaveBeenCalledTimes(1);
      expect((headerEventSpy.mock.calls[0][0] as CustomEvent).type).toEqual('hn-webcomp-header-footer-event-refreshvarslinger');
      expect((headerEventSpy.mock.calls[0][0] as CustomEvent).detail).toEqual({});
    });
  });
});

describe('Gitt at HNeventSetDriftsmeldingPath kalles', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('Når HNeventSetDriftsmeldingPath kalles uten argumenter', () => {
    it('Så dispatches en event', () => {
      HNeventSetDriftsmeldingPath('en path');

      expect(driftspanelEventSpy).toHaveBeenCalledTimes(1);
      expect((driftspanelEventSpy.mock.calls[0][0] as CustomEvent).type).toEqual('hn-webcomp-header-footer-event-setdriftsmeldingpath');
      expect((driftspanelEventSpy.mock.calls[0][0] as CustomEvent).detail).toEqual({ path: 'en path' });
    });
  });
});

describe('Gitt at HNeventRefreshVarslingerOgHendelsesmeny kalles', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('Når HNeventRefreshVarslingerOgHendelsesmeny kalles uten argumenter', () => {
    it('Så dispatches en event', () => {
      HNeventRefreshVarslingerOgHendelsesmeny();

      expect(headerEventSpy).toHaveBeenCalledTimes(1);
      expect((headerEventSpy.mock.calls[0][0] as CustomEvent).type).toEqual(
        'hn-webcomp-header-footer-event-refreshvarslingeroghendelsesmeny'
      );
      expect((headerEventSpy.mock.calls[0][0] as CustomEvent).detail).toEqual({});
    });
  });
});

describe('Gitt at HNeventSetOnShowSignoutbox kalles', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('Når HNeventSetOnShowSignoutbox kalles uten argumenter', () => {
    it('Så dispatches en event', () => {
      const handler = () => SessionTimeoutAction.Default;
      HNeventSetOnShowSignoutbox(handler);

      expect(headerEventSpy).toHaveBeenCalledTimes(1);
      expect((headerEventSpy.mock.calls[0][0] as CustomEvent).type).toEqual('hn-webcomp-header-footer-event-setonshowsignoutbox');
      expect((headerEventSpy.mock.calls[0][0] as CustomEvent).detail).toEqual({ onShowSignOutBox: handler });
    });
  });
});

describe('Gitt at HNeventSetHiddenPromopanel kalles', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('Når HNeventSetHiddenPromopanel kalles uten argumenter', () => {
    it('Så dispatches en event med simplifiedFooter true', () => {
      HNeventSetHiddenPromopanel(true);

      expect(promopanelEventSpy).toHaveBeenCalledTimes(1);
      expect((promopanelEventSpy.mock.calls[0][0] as CustomEvent).type).toEqual('hn-webcomp-cms-blocks-event-sethiddenpromopanel');
      expect((promopanelEventSpy.mock.calls[0][0] as CustomEvent).detail).toEqual({
        hiddenPromopanel: true,
      });
    });
  });

  describe('Når HNeventSetHiddenPromopanel kalles uten argumenter', () => {
    it('Så dispatches en event med simplifiedFooter false', () => {
      HNeventSetHiddenPromopanel(false);

      expect(promopanelEventSpy).toHaveBeenCalledTimes(1);
      expect((promopanelEventSpy.mock.calls[0][0] as CustomEvent).type).toEqual('hn-webcomp-cms-blocks-event-sethiddenpromopanel');
      expect((promopanelEventSpy.mock.calls[0][0] as CustomEvent).detail).toEqual({
        hiddenPromopanel: false,
      });
    });
  });
});
