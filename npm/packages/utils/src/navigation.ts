import { History, Location, Action } from 'history';

interface Navigation {
  location: Location | undefined;
  targets: HTMLElement[];
}

const navigationTrail: Navigation[] = [];

function navigateBack(location: Location, focus: (targets: HTMLElement[]) => void) {
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
}

function locationsAreEqual(a: Location, b: Location) {
  return a.hash === b.hash && a.key === b.key && a.pathname === b.pathname;
}

export function navigate(location: Location, action: Action, focus: (targets: HTMLElement[]) => void) {
  switch (action) {
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
}

export function navigateAdd(target: HTMLElement) {
  if (target && target.focus) {
    if (navigationTrail.length > 0) {
      navigationTrail[navigationTrail.length - 1].targets.push(target);
    }
  }
}

export function goBackOrUp(history: History, length = 1) {
  if (navigationTrail.length > 0) {
    history.go(-length);
  } else {
    history.replace('/');
  }
}
