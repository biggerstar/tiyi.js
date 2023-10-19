import {MicroAppBuiltInPlugin} from "tiyi-core-yang";
import {MicroApp, TiEventTargetType, TIYI} from "tiyi-core";

export class AutoSyncAppHistoryToTopWindow extends MicroAppBuiltInPlugin {
  priority = -200

  public onConnect(event?: TiEventTargetType<MicroApp>) {
    TIYI.historyController.listenAppWindow(this.window)
  }
}
