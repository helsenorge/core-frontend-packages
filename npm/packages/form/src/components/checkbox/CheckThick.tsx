import * as React from 'react';

import SvgIcon, { SvgIconProps } from './SvgIcon';

export default function Check(props: SvgIconProps) {
  return (
    <SvgIcon color="#000000" viewBox="0 0 512 512" {...props}>
      <path
        fill="inherit"
        d="M379.9,136c16-16,41.9-16,57.9,0s16,41.9,0,57.9L210.7,416.5L84.6,287.4c-16-15.3-16.5-40.7-1.2-56.7
        c0.4-0.4,0.8-0.8,1.2-1.2c16.3-16.3,43-16.3,59.4,0l68.3,71.2L379.9,136z"
      />
    </SvgIcon>
  );
}
