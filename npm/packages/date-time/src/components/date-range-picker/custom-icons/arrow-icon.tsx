import * as React from 'react';

import Icon from '@helsenorge/designsystem-react/components/Icon';
import ArrowRight from '@helsenorge/designsystem-react/components/Icons/ArrowRight';

const ArrowIcon: React.FC<{
  className?: string;
}> = ({ className }) => {
  return (
    <span>
      <Icon className={className} size={36} color="black" svgIcon={ArrowRight} />
    </span>
  );
};

export default ArrowIcon;
