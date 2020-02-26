import * as React from "react";

import { Spinner } from "../../components/atoms/spinner";
import visible, { VisibleState } from "../../higher-order-components/visible";

export class AdditionalLoadingSpinner extends React.Component<
  VisibleState,
  {}
> {
  UNSAFE_componentWillReceiveProps(newProps: VisibleState): void {
    if (newProps.visible && !this.props.visible) {
      if (this.props.loadMore) this.props.loadMore();
    }
  }

  render(): JSX.Element {
    return <Spinner inline transparent />;
  }
}

export const AdditionalLoading = visible(AdditionalLoadingSpinner);
