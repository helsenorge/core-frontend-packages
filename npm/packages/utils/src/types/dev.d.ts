/// <reference types="./_variables.scss.d" />

// Types for various development options.
// A global boolean that turns on or off devmode in the client.
declare let __DEV__: boolean;

import { Window as ToolkitWindow } from "./dev";

interface Window extends ToolkitWindow {}

// makes it possible for typescript to understand import of .scss files
declare module "*.scss";
