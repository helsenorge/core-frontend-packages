import { getAutoCommand, CommandsType } from './hn-service';

/**
 * Get feature-toggle from window.HN.
 * If logged in, uses: HN.Commands.__GetFeatureToggles__.FeatureToggles
 * If not logged in, uses: HN.PortalCommands.__GetFeatureToggles__.FeatureToggles
 * @param featureName name of feature
 */
export default function getFeatureToggle(featureName: string): boolean {
  const commands: CommandsType = getAutoCommand();

  if (!!commands && !!commands.__GetFeatureToggles__ && !!commands.__GetFeatureToggles__.FeatureToggles) {
    return !!commands.__GetFeatureToggles__.FeatureToggles[featureName];
  }
  return false;
}
