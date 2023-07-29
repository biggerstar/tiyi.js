//  @copy-start

import {MicroApp} from "tiyi-core";
import {Broadcast} from "../dist/tiyi-core-yang";

declare global {
  export interface Window {
    __TI_APP__: MicroApp;
    __TI_BROADCAST__: Broadcast;
  }
}
