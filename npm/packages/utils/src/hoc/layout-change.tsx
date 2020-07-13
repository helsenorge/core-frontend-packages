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

export interface Props {
  oneToTwoColumn?: boolean;
  twoToThreeColumn?: boolean;
  threeTwoFourColumn?: boolean;
  nullToXs?: boolean;
  xsToSm?: boolean;
  smToMd?: boolean;
  mdToLg?: boolean;
  lgToXl?: boolean;
}

export default function layoutChange<T>(COMPONENT: React.ComponentClass<T & Props> | React.FC<T & Props>): React.ComponentClass<T> {
  class LayoutChangeComponent extends React.Component<T, LayoutState> {
    constructor(props: T) {
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
      this.processResizeEvent = this.processResizeEvent.bind(this);
      this.processLayoutChangeEvent = this.processLayoutChangeEvent.bind(this);
      this.processOrientationEvent = this.processOrientationEvent.bind(this);
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

    processResizeEvent(): void {
      this.updateState();
    }

    processLayoutChangeEvent(): void {
      this.updateState();
    }

    processOrientationEvent(): void {
      this.updateState();
    }

    updateState(): void {
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
    }

    /* eslint-disable @typescript-eslint/no-explicit-any */
    render(): JSX.Element {
      return (
        <COMPONENT
          {...(this.props as any)}
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
    /* eslint-enable @typescript-eslint/no-explicit-any */
  }
  return LayoutChangeComponent;
}
