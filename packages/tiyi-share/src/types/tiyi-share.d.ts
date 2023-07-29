import {CssShareManager, DataShareManager, JsShareManager} from "../plugins/tiyi-app/share-center/src";


export interface TiYiAppInterface {  // 存在声明合并
  share: ShareCenterInterface

  getJsCache(name: string, field: string): any
}

export interface ShareInterface {
  /** 注册一个share管理器
   * @param name 管理器名字，对应外部传入share.xxx 字段,注册后该字段定义的数据会交给对应管理器
   * @param TargetManager  shareManager类(可选:继承ShareManager类)
   * */
  register(name: string, TargetManager): void,

  /** 分发传入要加载的share配置信息进行初始化
   * @param shareConfig
   * */
  load(shareConfig: ShareSetupOptions): void,

  /** 分发传入所有provide配置信息，将其分配到targetWindow
   * @param provideConfig
   * @param targetWindow
   * */
  provides(provideConfig: boolean | ProvideOptions, targetWindow: WindowProxy): void,
}

export interface ShareCenterInterface extends ShareInterface {
  /** 默认的几个资源管理器，都是继承了ShareManager类 */
  css: CssShareManager,
  js: JsShareManager,
  data: DataShareManager,
}

export type ProvideOptions = {
  /** 要启动加载的css资源名称，主应用和子应用都适用该规则，有提供主应用或子应用便进行加载  */
  css?: string[] | boolean;
  /** 要启动加载的js资源名称，主应用和子应用都适用该规则，有提供主应用或子应用便进行加载  */
  js?: string[] | boolean;
  data?: string[] | boolean,
}


export type ShareSetupOptions = {
  css?: Record<string, string | string[]>;
  js?: Record<string, string | JsShareSetupOptions>;
  data?: Record<string, any>,
}


export type PluginShareSetupOptions = {
  share?: ShareSetupOptions;
  provide?: ProvideOptions
}

export type JsShareSetupOptions = {
  url: string | string[];
  export: string[];
  type: string;
}

