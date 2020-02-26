export default {
  on(
    el: Document | HTMLElement | Element,
    type: string,
    callback: (event?: MouseEvent | React.MouseEvent<{}>) => void
  ): void {
    if (el.addEventListener) {
      el.addEventListener(type, callback as EventListener);
    }
  },

  off(
    el: Document | HTMLElement | Element,
    type: string,
    callback: (event?: MouseEvent | React.MouseEvent<{}>) => void
  ): void {
    if (el.removeEventListener) {
      el.removeEventListener(type, callback as EventListener);
    }
  }
};
