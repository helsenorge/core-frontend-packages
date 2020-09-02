import * as React from 'react';
import LayoutUtils from '../layout';

export interface State {
  nullToXs?: boolean;
  xsToSm?: boolean;
  smToMd?: boolean;
  mdToLg?: boolean;
  lgToXl?: boolean;
}

export interface Props {
  nullToXs?: boolean;
  xsToSm?: boolean;
  smToMd?: boolean;
  mdToLg?: boolean;
  lgToXl?: boolean;
}

export default function layoutChange<T>(COMPONENT: React.ComponentClass<T & Props> | React.FC<T & Props>): React.ComponentClass<T> {
  class LayoutChangeComponent extends React.Component<T, State> {
    constructor(props: T) {
      super(props);
      this.state = {
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

    updateState(): void {
      this.setState({
        nullToXs: LayoutUtils.isNullToXs(),
        xsToSm: LayoutUtils.isXsToSm(),
        smToMd: LayoutUtils.isSmToMd(),
        mdToLg: LayoutUtils.isMdToLg(),
        lgToXl: LayoutUtils.isLgToXl(),
      });
    }

    render(): JSX.Element {
      return (
        <COMPONENT
          {...this.props}
          nullToXs={this.state.nullToXs}
          xsToSm={this.state.xsToSm}
          smToMd={this.state.smToMd}
          mdToLg={this.state.mdToLg}
          lgToXl={this.state.lgToXl}
        />
      );
    }
  }
  return LayoutChangeComponent;
}
