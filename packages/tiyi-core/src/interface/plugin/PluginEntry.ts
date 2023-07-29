// noinspection JSUnusedGlobalSymbols

export class PluginEntry<App> /* 外部继承的时候将自身插件实例通过泛型传入 */ {
  [key: string]: any;

  /** 插件名称 */
  public name?: string;
  /** 所有插件默认优先级为0 */
  public priority?: number;
  /** 插件版本 */
  public version?: string;

  /** 插件入口函数， */
  install?(app?: App, ...args: any[]): void

  constructor() {
    this.priority = 0
  }
}
