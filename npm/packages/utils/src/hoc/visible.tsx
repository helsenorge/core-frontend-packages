import * as React from 'react';
import * as ReactDOM from 'react-dom';

export interface VisibleState {
  visible?: boolean;
  loadMore?: () => void;
}

const visible: (COMPONENT: React.ComponentClass<VisibleState>) => React.ComponentClass<VisibleState> = function Visible(
  COMPONENT: React.ComponentClass<VisibleState>
): React.ComponentClass<VisibleState> {
  let RATE_LIMIT = 25;
  class VisibleComponent extends React.Component<{}, VisibleState> {
    _DOM_NODE: Element;
    _RCV_FN: boolean | EventListener | EventListenerObject;
    _RCV_LOCK: boolean;
    _RCV_SCHEDULE: boolean;
    _RCV_TIMEOUT: number | NodeJS.Timer;

    constructor(props: {}) {
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
      const domnode: Element = this._DOM_NODE;
      const gcs: CSSStyleDeclaration = window.getComputedStyle(domnode, 'false');
      const dims: ClientRect = domnode.getBoundingClientRect();
      const h: number = window.innerHeight;
      const w: number = window.innerWidth;
      const topVisible: boolean = 0 < dims.top && dims.top < h;
      const bottomVisible: boolean = 0 < dims.bottom && dims.bottom < h;
      const verticallyVisible: boolean = topVisible || bottomVisible;
      const leftVisible: boolean = 0 < dims.left && dims.left < w;
      const rightVisible: boolean = 0 < dims.right && dims.right < w;
      const horizontallyVisible: boolean = leftVisible || rightVisible;
      let visible: boolean = horizontallyVisible && verticallyVisible;

      if (visible) {
        const isDocHidden: boolean = document.hidden;
        const isElementNotDisplayed: boolean = gcs.getPropertyValue('display') === 'none';
        const elementHasZeroOpacity: boolean = gcs.getPropertyValue('opacity') === '0';
        const isElementHidden: boolean = gcs.getPropertyValue('visibility') === 'hidden';
        visible = visible && !(isDocHidden || isElementNotDisplayed || elementHasZeroOpacity || isElementHidden);
      }

      if (visible !== this.state.visible) {
        this.setState({ visible });
      }
    }

    enableVisbilityHandling(checkNow: boolean) {
      const info: Console = console;
      if (typeof window === 'undefined') {
        return info.error("This environment lacks 'window' support.");
      }

      if (typeof document === 'undefined') {
        return info.error("This environment lacks 'document' support.");
      }

      if (!this._DOM_NODE) {
        const node = ReactDOM.findDOMNode(this);
        if (node instanceof Element) {
          this._DOM_NODE = node;
        }
      }
      let domnode: Element = this._DOM_NODE;

      this._RCV_FN = () => {
        if (this._RCV_LOCK) {
          this._RCV_SCHEDULE = true;
          return;
        }
        this._RCV_LOCK = true;
        this.checkComponentVisibility();
        this._RCV_TIMEOUT = setTimeout(() => {
          this._RCV_LOCK = false;
          if (this._RCV_SCHEDULE) {
            this._RCV_SCHEDULE = false;
            this.checkComponentVisibility();
          }
        }, RATE_LIMIT);
      };

      while (domnode.nodeName !== 'BODY' && domnode.parentElement) {
        domnode = domnode.parentElement;
        domnode.addEventListener('scroll', this._RCV_FN as EventListener | EventListenerObject);
      }
      document.addEventListener('visibilitychange', this._RCV_FN as EventListener | EventListenerObject);
      document.addEventListener('scroll', this._RCV_FN as EventListener | EventListenerObject);
      window.addEventListener('resize', this._RCV_FN as EventListener | EventListenerObject);

      if (checkNow && typeof this._RCV_FN === 'function') {
        const rcvFn: () => void = this._RCV_FN as () => void;
        rcvFn();
      }
      return null;
    }

    disableVisbilityHandling(): void {
      clearTimeout(this._RCV_TIMEOUT as number);
      if (this._RCV_FN) {
        let domnode: Element = this._DOM_NODE;

        while (domnode.nodeName !== 'BODY' && domnode.parentElement) {
          domnode = domnode.parentElement;
          domnode.removeEventListener('scroll', this._RCV_FN as EventListener | EventListenerObject);
        }

        document.removeEventListener('visibilitychange', this._RCV_FN as EventListener | EventListenerObject);
        document.removeEventListener('scroll', this._RCV_FN as EventListener | EventListenerObject);
        window.removeEventListener('resize', this._RCV_FN as EventListener | EventListenerObject);

        this._RCV_FN = false;
      }
    }

    render(): JSX.Element {
      return <COMPONENT {...this.props} visible={this.state.visible} />;
    }
  }
  return VisibleComponent;
};
export default visible;
