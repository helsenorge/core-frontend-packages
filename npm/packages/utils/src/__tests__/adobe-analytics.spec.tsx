import React from 'react';

import { mount } from 'enzyme';

import * as adobeFunctions from '../adobe-analytics';

describe('Adobe-analytics', () => {
  describe('Gitt at trackSelfService kalles', () => {
    const s = {
      track: (v: string) => {},
    };
    window._satellite = s;
    window.digitalData = {};

    describe('Når SelfServiceTrackType er start', () => {
      it('Så er selfServiceStart satt til true og customProp sendt til trackeren', () => {
        adobeFunctions.trackSelfService('start', 'satelliteName', 'satelliteStep', 1, { customProp: 'customProp' });
        expect(window.digitalData.selfService.selfServiceStart).toBeTruthy();
        expect(window.digitalData.selfService.selfServiceName).toEqual('satelliteName');
        expect(window.digitalData.selfService.selfServiceFunnelStep).toEqual('satelliteStep');
        expect(window.digitalData.selfService.selfServiceFunnelStepNumber).toEqual(1);
        expect(window.digitalData.selfService.customProp).toEqual('customProp');
      });
    });

    describe('Når SelfServiceTrackType er funnel', () => {
      it('Så er selfServiceFunnel satt til true og customProp sendt til trackeren', () => {
        adobeFunctions.trackSelfService('funnel', 'satelliteName', 'satelliteStep', 1, {});
        expect(window.digitalData.selfService.selfServiceFunnel).toBeTruthy();
      });
    });

    describe('Når SelfServiceTrackType er complete', () => {
      it('Så er selfServiceComplete satt til true og customProp sendt til trackeren', () => {
        adobeFunctions.trackSelfService('complete', 'satelliteName', 'satelliteStep', 1, {});
        expect(window.digitalData.selfService.selfServiceComplete).toBeTruthy();
      });
    });

    describe('Når SelfServiceTrackType er cancel', () => {
      it('Så er selfServiceCancel satt til true og customProp sendt til trackeren', () => {
        adobeFunctions.trackSelfService('cancel', 'satelliteName', 'satelliteStep', 1, {});
        expect(window.digitalData.selfService.selfServiceCancel).toBeTruthy();
      });
    });

    describe('Når SelfServiceTrackType er continue later', () => {
      it('Så er selfServiceContinueLater satt til true og customProp sendt til trackeren', () => {
        adobeFunctions.trackSelfService('continue later', 'satelliteName', 'satelliteStep', 1, {});
        expect(window.digitalData.selfService.selfServiceContinueLater).toBeTruthy();
      });
    });
  });

  // TO-DO sjekk først om den ikke er deprecated
  /*
  describe('Gitt at trackSelfServiceIntent kalles', () => {
    const s = {
      track: (v: string) => {
      },
    };
    window._satellite = s;
    window.digitalData = {};

    describe('Når ...', () => {
      it('Så ...', () => {
        adobeFunctions.trackSelfService('start', 'satelliteName', 'satelliteStep', 1, { customProp: 'customProp' });
        expect(window.digitalData.selfService.selfServiceStart).toBeTruthy();
        expect(window.digitalData.selfService.selfServiceName).toEqual('satelliteName');
        expect(window.digitalData.selfService.selfServiceFunnelStep).toEqual('satelliteStep');
        expect(window.digitalData.selfService.selfServiceFunnelStepNumber).toEqual(1);
        expect(window.digitalData.selfService.customProp).toEqual('customProp');
      });
    });

  });

*/

  describe('Gitt at removeNamesAndOtherIds kalles', () => {
    describe('Når strengen inneholder koordinator navn', () => {
      const s = 'koordinator/jfsdkjfkdsjfks';
      it('Så er den korrigert', () => {
        const updatedString = adobeFunctions.removeNamesAndOtherIds(s);
        expect(updatedString).toEqual('koordinator');
      });
    });
    describe('Når strengen inneholder helsefagligkontakt navn', () => {
      const s = 'helsefagligkontakt/jfsdkjfkdsjfks';
      it('Så er den korrigert', () => {
        const updatedString = adobeFunctions.removeNamesAndOtherIds(s);
        expect(updatedString).toEqual('helsefagligkontakt');
      });
    });
    describe('Når strengen inneholder kommune navn', () => {
      const s = 'kommune/jfsdkjfkdsjfks';
      it('Så er den korrigert', () => {
        const updatedString = adobeFunctions.removeNamesAndOtherIds(s);
        expect(updatedString).toEqual('kommune');
      });
    });
    describe('Når strengen inneholder avtale navn', () => {
      const s = 'avtale/jfsdkjfkdsjfks/0122';
      it('Så er den korrigert', () => {
        const updatedString = adobeFunctions.removeNamesAndOtherIds(s);
        expect(updatedString).toEqual('avtale/{id}/0122');
      });
    });
  });

  describe('Gitt at getRegisterName kalles', () => {
    describe('Når ingen av de strengene treffer', () => {
      const s = ['smthg', 'random'];
      it('Så returnerer den tom streng', () => {
        const updatedString = adobeFunctions.getRegisterName(s);
        expect(updatedString).toEqual('');
      });
    });

    describe('Når strengen treffer', () => {
      it('Så returnerer den første del av dokument title', () => {
        const original = global.document['title'];
        global.document['title'] = 'documenttitle-test';

        const s = ['helseregistre', 'treff'];

        console.log('document.title ', document.title, s);
        const updatedString = adobeFunctions.getRegisterName(s);
        expect(updatedString).toEqual('documenttitle');
        global.document['title'] = original;
      });
    });

    describe('Når strengen og dokument title treffer', () => {
      const original = global.document['title'];
      global.document['title'] = 'Innsyn i helseregistre';

      const s = ['helseregistre', 'treff'];
      it('Så returnerer den riktig tittel', () => {
        console.log('document.title ', document.title, s);
        const updatedString = adobeFunctions.getRegisterName(s);
        expect(updatedString).toEqual(' helseregistre');
        global.document['title'] = original;
      });
    });
  });

  describe('Gitt at getContentGrouping kalles', () => {
    const d = {
      page: {
        category: {
          siteSection: '',
          siteSectionLevel2: '',
          contentType: '',
          registerName: '',
          contentGrouping: 'contentGroupingString',
        },
      },
    };
    describe('Når strengene er tome', () => {
      const s = [];
      it('Så returnerer den tom streng', () => {
        const updatedString = adobeFunctions.getContentGrouping(d, s);
        expect(updatedString).toEqual('');
      });
    });

    describe('Når strengene inneholder noe tilfeldig', () => {
      const s = ['something', 'random'];
      it('Så returnerer den første del av pathen', () => {
        const updatedString = adobeFunctions.getContentGrouping(d, s);
        expect(updatedString).toEqual('something');
      });
    });

    describe('Når strengene inneholder avtale', () => {
      const s = ['test', 'avtale'];
      it('Så returnerer den timeavtaler', () => {
        const updatedString = adobeFunctions.getContentGrouping(d, s);
        expect(updatedString).toEqual('timeavtaler');
      });
    });

    describe('Når strengene inneholder bestill-time', () => {
      const s = ['bestill-time', ''];
      it('Så returnerer den timeavtaler', () => {
        const updatedString = adobeFunctions.getContentGrouping(d, s);
        expect(updatedString).toEqual('Fastlegen');
      });
    });
  });
});
