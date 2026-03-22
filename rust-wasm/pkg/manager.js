/* @ts-self-types="./manager.d.ts" */

import * as wasm from "./manager_bg.wasm";
import { __wbg_set_wasm } from "./manager_bg.js";
__wbg_set_wasm(wasm);
wasm.__wbindgen_start();
export {
    WasmManager
} from "./manager_bg.js";
