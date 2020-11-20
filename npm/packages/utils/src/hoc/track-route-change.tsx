import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { trackPageview } from '../adobe-analytics';

/**
 * hoc-wrapper for å tracke navigation med adobe-analytics - les mer på trackPageview  method
 */
class TrackRouteChange extends React.Component<RouteComponentProps<{}>, {}> {
  componentDidMount(): void {
    trackPageview();
    this.props.history.listen(() => {
      trackPageview();
    });
  }
  render() {
    return this.props.children;
  }
}

export default withRouter(TrackRouteChange);
