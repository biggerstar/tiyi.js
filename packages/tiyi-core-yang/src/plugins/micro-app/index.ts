/** 该文件夹导入下的所有模块都是用于子应用的插件，
 * 只要继承MicroAppBuiltInPlugin相关的类，
 * 然后直接作为插件通过TIYI.use()进行安装便能自动安装到对应微应用上)
 * */

export * from "./set-default-config"
export * from "./sync-broadcast-api"
export * from "./document-manager"
export * from "./extract-prototype" // extractPrototype 要在 property之前，保证重定义原型获
export * from "./redefine-property"
export * from "./node-scheduler"   // nodeScheduler 要在 nodeProcessor之前，保证拦截到后面插件
export * from "./node-processors"
export * from './redirect-anchor-href'
export * from './add-history-hook'
export * from './sync-app-base-tag-url'
export * from './reset-hash-click-misalignment'
