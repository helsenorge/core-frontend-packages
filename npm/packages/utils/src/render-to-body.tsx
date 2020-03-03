import * as React from 'react';
import * as ReactDOM from 'react-dom';

interface RenderToBodyProps {
  printable?: boolean;
}

class RenderToBody extends React.PureComponent<RenderToBodyProps, {}> {
  private overlayTarget: HTMLElement;

  constructor(props: RenderToBodyProps) {
    super(props);
    this.overlayTarget = document.createElement('div');
  }

  componentDidMount() {
    if (this.overlayTarget && !this.props.printable) {
      document.body.appendChild(this.overlayTarget);
    }
  }

  componentWillUnmount() {
    if (this.overlayTarget && !this.props.printable) {
      document.body.removeChild(this.overlayTarget);
    }
  }

  render() {
    return ReactDOM.createPortal(this.props.children, this.props.printable ? document.body : this.overlayTarget);
  }
}

export default RenderToBody;
