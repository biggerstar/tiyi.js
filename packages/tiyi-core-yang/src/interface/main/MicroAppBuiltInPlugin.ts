import {getAppCache, isFunction, MicroApp, MicroAppPlugin, NoFoundValueError, TiEventTargetType} from "tiyi-core";


/** 外部继承了该类无需设置install函数,直接通过外部app.use进行安装，则会自动将该插件安装到微应用上 ，.
 * 且每次微应用调用goto或者doc前往新的地址，则所有应用与微应用的插件都会被重载
 * 必须继承MicroAppBuiltInPlugin类及其相关子类,只有继承的插件才会自动添加到缓存中,
 * 直接通过use添加的插件除非外部手动添加, 否则是不会被自动添加到缓存
 * */
export class MicroAppBuiltInPlugin extends MicroAppPlugin {
  /** 链接某个app并修改其环境 */
    //@ts-ignore
  public belongApp: MicroApp
  /** 某个app运行环境中真实的window */
    //@ts-ignore
  public window: WindowProxy

  public onConnect?(event?: TiEventTargetType<MicroApp>): void;

  /** 某个app运行环境中真实的document  */
  public get document(): Document {
    return this.window.document
  }

  constructor() {
    super()
    const onConnect = this.onConnect
    this.onConnect = (ev: TiEventTargetType<MicroApp>) => {
      const {target: app} = ev
      const {window} = getAppCache(app.id)
      if (!window) NoFoundValueError('创建插件时未找到微应用的window')
      this.window = window
      this.belongApp = app
      if (isFunction(onConnect)) {
        // @ts-ignore
        onConnect.call(this, ev)   // 执行子类函数
      }
    }
  }
}

