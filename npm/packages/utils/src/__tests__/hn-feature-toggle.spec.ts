import getFeatureToggle from '../hn-feature-toggle';

function setupFeature(enabled: boolean, featureName?: string): void {
  window.HN = {};
  window.HN.Rest = {};
  window.HN.Commands = {};
  window.HN.Commands.__GetFeatureToggles__ = {};
  window.HN.Commands.__GetFeatureToggles__.FeatureToggles = {};

  if (featureName) {
    window.HN.Commands.__GetFeatureToggles__.FeatureToggles[featureName] = enabled;
  }
}

describe('FeatureToggle', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('Gitt at getFeatureToggle kalles', () => {
    describe('Når Feature1 er undefined', () => {
      it('Så gis false', () => {
        setupFeature(false);
        expect(getFeatureToggle('Feature1')).toBe(false);
      });
    });

    describe('Når Feature1 er slått på', () => {
      it('Så gis true', () => {
        setupFeature(true, 'Feature1');
        expect(getFeatureToggle('Feature1')).toBe(true);
      });
    });

    describe('Når Feature2 er slått av', () => {
      it('Så gis false', () => {
        setupFeature(false, 'Feature2');
        expect(getFeatureToggle('Feature2')).toBe(false);
      });
    });

    describe('Når window.HN.PortalCommands fortsatt eksisterer og OldFeature er slått på', () => {
      it('Så gis true', () => {
        const originalWindowHn = window.HN;

        window.HN.PortalCommands = {};
        window.HN.PortalCommands.__GetFeatureToggles__ = {};
        window.HN.PortalCommands.__GetFeatureToggles__.FeatureToggles = {};
        window.HN.PortalCommands.__GetFeatureToggles__.FeatureToggles.OldFeature = true;

        expect(getFeatureToggle('OldFeature')).toBe(true);

        window.HN = originalWindowHn;
      });
    });

    describe('Når window.HN er undefined', () => {
      it('Så gis false', () => {
        const originalWindowHn = window.HN;

        window.HN = undefined;

        expect(getFeatureToggle('Feature1')).toBe(false);

        window.HN = originalWindowHn;
      });
    });
    describe('Når window.HN.Commands er undefined', () => {
      it('Så gis false', () => {
        const originalWindowHn = window.HN;

        window.HN = {};
        window.HN.Commands = undefined;

        expect(getFeatureToggle('Feature1')).toBe(false);

        window.HN = originalWindowHn;
      });
    });
    describe('Når window.HN.Commands.__GetFeatureToggles__ er undefined', () => {
      it('Så gis false', () => {
        const originalWindowHn = window.HN;

        window.HN = {};
        window.HN.Commands = {};
        window.HN.Commands.__GetFeatureToggles__ = undefined;

        expect(getFeatureToggle('Feature1')).toBe(false);

        window.HN = originalWindowHn;
      });
    });
    describe('Når window.HN.Commands.__GetFeatureToggles__.FeatureToggles er undefined', () => {
      it('Så gis false', () => {
        const originalWindowHn = window.HN;

        window.HN = {};
        window.HN.Commands = {};
        window.HN.Commands.__GetFeatureToggles__ = {};
        window.HN.Commands.__GetFeatureToggles__.FeatureToggles = undefined;

        expect(getFeatureToggle('Feature1')).toBe(false);

        window.HN = originalWindowHn;
      });
    });
  });
});
