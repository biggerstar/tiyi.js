import {TiYiApp, TiYiPlugin} from "tiyi-core";
import {HistoryController} from "@/interface";


export class AutoAsyncHistoryToTopWindow extends TiYiPlugin {
  priority: -20
  public install(app: TiYiApp, ...args) {
    const historyController = new HistoryController()
    app.historyController = historyController
    historyController.listenAppWindow(window,true)
  }
}
