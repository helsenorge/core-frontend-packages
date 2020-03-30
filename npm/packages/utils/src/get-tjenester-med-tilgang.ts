/**
 * Get tjenester from window
 * @param tjenesteId id of tjeneste
 */
// @ts-ignore
import { TjenesteTilgang } from '../../../src/generated-types/MinHelseEntities';
// @ts-ignore
import { TjenesteType, TjenesteTilgangStatus } from '../../../src/generated-types/MinHelseEnums';

export function harTilgangTilTjeneste(tjenesteId: TjenesteType): boolean {
  if (
    window &&
    window.HN &&
    window.HN.Commands.__GetTjenesterMedTilgang__ &&
    window.HN.Commands.__GetTjenesterMedTilgang__.TjenesteTilgang
  ) {
    return !!(window.HN.Commands.__GetTjenesterMedTilgang__.TjenesteTilgang as Array<TjenesteTilgang>).find(
      t => t.Tjeneste === tjenesteId && t.Status === TjenesteTilgangStatus.Ja
    );
  }
  return false;
}
