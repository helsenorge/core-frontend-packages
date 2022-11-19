import * as React from 'react';

/**
 * Custom hook for klikk eller fokus utenfor et gitt element
 * @param ref Sjekker om det klikkes utenfor dette elementet
 * @param onClickOutside Callback-funksjon ved klikk utenfor elementet
 */
export default function clickOutside(
  ref: React.MutableRefObject<HTMLDivElement | null>,
  onClickOutside: () => void,
  disabled?: boolean,
  addFocusListener?: boolean
): void {
  const handleClickOrFocusOutside = (event: MouseEvent): void => {
    if (ref.current && !event.composedPath().includes(ref.current)) {
      onClickOutside();
    }
  };

  React.useEffect(() => {
    if (!disabled) {
      document.addEventListener('mousedown', handleClickOrFocusOutside);
      if (addFocusListener) document.addEventListener('focus', handleClickOrFocusOutside, true);
    }

    return (): void => {
      document.removeEventListener('mousedown', handleClickOrFocusOutside);
      if (addFocusListener) document.removeEventListener('focus', handleClickOrFocusOutside, true);
    };
  });
}
