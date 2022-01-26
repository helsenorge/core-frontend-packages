import * as React from 'react';

import Icon from '@helsenorge/designsystem-react/components/Icons';
import Calendar from '@helsenorge/designsystem-react/components/Icons/Calendar';

import { useHover } from '@helsenorge/designsystem-react';

const InputIcon: React.FC<{
  onClick: (e?: React.MouseEvent<{}>) => void;
  className?: string;
}> = ({ onClick, className }) => {
  const { hoverRef, isHovered } = useHover<HTMLSpanElement>(undefined);

  return (
    <span ref={hoverRef} onClick={onClick}>
      <Icon className={className} size={36} color="black" svgIcon={Calendar} isHovered={isHovered} />
    </span>
  );
};

export default InputIcon;
