/** tiyi app global instance */

import {__tiyi__, __TIYI__} from "@/constant";
import {TiYiApp} from "@/interface";
import {AnyRecord} from "types";

export const TIYI: TiYiApp & AnyRecord = window[__TIYI__] || window[__tiyi__]  || new TiYiApp()   // 如果该库被引用则定义全局变量并导出,保证全局单例唯一定义(当前窗口)


