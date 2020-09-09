/*  This file has been converted to TypeScript
 When making changes to this file please make them
 in the file with a .ts or .tsx extension located in
 the Common/src/toolkit folder structure
 Then run the command "npm run build-toolkit" to generate the jsx file
 Please check both files into TFS */

import * as React from 'react';
import LayoutUtils from '../layout';

export interface LayoutState {
  oneToTwoColumn?: boolean;
  twoToThreeColumn?: boolean;
  threeTwoFourColumn?: boolean;
  nullToXs?: boolean;
  xsToSm?: boolean;
  smToMd?: boolean;
  mdToLg?: boolean;
  lgToXl?: boolean;
}

export interface OriginalProps {
  oneToTwoColumn?: boolean;
  twoToThreeColumn?: boolean;
  threeTwoFourColumn?: boolean;
  nullToXs?: boolean;
  xsToSm?: boolean;
  smToMd?: boolean;
  mdToLg?: boolean;
  lgToXl?: boolean;
}

export default function layoutChange<T extends React.Component, OriginalProps>(
  COMPONENT: React.ComponentClass<OriginalProps & { ref?: React.RefObject<T> }> | React.FC<OriginalProps & { ref?: React.RefObject<T> }>
): React.ForwardRefExoticComponent<React.PropsWithoutRef<OriginalProps> & React.RefAttributes<T>> {
  type PrivateProps = { forwardedRef: React.RefObject<T> };
  type Props = OriginalProps & PrivateProps;
  class LayoutChangeComponent extends React.Component<Props, LayoutState> {
    constructor(props: Props) {
      super(props);
      this.state = {
        oneToTwoColumn: LayoutUtils.isOneToTwoColumn(),
        twoToThreeColumn: LayoutUtils.isTwoToThreeColumn(),
        threeTwoFourColumn: LayoutUtils.isThreeTwoFourColumn(),
        nullToXs: LayoutUtils.isNullToXs(),
        xsToSm: LayoutUtils.isXsToSm(),
        smToMd: LayoutUtils.isSmToMd(),
        mdToLg: LayoutUtils.isMdToLg(),
        lgToXl: LayoutUtils.isLgToXl(),
      };
    }

    componentDidMount(): void {
      window.addEventListener('layoutchange', this.processLayoutChangeEvent);
      window.addEventListener('resize', this.processResizeEvent);
      window.addEventListener('orientationchange', this.processOrientationEvent);
    }

    componentWillUnmount(): void {
      window.removeEventListener('layoutchange', this.processLayoutChangeEvent);
      window.removeEventListener('resize', this.processResizeEvent);
      window.removeEventListener('orientationchange', this.processOrientationEvent);
    }

    processResizeEvent = (): void => {
      this.updateState();
    };

    processLayoutChangeEvent = (): void => {
      this.updateState();
    };

    processOrientationEvent = (): void => {
      this.updateState();
    };

    updateState = (): void => {
      this.setState({
        oneToTwoColumn: LayoutUtils.isOneToTwoColumn(),
        twoToThreeColumn: LayoutUtils.isTwoToThreeColumn(),
        threeTwoFourColumn: LayoutUtils.isThreeTwoFourColumn(),
        nullToXs: LayoutUtils.isNullToXs(),
        xsToSm: LayoutUtils.isXsToSm(),
        smToMd: LayoutUtils.isSmToMd(),
        mdToLg: LayoutUtils.isMdToLg(),
        lgToXl: LayoutUtils.isLgToXl(),
      });
    };

    render(): JSX.Element {
      const { forwardedRef, ...originalProps } = this.props;

      return (
        <COMPONENT
          ref={forwardedRef}
          {...(originalProps as OriginalProps)}
          oneToTwoColumn={this.state.oneToTwoColumn}
          twoToThreeColumn={this.state.twoToThreeColumn}
          threeTwoFourColumn={this.state.threeTwoFourColumn}
          nullToXs={this.state.nullToXs}
          xsToSm={this.state.xsToSm}
          smToMd={this.state.smToMd}
          mdToLg={this.state.mdToLg}
          lgToXl={this.state.lgToXl}
        />
      );
    }
  }

  const RefForwardingFactory = (props: OriginalProps, ref: React.RefObject<T>) => <LayoutChangeComponent {...props} forwardedRef={ref} />;

  return React.forwardRef(RefForwardingFactory);
}
