import { TjenesteTilgang } from './generated-types/minhelseentities';
import { TjenesteType, TjenesteTilgangStatus } from '@helsenorge/core-framework/generated-types/minhelseenums';

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
