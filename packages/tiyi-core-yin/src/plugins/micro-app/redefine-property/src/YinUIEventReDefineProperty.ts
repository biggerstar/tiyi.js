import {MicroAppPropertyPlugin} from "tiyi-core-yang";

export class YinUIEventReDefineProperty extends MicroAppPropertyPlugin {
  public onConnect() {
    this.addRules({
      view: {
        get: () => this.belongApp.proxyWindow
      },
    })
    this.definePrototype(this.window['UIEvent'])
  }
}
