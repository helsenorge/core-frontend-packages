import * as React from 'react';
import { Component, ComponentClass } from 'react';

export interface Props {
  mount?: () => void;
}

export default function mount<T>(WrappedComponent: ComponentClass<T & Props> | React.FC<T & Props>): ComponentClass<T & Props> {
  const componentName: string = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  class Mount extends Component<T & Props, {}> {
    componentDidMount(): void {
      const mount = (this.props as Props).mount;
      if (mount) {
        mount();
      }
    }

    render(): React.JSX.Element {
      return <WrappedComponent {...this.props} />;
    }
  }

  (Mount as ComponentClass<T & Props>).displayName = `Mount(${componentName})`;
  return Mount;
}
