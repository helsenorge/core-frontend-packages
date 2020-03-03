export default function getFeatureToggle(featureName: string): boolean {
  if (window && window.HN && window.HN.Commands.__GetFeatureToggles__ && window.HN.Commands.__GetFeatureToggles__.FeatureToggles) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const feature = (window.HN.Commands.__GetFeatureToggles__.FeatureToggles as Record<string, any>)[featureName];
    if (feature) {
      return true;
    }
  }
  return false;
}
