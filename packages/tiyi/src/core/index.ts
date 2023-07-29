import {__TI_BROADCAST__, Broadcast, createCoreYang} from 'tiyi-core-yang'
import {createHistorySyncManager} from 'tiyi-core-history'
import {__tiyi__, TIYI} from "tiyi-core";

//-------------------------------------------
function installDefaultTiYiPlugins() {
  TIYI.use({
    name: __tiyi__,
    onReady() {
      TIYI.use(createCoreYang())
      TIYI.use(createHistorySyncManager(window))
    },
  })
}

installDefaultTiYiPlugins()


/** 拿到当前全局的广播对象并代理出去，[参数一不用空对象是为了控制台打印能看到对应函数]使用代理是因为在使用时一定是app已经存在包含window挂载的广播对象而不是一次性赋值 */
export const broadcast = new Proxy({
  $on: Function,
  $once: Function,
  $emit: Function,
  $off: Function,
  $offAll: Function
}, {
  get: (_: Record<any, any>, p: string) => window[__TI_BROADCAST__][(p as keyof Broadcast)]
})
export {}
