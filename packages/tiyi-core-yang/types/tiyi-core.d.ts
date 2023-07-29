/** 该做法参考vue-router 对declare module 实现,
 * 作用: 定义其他第三方库模块拓展，通过tail追加到dist/xxx.d.ts中 */
import {NodeProcessorForProcessOption, SetHrefOptions, TiHistoryOption} from "types";
// 上面这部分定义被分割掉不合并到.d.ts中的类型，目的只是为了在本文件不报错，而在.d.ts中会将上面切割的部分提供给该extension
//-----------------------------------------------
//  @copy-start
import {
  AnyRecord,
  EventBus,
  ExtractTiPluginEventInputName,
  GenPluginEntryType,
  MicroApp,
  MicroAppPlugin,
  TiEventTargetType,
  TiYiApp,
  TiYiPlugin
} from "tiyi-core"


declare module 'tiyi-core' {

  export interface TiYiApp {
    /** 添加一个插件。支持传入一个函数，或者一个普通js对象，或者一个js类(会被实例化成一个普通对象)，
     * 如果对象中或者函数本体上挂载的的静态对象中包含install函数，此时将会被调用,参数和返回如下(app,...config)=>void
     * */
    use(plugin: GenPluginEntryType<TiYiApp, TiYiPlugin>, ...pluginConfig: any[]): this;

    /** 执行钩子函数 */
    executeHook<Data = null>(name: ExtractTiPluginEventInputName<TiYiPlugin> | string, data?: Data extends null ? any : Data): TiEventTargetType<this, Data>
  }

  export interface MicroApp {
    /** 详见TiYiApp接口定义说明 */
    use(plugin: GenPluginEntryType<MicroApp, MicroAppPlugin>, ...pluginConfig: any[]): this;

    /** 详见TiYiApp接口定义说明 */
    executeHook<Data = null>(name: ExtractTiPluginEventInputName<MicroAppPlugin> | string, data?: Data extends null ? any : Data): TiEventTargetType<this, Data>;

  }

  export interface TiYiApp {
    /**  所有当前运行的app */
    apps: Record<string, MicroApp>;
    /** 对TiYi框架的配置，以便于框架插件中获取到相关配置并执行插件的相关逻辑 */
    config: object;
    /** 子应用的真实window */
    window: WindowProxy;
    /** 全局广播，在TiYiApp，MicroApp上都有挂载 */
    broadcast: EventBus
  }

  export interface MicroApp {
    readonly _mounted_: boolean;
    readonly baseURL: string;
    /** 全局广播，所有的app都共享同一个广播 */
    broadcast: EventBus;
    /** 对子应用的配置，以便于在子应用的插件中获取到相关配置并执行插件的相关逻辑 */
    config: object;

    /** 销毁子应用 TODO feat */
    destroy(): this;

    /** 将一段文本加载到子应用中，运行后会重置子应用到纯净环境，之后将文本载入 */
    doc(text: string): this;

    /** 子应用指定某个url,框架会自动加载该网页数据并渲染 */
    goto(url: string): this

    /** 外部直接手动加载html, 支持纯文本,普通函数,异步函数 */
    html: string | Function | ((args: any[]) => Promise<any>);
    /** 子应用唯一ID */
    readonly id: string;
    /** 为子应用伪造的location对象，该对象会被proxyWindow或者proxyDocument代理返回出去作为子应用运行环境中的location */
    location: Location & { setHref(url: string, option?: SetHrefOptions): void };
    /** 可读写，编写太乙阴插件时不能以mode作为判断而去限制一些能让子应用获取到父应用数据的方式是不安全的
     * 你可以在所有插件安装完成后使用Object.defineProperty的get直接定义你要限制的字段，对其限制获取
     * */
    mode: string | 'yang' | 'yin';

    /** 将子应用挂载到指定目标上，可以是一个网页元素或者一个css选择器  */
    mount(containerOrCssSelector: Element | string): this

    /** 内置，代理document */
    proxyDocument: Document;
    /** 内置，代理window */
    proxyWindow: WindowProxy;
    /** 子应用远程url */
    url: string;
  }

  export interface TiYiPlugin {
    /** 连接到微应用的时候触发 */
    onMicroAppConnect?(event: TiEventTargetType<TiYiApp, MicroApp>): void

    /** 微应用销毁的时候触发  */

    onMicroAppDestroy?(event: TiEventTargetType<TiYiApp, MicroApp>): void

    /** 浏览器前进的时候触发  */
    onMicroAppForward?(event: TiEventTargetType<TiYiApp, MicroApp>): void

    /** 浏览器后退的时候触发  */
    onMicroAppBack?(event: TiEventTargetType<TiYiApp, MicroApp>): void

  }

  /** 每个内置监听的函数都会返回一个事件对象 */
  export interface MicroAppPlugin {
    /** iframe元素加载到网页节点之前运行，此时框架还未操作dom，运行时机在mount操作后该事件立马被触发  */
    onInstall?(event?: TiEventTargetType<MicroApp>): void;

    /** iframe元素成功加载到网页节点之后运行，此时已经能获取到iframe元素和iframe中的window  */
    onInstalled?(event?: TiEventTargetType<MicroApp>): void;

    /** 监听app.goto 函数运行和其前往的新地址，如果要修改到新地址可以在回调函数中修改app.url就行,
     *  此时能获取到子应用的window，但是不能获得最新document(之前的文档已被销毁)
     *  */
    onGoto?(event?: TiEventTargetType<MicroApp, string>): void;

    /**
     * 监听app.doc 函数运行和其前往的新地址，能获取到子应用的window，但是不能获得最新document
     *  */
    onDoc?(event?: TiEventTargetType<MicroApp, string>): void;

    /** 子应用的连接事件，一般是运行app.doc或者app.goto函数后连接到子应用window中触发，能获取到最新的window或者document  */
    onConnect?(event?: TiEventTargetType<MicroApp>): void;

    /** 加载文本或者html到子应用中  */
    onLoadHTML?(event?: TiEventTargetType<MicroApp, string>): void;

    /** 设置url，支持短路径加载，比如 /aa/bb 或者 #hash 直接改变锚点，
     * 该函数遵循location.href一致的规则，部分条件下会触发popstate和hashchange事件
     * 主要逻辑是:
     * 1.url没hash前往该地址(和goto效果一致)；
     * 2.url有hash则且当前url和之前一样只改变hash和跳转对应锚点
     * */
    onNodeScheduler?(event?: TiEventTargetType<MicroApp, NodeProcessorForProcessOption>): void;

    onLoad?(event?: TiEventTargetType<MicroApp>): void;

    /** TODO */
    obBeforeDestroy?(event?: TiEventTargetType<MicroApp>): void;

    onDestroyed?(event?: TiEventTargetType<MicroApp>): void;

    /** 子应用调用history.pushState触发  */
    onPushState?(event?: TiEventTargetType<MicroApp, TiHistoryOption>): void;

    /** 子应用调用history.replaceState触发  */
    onReplaceState?(event?: TiEventTargetType<MicroApp, TiHistoryOption>): void;

  }


  /** 覆盖重定向 tiyi-core上的 createMicroApp 声明定义 */
  export function createMicroApp(): MicroApp

  export const TIYI: TiYiApp & AnyRecord

}
