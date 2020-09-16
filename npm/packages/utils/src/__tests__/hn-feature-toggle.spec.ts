import getFeatureToggle from '../hn-feature-toggle';

function setupFeature(enabled: boolean, authorized: boolean, featureName?: string): void {
  window.HN = {};
  window.HN.Rest = {};
  window.HN.Rest.__Authorized__ = authorized;
  window.HN.Commands = {};
  window.HN.Commands.__GetFeatureToggles__ = {};
  window.HN.Commands.__GetFeatureToggles__.FeatureToggles = {};
  window.HN.PortalCommands = {};
  window.HN.PortalCommands.__GetFeatureToggles__ = {};
  window.HN.PortalCommands.__GetFeatureToggles__.FeatureToggles = {};

  if (featureName) {
    if (authorized) {
      window.HN.Commands.__GetFeatureToggles__.FeatureToggles[featureName] = enabled;
    } else {
      window.HN.PortalCommands.__GetFeatureToggles__.FeatureToggles[featureName] = enabled;
    }
  }
}

describe('FeatureToggle', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('Gitt at bruker er pålogget', () => {
    describe('Når Feature1 er undefined', () => {
      it('Så gis false', () => {
        setupFeature(false, true);
        expect(getFeatureToggle('Feature1')).toBe(false);
      });
    });

    describe('Når Feature1 er slått på', () => {
      it('Så gis true', () => {
        setupFeature(true, true, 'Feature1');
        expect(getFeatureToggle('Feature1')).toBe(true);
      });
    });

    describe('Når Feature2 er slått av', () => {
      it('Så gis false', () => {
        setupFeature(false, true, 'Feature2');
        expect(getFeatureToggle('Feature2')).toBe(false);
      });
    });
  });

  describe('Gitt at bruker ikke er pålogget', () => {
    describe('Når Feature1 er undefined', () => {
      it('Så gis false', () => {
        setupFeature(false, false);
        expect(getFeatureToggle('Feature1')).toBe(false);
      });
    });

    describe('Når Feature1 er slått på', () => {
      it('Så gis true', () => {
        setupFeature(true, false, 'Feature1');
        expect(getFeatureToggle('Feature1')).toBe(true);
      });
    });

    describe('Når Feature2 er slått av', () => {
      it('Så gis false', () => {
        setupFeature(false, false, 'Feature2');
        expect(getFeatureToggle('Feature2')).toBe(false);
      });
    });
  });
});
