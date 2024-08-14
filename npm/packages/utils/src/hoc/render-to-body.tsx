import * as React from 'react';

import * as ReactDOM from 'react-dom';

interface RenderToBodyProps {
  printable?: boolean;
  children: React.ReactNode;
}

/**
 * hoc-wrapper for å rendre direkte på dokument nivå
 * @prop printable for å rendre til body (istedenfor vanlig overlay div)
 */
class RenderToBody extends React.PureComponent<RenderToBodyProps, {}> {
  private overlayTarget: HTMLElement;

  constructor(props: RenderToBodyProps) {
    super(props);
    this.overlayTarget = document.createElement('div');
  }

  componentDidMount(): void {
    if (this.overlayTarget && !this.props.printable) {
      document.body.appendChild(this.overlayTarget);
    }
  }

  componentWillUnmount(): void {
    if (this.overlayTarget && !this.props.printable) {
      document.body.removeChild(this.overlayTarget);
    }
  }

  render(): React.JSX.Element {
    return ReactDOM.createPortal(this.props.children, this.props.printable ? document.body : this.overlayTarget);
  }
}

export default RenderToBody;
