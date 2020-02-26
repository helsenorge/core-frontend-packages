import keyCode from "./key-code";
import tabbable from "tabbable";

export class TrapFocus {
  private domNode: TabbableElement | null;
  private previouslyFocusedItem: TabbableElement | null;
  private focusableItems: Array<TabbableElement>;

  constructor(domNode: HTMLElement | string) {
    this.domNode =
      typeof domNode === "string"
        ? (document.querySelector(domNode) as TabbableElement)
        : (domNode as TabbableElement);
    this.previouslyFocusedItem = document.activeElement as TabbableElement;

    // Get focusable elements
    this.updateFocusableItems();

    // Set focus to element to be able to listen for keypress
    if (this.focusableItems.length) {
      this.focusableItems[0].focus();
    }
    window.addEventListener("keydown", this, false);
  }

  deactivate(): void {
    window.removeEventListener("keydown", this, false);
    this.focusableItems = [];
    this.domNode = null;
    if (this.previouslyFocusedItem && this.previouslyFocusedItem.focus) {
      this.previouslyFocusedItem.focus();
    }
  }

  handleEvent(e: KeyboardEvent): TabbableElement | null {
    if (e.keyCode !== keyCode.TAB) {
      return null;
    }
    e.stopPropagation();
    e.preventDefault();
    this.updateFocusableItems();
    const currentFocusIndex: number = this.getItemIndex(
      e.target as TabbableElement
    );

    // Element focused not in list, return the first focusable element
    if (currentFocusIndex === -1) {
      return this.focusableItems[0];
    }
    if (e.shiftKey) {
      this.previousFocusableItem(e.target as TabbableElement).focus();
    } else {
      this.nexFocusableItem(e.target as TabbableElement).focus();
    }
    return null;
  }

  updateFocusableItems(): void {
    if (this.domNode) {
      this.focusableItems = tabbable(this.domNode) as Array<TabbableElement>;
    }
  }

  previousFocusableItem(itemWithFocus: TabbableElement): TabbableElement {
    const currentFocusIndex: number = this.getItemIndex(itemWithFocus);
    if (!this.isRadioButton(itemWithFocus)) {
      let previousFocusIndex: number = currentFocusIndex - 1;
      // Wrap around
      if (previousFocusIndex < 0) {
        previousFocusIndex = this.focusableItems.length - 1;
      }
      return this.getSelectedRadioInGroup(
        this.focusableItems[previousFocusIndex]
      );
    }
    return this.previousFocusableRadioButton(itemWithFocus);
  }

  previousFocusableRadioButton(
    itemWithFocus: TabbableElement
  ): TabbableElement {
    const currentFocusIndex: number = this.getItemIndex(itemWithFocus);
    // Previous focusable item should not be a radio button in same group
    for (let i: number = currentFocusIndex; i >= 0; i--) {
      const previousElement: TabbableElement = this.focusableItems[i];
      if (!this.isRadioButton(previousElement)) {
        return previousElement;
      }
      // Element is a radio button, but not in same group
      if (previousElement.name !== itemWithFocus.name) {
        return this.getSelectedRadioInGroup(previousElement);
      }
    }
    // All the previous items are in the same radio group, start from end
    for (
      let i: number = this.focusableItems.length - 1;
      i > currentFocusIndex;
      i--
    ) {
      const previousElement: TabbableElement = this.focusableItems[i];
      if (!this.isRadioButton(previousElement)) {
        return previousElement;
      }
      // Element is a radio button, but not in same group
      if (previousElement.name !== itemWithFocus.name) {
        return this.getSelectedRadioInGroup(previousElement);
      }
    }
    // Still no element found: we have only radio buttons in the same group
    return this.getSelectedRadioInGroup(itemWithFocus);
  }

  nexFocusableItem(itemWithFocus: TabbableElement): TabbableElement {
    const currentFocusIndex: number = this.getItemIndex(itemWithFocus);
    if (!this.isRadioButton(itemWithFocus)) {
      let nextFocusIndex: number = currentFocusIndex + 1;
      // Wrap around
      if (nextFocusIndex > this.focusableItems.length - 1) {
        nextFocusIndex = 0;
      }
      return this.getSelectedRadioInGroup(this.focusableItems[nextFocusIndex]);
    }
    return this.nextFocusableRadioButton(itemWithFocus);
  }

  nextFocusableRadioButton(itemWithFocus: TabbableElement): TabbableElement {
    const currentFocusIndex: number = this.getItemIndex(itemWithFocus);
    // Next focusable item should not be a radio button in same group
    for (
      let i: number = currentFocusIndex + 1;
      i < this.focusableItems.length;
      i++
    ) {
      const nextElement: TabbableElement = this.focusableItems[i];
      if (!this.isRadioButton(nextElement)) {
        return nextElement;
      }
      // Element is a radio button, but not in same group
      if (nextElement.name !== itemWithFocus.name) {
        return this.getSelectedRadioInGroup(nextElement);
      }
    }
    // All the next items are in the same radio group, start from beginning
    for (let i = 0; i < currentFocusIndex; i++) {
      const nextElement: TabbableElement = this.focusableItems[i];
      if (!this.isRadioButton(nextElement)) {
        return nextElement;
      }
      // Element is a radio button, but not in same group
      if (nextElement.name !== itemWithFocus.name) {
        return this.getSelectedRadioInGroup(nextElement);
      }
    }
    // Still no element found: we have only radio buttons in the same group
    return this.getSelectedRadioInGroup(itemWithFocus);
  }

  // If user tabbed into a radio group, we need to focus the selected radio button in the group
  getSelectedRadioInGroup(item: TabbableElement): TabbableElement {
    if (!this.isRadioButton(item)) {
      return item;
    }

    const currentFocusIndex: number = this.getItemIndex(item);
    const radioGrouItems: TabbableElement[] = [];
    let i: number;
    for (i = currentFocusIndex; i < this.focusableItems.length; i++) {
      if (this.focusableItems[i].name === item.name) {
        radioGrouItems.push(this.focusableItems[i]);
      } else {
        break; // Element is not in radio group, no need to continue loop
      }
    }
    for (i = currentFocusIndex - 1; i >= 0; i--) {
      if (this.focusableItems[i].name === item.name) {
        radioGrouItems.push(this.focusableItems[i]);
      } else {
        break; // Element is not in radio group, no need to continue loop
      }
    }

    const selectedItems: TabbableElement[] = radioGrouItems.filter(
      i => i.checked
    );
    if (selectedItems.length === 0) {
      return item; // No element in this group is selected
    }
    return selectedItems[0];
  }

  getItemIndex(item: TabbableElement): number {
    return this.focusableItems.indexOf(item);
  }

  isRadioButton(element: TabbableElement): boolean {
    return element.type === "radio";
  }
}

export default TrapFocus;
