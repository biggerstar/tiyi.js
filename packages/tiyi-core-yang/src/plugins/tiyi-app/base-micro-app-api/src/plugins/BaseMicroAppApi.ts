import {getAppCache, MicroApp, TiEventTargetType, TiYiApp, TiYiPlugin} from "tiyi-core";
import {resetUrlHost} from "@/utils/common";
import {__ABOUT_BLANK__} from '@/constant'

/** 设置当前app的url获取接口 */
export class BaseMicroAppApi extends TiYiPlugin {
  public onCreateMicroApp(event: TiEventTargetType<TiYiApp, MicroApp>) {
    const app = <MicroApp>event.data
    let url = ''  // 主动设置的url，一般在刚开始或者没加载dom的时候使用
    Object.defineProperty(app, 'url', {
      get: () => {
        const appWindow = <WindowProxy>getAppCache(app.id, 'window')
        const locationURL = appWindow?.location?.href
        if (locationURL && locationURL.trim() !== __ABOUT_BLANK__) url = resetUrlHost(locationURL, url)
        return url
      },
      set(v: any) {
        url = v
      },
      enumerable: true,
      configurable: true
    })
  }
}
