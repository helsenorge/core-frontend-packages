import getFeatureToggle from "../feature-toggle";

window.HN = window.HN || {};
window.HN.Commands = window.HN.Commands || {};
window.HN.Commands.__GetFeatureToggles__ =
  window.HN.Commands.__GetFeatureToggles__ || {};
window.HN.Commands.__GetFeatureToggles__.FeatureToggles =
  window.HN.Commands.__GetFeatureToggles__.FeatureToggles || {};

function setupFeature(featureName: string, enabled: boolean): void {
  window.HN.Commands.__GetFeatureToggles__.FeatureToggles[
    featureName
  ] = enabled;
}

describe("FeatureToggle", () => {
  it("Should return false if feature is undefined", () => {
    expect(getFeatureToggle("Feature1")).toBe(false);
  });

  it("Should return true if feature is enabled", () => {
    setupFeature("Feature1", true);
    expect(getFeatureToggle("Feature1")).toBe(true);
  });

  it("Should return false if feature is disabled", () => {
    setupFeature("Feature2", false);
    expect(getFeatureToggle("Feature2")).toBe(false);
  });
});
