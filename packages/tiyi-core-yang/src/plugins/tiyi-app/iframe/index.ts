import {doc, goto, mount} from "./src";
import {TIYI} from "tiyi-core";





function install() {

  console.log(TIYI);   // TODO   bug umd.js 后  TIYI不是同一个
  TIYI.use({
    priority: 1002,
    aa: 222,
    onCreateMicroApp({data: app}) {
      console.log(111111111111111111)

      Object.defineProperties(app, {
        mount: {
          value: mount,
          enumerable: true,
          configurable: false
        },
        doc: {
          value: doc,
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
