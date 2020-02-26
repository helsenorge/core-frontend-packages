import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { trackUrlChange } from "./adobe-analytics";

class TrackRouteChange extends React.Component<RouteComponentProps<{}>, {}> {
  componentDidMount(): void {
    trackUrlChange(window.location.href, window.location.pathname);
    this.props.history.listen(() => {
      trackUrlChange(window.location.href, window.location.pathname);
    });
  }
  render() {
    return this.props.children;
  }
}

export default withRouter(TrackRouteChange);
