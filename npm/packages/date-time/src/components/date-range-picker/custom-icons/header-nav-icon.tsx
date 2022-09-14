import * as React from 'react';

import Icon from '@helsenorge/designsystem-react/components/Icons';
import ChevronLeft from '@helsenorge/designsystem-react/components/Icons/ChevronLeft';
import ChevronRight from '@helsenorge/designsystem-react/components/Icons/ChevronRight';

import { useHover } from '@helsenorge/designsystem-react';
import { theme } from '@helsenorge/designsystem-react';

const HeaderNavIcon: React.FC<{
  direction: 'prev' | 'next';
  className?: string;
  isDisabled?: boolean;
}> = ({ direction, className, isDisabled }) => {
  const { hoverRef, isHovered } = useHover<HTMLSpanElement>(undefined);

  const directionClassNames =
    direction === 'prev' ? 'DayPickerNavigation_leftButton__horizontalDefault' : 'DayPickerNavigation_rightButton__horizontalDefault';

  const handlePropagation = (event: React.MouseEvent | React.KeyboardEvent) => {
    if (isDisabled) {
      event.stopPropagation();
    }
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <span
      onKeyDown={handlePropagation}
      onClick={handlePropagation}
      tabIndex={isDisabled ? -1 : 0}
      ref={hoverRef}
      className={`${directionClassNames} ${className}`}
    >
      <Icon
        size={36}
        color={isDisabled ? theme.palette.neutral300 : theme.palette.blueberry600}
        svgIcon={direction === 'prev' ? ChevronLeft : ChevronRight}
        isHovered={isDisabled ? false : isHovered}
      />
    </span>
  );
};

export default HeaderNavIcon;
