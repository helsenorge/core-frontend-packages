import * as React from "react";
import { Component, ComponentClass } from "react";
export interface Props {
  mount?: () => void;
}

export default function mount<T>(
  WrappedComponent: ComponentClass<T & Props> | React.SFC<T & Props>
): ComponentClass<T & Props> {
  const componentName: string =
    WrappedComponent.displayName || WrappedComponent.name || "Component";
  class Mount extends Component<T & Props, {}> {
    componentDidMount(): void {
      const mount = (this.props as Props).mount;
      if (mount) {
        mount();
      }
    }

    render(): JSX.Element {
      return <WrappedComponent {...(this.props as T)} />;
    }
  }

  (Mount as ComponentClass<{}>).displayName = `Mount(${componentName})`;
  return Mount;
}
