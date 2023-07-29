// TODO 支持serviceWorker
import {MicroAppBuiltInPlugin} from "tiyi-core-yang";

let registration

export class ServiceWorker extends MicroAppBuiltInPlugin {
  public install() {
    this.registerServiceWorker("sw.js")
  }

  public registerServiceWorker = (url) => {
    // const navigator = this.window.navigator
    // console.log(window.navigator.serviceWorker);
    if ("serviceWorker" in navigator) {
      const urlInfo = new URL(url, location.origin)
      navigator.serviceWorker.getRegistrations().then(async (registrations) => {
        const found = registrations.find(worker => worker.active?.scriptURL === urlInfo.href)
        registration = found
        if (found) return  // 已经存在worker直接返回
        try {
          registration = await navigator.serviceWorker.register(urlInfo.href, {scope: "/",});
        } catch (error) {
          console.error(`注册失败：${error}`);
        }
      })
    }
  };
}






