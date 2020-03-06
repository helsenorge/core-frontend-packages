import * as React from 'react';
import ReactDOM from 'react-dom';

/** becomeVisibleOnScrollPassed - for component to become visible when its position
 * is above the visible viewport of the browser, may happen when element has been scrolled past
 */

export interface VisibleComponentStates {
  visible?: boolean;
}

export interface HOCComponentProps {
  visible?: boolean;
}

export interface VisibleComponentProps {
  visible?: boolean;
}

export default function BecameVisible<T extends HOCComponentProps = HOCComponentProps>(
  WrappedComponent: React.ComponentClass<T>,
  becomeVisibleOnScrollPassed?: boolean
) {
  let RATE_LIMIT = 25;

  return class VisibleComponent extends React.Component<T, VisibleComponentStates> {
    domNode: Element;
    rcvFn?: () => void;
    rcvLock: Element | boolean;
    rcvTimeout: ReturnType<typeof setTimeout>;
    rcvSchedule: boolean;

    constructor(props: T) {
      super(props);
      this.state = {
        visible: false,
      };
      this.checkComponentVisibility = this.checkComponentVisibility.bind(this);
      this.enableVisbilityHandling = this.enableVisbilityHandling.bind(this);
      this.disableVisbilityHandling = this.disableVisbilityHandling.bind(this);
    }

    componentDidMount(): void {
      this.enableVisbilityHandling(true);
    }

    componentWillUnmount(): void {
      this.disableVisbilityHandling();
    }

    setComponentVisbilityRateLimit(milliseconds: number): void {
      RATE_LIMIT = milliseconds;
    }

    checkComponentVisibility(): void {
      const domnode: Element = this.domNode;
      const gcs: CSSStyleDeclaration = window.getComputedStyle(domnode, 'false');
      const dims: ClientRect = domnode.getBoundingClientRect();
      const h: number = window.innerHeight;
      const w: number = window.innerWidth;
      const topVisible = (0 < dims.top || becomeVisibleOnScrollPassed) && dims.top < h;
      const bottomVisible = (0 < dims.bottom || becomeVisibleOnScrollPassed) && dims.bottom < h;
      const verticallyVisible = topVisible || bottomVisible;
      const leftVisible = (0 < dims.left || becomeVisibleOnScrollPassed) && dims.left < w;
      const rightVisible = (0 < dims.right || becomeVisibleOnScrollPassed) && dims.right < w;
      const horizontallyVisible = leftVisible || rightVisible;
      let visible = horizontallyVisible && verticallyVisible;

      if (visible) {
        const isDocHidden: boolean = document.hidden;
        const isElementNotDisplayed: boolean = gcs.getPropertyValue('display') === 'none';
        const elementHasZeroOpacity: boolean = gcs.getPropertyValue('opacity') === '0';
        const isElementHidden: boolean = gcs.getPropertyValue('visibility') === 'hidden';
        visible = visible && !(isDocHidden || isElementNotDisplayed || elementHasZeroOpacity || isElementHidden);
      }

      if (visible !== this.state.visible) {
        this.setState({ visible: true });
        this.disableVisbilityHandling();
      }
    }

    enableVisbilityHandling(checkNow: boolean) {
      const info = console;
      if (typeof window === 'undefined') {
        return info.error("This environment lacks 'window' support.");
      }

      if (typeof document === 'undefined') {
        return info.error("This environment lacks 'document' support.");
      }

      if (!this.domNode) {
        const node = ReactDOM.findDOMNode(this);
        if (node instanceof Element) {
          this.domNode = node;
        }
      }
      let domnode: Element = this.domNode;

      this.rcvFn = () => {
        if (this.rcvLock) {
          this.rcvSchedule = true;
          return;
        }
        this.rcvLock = true;
        this.checkComponentVisibility();
        this.rcvTimeout = setTimeout(() => {
          this.rcvLock = false;
          if (this.rcvSchedule) {
            this.rcvSchedule = false;
            this.checkComponentVisibility();
          }
        }, RATE_LIMIT);
      };

      while (domnode.nodeName !== 'BODY' && domnode.parentElement) {
        domnode = domnode.parentElement;
        domnode.addEventListener('scroll', this.rcvFn);
      }
      document.addEventListener('visibilitychange', this.rcvFn);
      document.addEventListener('scroll', this.rcvFn);
      window.addEventListener('resize', this.rcvFn);

      if (checkNow) {
        this.rcvFn();
      }
      return null;
    }

    disableVisbilityHandling(): void {
      clearTimeout(this.rcvTimeout);
      if (this.rcvFn) {
        let domnode: Element = this.domNode;

        while (domnode.nodeName !== 'BODY' && domnode.parentElement) {
          domnode = domnode.parentElement;
          domnode.removeEventListener('scroll', this.rcvFn);
        }

        document.removeEventListener('visibilitychange', this.rcvFn);
        document.removeEventListener('scroll', this.rcvFn);
        window.removeEventListener('resize', this.rcvFn);
        this.rcvFn = undefined;
      }
    }

    public render() {
      return <WrappedComponent {...(this.props as T)} visible={this.state.visible} />;
    }
  };
}
