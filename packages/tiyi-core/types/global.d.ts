// @ts-ignore
import {TiYiApp} from "tiyi-core";

//  @copy-start
declare module "tiyi-core" {
  export {}
}

declare global {
  interface Window {
    __TIYI__: TiYiApp;
    TIYI: TiYiApp;
    tiyi: TiYiApp;
  }
}
