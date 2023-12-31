import {MicroAppBuiltInPlugin} from "@/interface";
import {MicroApp, TiEventTargetType} from "tiyi-core";


/**
 * 在iframe同源下，a标签点击hash，该iframe窗口的hash会被导航top窗口顶部，而不是导航在iframe中的顶部，和预期结果不符，
 * 该插件打补丁实现导航到iframe顶部
 * TODO 更优雅的重置方式
 *
 * 使用该方式会带来新的bug，在top hash变化到iframe hash变化，然后返回时，该节点也会被重置
 *
 * */
// export class ResetHashClickMisalignment extends MicroAppBuiltInPlugin {
//   public onConnect(event?: TiEventTargetType<MicroApp>) {
//     const appWindow = this.window
//     appWindow.addEventListener("hashchange", (ev) => {
//       const {scrollX, scrollY} = window
//
//       function preventTopScroll() {
//         window.removeEventListener('scroll', preventTopScroll)
//         if (window.scrollY !== scrollY) window.scrollTo(scrollX, scrollY)
//       }
//
//       window.addEventListener('scroll', preventTopScroll)
//     })
//   }
// }
