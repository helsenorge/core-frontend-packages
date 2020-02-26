/*
 * Get z-index of <title> element.
 * This is the same as defined in _variables.scss
 * 1: $one-col
 * 2: $one-to-two-col
 * 3: $two-to-three-col
 * 4: $three-to-four-col
 */

export function getColumns(): number {
  const titleElement: HTMLTitleElement = document.getElementsByTagName(
    "title"
  )[0];
  if (titleElement && document.defaultView) {
    const zIndex: string = document.defaultView
      .getComputedStyle(titleElement, undefined)
      .getPropertyValue("z-index");
    return parseInt(zIndex, 10);
  }

  return 4;
}
