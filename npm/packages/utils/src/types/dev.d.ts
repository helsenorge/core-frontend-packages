// Types for various development options.
// A global boolean that turns on or off devmode in the client.
declare let __DEV__: boolean;

// A hack for the Redux DevTools Chrome extension.
export interface Window {
  devToolsExtension?: () => Function;
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: (options: Object) => Function;
  Res?: any;
  opera?: any;
  HTMLElement?: any;
  chrome?: any;
  Perf?: any;
  HN?: any;
}

declare var System: System;
export interface System {
  import(moduleName: string, normalizedParentName?: string): Promise<any>;
  import<TModule>(moduleName: string, normalizedParentName?: string): Promise<TModule>;
}

// makes it possible for typescript to understand import of .scss files
declare module '*.scss' {
  const styles: { [className: string]: string };
  export default styles;
}

// webpack-hot-loader sets some extra attributes on node's `module`if that
// module has been hot-loaded in the browser.
export interface NodeModule {
  hot?: { accept: Function };
}
