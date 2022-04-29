import * as React from 'react';

import classNames from 'classnames';
import './styles.scss';

interface SvgIconPropsInterface {
  children: JSX.Element | Array<JSX.Element>;
  component?: React.ReactType;
  stroked?: boolean;
  viewBox?: string;
}

export interface SvgIconProps
  extends Pick<React.SVGAttributes<SVGElement>, Exclude<keyof React.SVGAttributes<SVGElement>, keyof SvgIconPropsInterface>>,
    React.RefAttributes<SVGElement> {
  color?: string;
  className?: string;
  fontSize?: string | number;
  size?: 'small' | 'large' | 'inherit';
  title?: string;
  style?: React.CSSProperties;
  variant?: 'success' | 'warning' | 'error' | 'disabled';
  tabIndex?: number;
}

function SvgIcon(props: SvgIconProps & SvgIconPropsInterface) {
  const {
    children,
    className,
    color = 'inherit',
    component: Component = 'svg',
    fontSize,
    size = 'default',
    stroked = false,
    style = {},
    title,
    variant = 'default',
    viewBox = '0 0 24 24',
    ...other
  } = props;

  return (
    <Component
      aria-hidden={!title}
      aria-label={title}
      className={classNames(
        'svgicon',
        {
          ['svgicon' + '--state-' + variant]: variant !== 'default',
          ['svgicon' + '--fontSize-' + size.toLowerCase()]: size.toLowerCase() !== 'default',
          ['svgicon' + '--stroked']: stroked,
        },
        className
      )}
      color={color}
      focusable={!title}
      role={title ? 'presentation' : 'img'}
      style={{ fontSize: fontSize, ...style }}
      tabIndex={title ? 0 : -1}
      viewBox={viewBox}
      {...other}
    >
      {children}
    </Component>
  );
}

export default React.memo(SvgIcon);
