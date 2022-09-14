import { FocusableElement, tabbable } from 'tabbable';

export interface TabbableContentWithTabIndexes {
  tabbableElements: FocusableElement[];
  previousTabIndexes: Array<number | null>;
}

/**
 * Goes through an HTML element, and returns all its tabable elements with their current tabindex attribute
 * @param element: container which tabbbale goes through
 */
export const setTabIndex = (element: HTMLElement): TabbableContentWithTabIndexes => {
  const newPrevTabIndexes: Array<number | null> = [];
  const updatedTabbableElements: FocusableElement[] = tabbable(element);
  updatedTabbableElements.forEach(el => {
    if (el.hasAttribute('tabindex')) {
      newPrevTabIndexes.push(el.tabIndex);
    } else {
      newPrevTabIndexes.push(null);
    }
    el.tabIndex = -1;
  });
  return {
    tabbableElements: updatedTabbableElements,
    previousTabIndexes: newPrevTabIndexes,
  };
};

/**
 * Resets tabIndex to its previous value so the expanded content is reachable again
 * @param tabbableElements: The array of tabbable Elements to reset
 * @param previousTabIndexes: The previous tabindex values to set back
 */
export const resetTabIndex = (tabbableElements: FocusableElement[], previousTabIndexes: Array<number | null>): FocusableElement[] => {
  const updatedTabbableElements: FocusableElement[] = tabbableElements;
  if (!tabbableElements || tabbableElements.length < 1) {
    return [];
  }
  updatedTabbableElements.forEach((el, i) => {
    const currentTabIndex = previousTabIndexes[i];
    if (currentTabIndex !== null) {
      el.tabIndex = currentTabIndex;
    } else {
      el.removeAttribute('tabindex');
    }
  });
  return updatedTabbableElements;
};
