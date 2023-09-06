import { Location, NavigationType, NavigateFunction } from 'react-router-dom';

interface Navigation {
  location: Location | undefined;
  targets: HTMLElement[];
}

const navigationTrail: Navigation[] = [];

const locationsAreEqual = (a: Location, b: Location): boolean => {
  return a.hash === b.hash && a.key === b.key && a.pathname === b.pathname;
};

const navigateBack = (location: Location, focus: (targets: HTMLElement[]) => void): void => {
  navigationTrail.pop();
  if (navigationTrail.length > 0) {
    const navigation = navigationTrail[navigationTrail.length - 1];
    if (navigation && navigation.location && locationsAreEqual(navigation.location, location)) {
      focus(navigation.targets);
    } else {
      navigateBack(location, focus);
    }
  } else {
    navigationTrail.push({
      location,
      targets: [],
    });
  }
};

/**
 * Legger til HTMLElement i navigationTrail
 * @param location - Location objekt som legges til i navigationTrail
 * @param navigationType - 'PUSH' 'POP' eller 'REPLACE'
 * @param focus - callback function med HTMLElement (target) som argument
 */
export const navigate = (location: Location, navigationType: NavigationType, focus: (targets: HTMLElement[]) => void): Navigation[] => {
  switch (navigationType) {
    case 'PUSH':
      navigationTrail.push({
        location,
        targets: [],
      });
      break;
    case 'POP':
      navigateBack(location, focus);
      break;
    case 'REPLACE':
      if (navigationTrail.length > 0) {
        navigationTrail[navigationTrail.length - 1] = {
          location,
          targets: [],
        };
      }
      break;
    default:
  }
  return navigationTrail;
};

/**
 * Legger til HTMLElement i navigationTrail
 * @param target - HTMLElement som legges til
 */
export const navigateAdd = (target: HTMLElement): Navigation[] | void => {
  if (target && !!target.focus) {
    if (navigationTrail.length > 0) {
      navigationTrail[navigationTrail.length - 1].targets.push(target);
      return navigationTrail;
    }
  }
};

/**
 * Oppdaterer history objektet
 */
export const goBackOrUp = (navigate: NavigateFunction, length = 1): void => {
  if (navigationTrail.length > 0) {
    navigate(-length);
  } else {
    navigate('/', { replace: true });
  }
};
