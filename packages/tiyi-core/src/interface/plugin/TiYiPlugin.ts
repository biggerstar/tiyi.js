// noinspection JSUnusedGlobalSymbols


import {MicroApp, PluginEntry, TiYiApp} from "@/interface";
import {TiEventTargetType} from "types";

export class TiYiPlugin extends PluginEntry<TiYiPlugin> {
  /** TiYi主程序准备好调用， 在运行onCreateMicroApp之前会被调用 */
  public onReady?(event: TiEventTargetType<TiYiApp, MicroApp>): void
  /** 运行createMicroApp函数创建一个新app的时候会触发该事件 */
  public onCreateMicroApp?(event: TiEventTargetType<TiYiApp, MicroApp>): void

}
