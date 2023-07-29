import {MicroAppPropertyPlugin} from "@/interface";

export class YangDocumentReDefineProperty extends MicroAppPropertyPlugin {
  public onConnect() {
    const self = this
    this.addRules({
      URL: {
        get() {
          return self.belongApp.url
        },
        set() {
        }
      },
      documentURI: {
        get() {
          return self.belongApp.url
        },
        set() {
        }
      }
    })
    //--------------------------------------------------------
    this.define(this.document)
  }
}
