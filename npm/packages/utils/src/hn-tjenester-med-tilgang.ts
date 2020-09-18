/**
 * Returnerer true hvis tjenesten har TjenesteTilgangStatus Ja (1)
 * @param tjenesteId id of tjeneste
 */

import { TjenesteType, TjenesteTilgang, TjenesteTilgangStatus } from './types/entities';

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
