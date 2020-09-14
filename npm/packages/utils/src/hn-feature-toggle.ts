import { getAutoCommand } from './hn-service';

/**
 * Get feature-toggle from window.HN.
 * If logged in, uses: HN.Commands.__GetFeatureToggles__.FeatureToggles
 * If not logged in, uses: HN.PortalCommands.__GetFeatureToggles__.FeatureToggles
 * @param featureName name of feature
 */
export default function getFeatureToggle(featureName: string): boolean {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const commands: any = getAutoCommand();

  if (!!commands && !!commands.__GetFeatureToggles__ && !!commands.__GetFeatureToggles__.FeatureToggles) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return !!(commands.__GetFeatureToggles__.FeatureToggles as Record<string, any>)[featureName];
  }
  return false;
}
