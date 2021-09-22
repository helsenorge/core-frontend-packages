/**
 * Get feature-toggle from window.HN.
 * @param featureName name of feature
 */
export default function getFeatureToggle(featureName: string): boolean {
  const getFeatureToggles = window.HN?.PortalCommands?.__GetFeatureToggles__ || window.HN?.Commands?.__GetFeatureToggles__;

  return !!getFeatureToggles?.FeatureToggles?.[featureName];
}
