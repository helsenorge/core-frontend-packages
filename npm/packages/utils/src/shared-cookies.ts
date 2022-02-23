import { getHostnameWithoutSubdomain } from './cookie';

/**
 * Returnerer domene og path for bruk i cookie som skal gjelde på tvers av åpne sider og tjenester
 * @returns domain og path for bruk i cookie
 */
export const getCookieDomainAndPath = (): string => `domain=${getHostnameWithoutSubdomain()}; path=/;`;

/**
 * Lagrer cookie på tvers av åpne sider og tjenester
 * @param name navn på cookie
 * @param value verdi på cookie
 * @param maxAgeInDays levetid på cookie i dager
 */
export const setSharedCookie = (name: string, value: string, maxAgeInDays = 365): void => {
  const maxAgeInSeconds = maxAgeInDays * 24 * 60 * 60;

  document.cookie = `${name}=${value}; ${getCookieDomainAndPath()} max-age=${maxAgeInSeconds}`;
};

/**
 * Sletter cookie på tvers av åpne sider og tjenester
 * @param name navn på cookie
 */
export const deleteSharedCookie = (name: string): void => {
  document.cookie = `${name}=; ${getCookieDomainAndPath()} expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
};
