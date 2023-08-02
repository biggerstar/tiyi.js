import {MicroAppBuiltInPlugin} from "@/interface";
import {MicroApp, TiEventTargetType} from "tiyi-core";


/**
 * 在iframe同源下，a标签点击hash，该hash会被导航top窗口顶部而不是导航在iframe中的顶部，和预期结果不符，
 * 该插件打补丁实现导航到iframe顶部
 * TODO 更优雅的重置方式
 * */
export class ResetHashClickMisalignment extends MicroAppBuiltInPlugin {
  public onConnect(event?: TiEventTargetType<MicroApp>) {
    const appWindow = this.window
    appWindow.addEventListener("hashchange", (ev) => {
      const {scrollX, scrollY} = window

      function preventTopScroll() {
        console.log(111111111111111111)
        window.removeEventListener('scroll', preventTopScroll)
        if (window.scrollY !== scrollY) window.scrollTo(scrollX, scrollY)
      }

      window.addEventListener('scroll', preventTopScroll)
    })
  }
}

