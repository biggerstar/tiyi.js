import {goto, html, mount} from "./src";
import {TIYI} from "tiyi-core";


function install() {

  console.log(TIYI);   // TODO   bug umd.js 后  TIYI不是同一个
  TIYI.use({
    priority: 1002,
    onCreateMicroApp({data: app}) {
      Object.defineProperties(app, {
        mount: {
          value: mount,
          enumerable: true,
          configurable: false
        },
        html: {
          value: html,
          enumerable: true,
          configurable: false
        },
        goto: {
          value: goto,
          enumerable: true,
          configurable: false
        }
      })
    }
  })
}

export const Iframe = {
  priority: 1000,
  name: 'Iframe',
  install
}
