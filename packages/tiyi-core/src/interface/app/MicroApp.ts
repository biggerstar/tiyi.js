// noinspection JSUnusedGlobalSymbols


import {MicroAppPlugin, PluginManager} from "@/interface";

export class MicroApp extends PluginManager<MicroApp, MicroAppPlugin> {
  //@ts-ignore
  readonly _isMicroApp_: boolean

  constructor() {
    super();
    Object.defineProperty(<object>this, '_isMicroApp_', {  /*强制定义不可修改*/  value: true, configurable: false})
  }
}
