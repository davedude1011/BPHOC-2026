export class WasmManager {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(WasmManager.prototype);
        obj.__wbg_ptr = ptr;
        WasmManagerFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WasmManagerFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wasmmanager_free(ptr, 0);
    }
    /**
     * @param {number} width
     * @param {number} height
     * @param {number} bg
     */
    define_canvas(width, height, bg) {
        wasm.wasmmanager_define_canvas(this.__wbg_ptr, width, height, bg);
    }
    /**
     * @returns {number}
     */
    get_pixels_ptr() {
        const ret = wasm.wasmmanager_get_pixels_ptr(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {WasmManager}
     */
    static new() {
        const ret = wasm.wasmmanager_new();
        return WasmManager.__wrap(ret);
    }
    /**
     * @param {bigint} seed
     * @param {number} N
     * @param {number} s
     */
    task_1_0(seed, N, s) {
        wasm.wasmmanager_task_1_0(this.__wbg_ptr, seed, N, s);
    }
    /**
     * @param {bigint} seed
     * @param {number} n
     * @param {number} N
     * @param {number} s
     */
    task_1_1(seed, n, N, s) {
        wasm.wasmmanager_task_1_1(this.__wbg_ptr, seed, n, N, s);
    }
    /**
     * @param {bigint} seed
     * @param {number} Rx
     * @param {number} Ry
     * @param {number} Rz
     * @param {number} n
     * @param {number} N
     * @param {number} s
     */
    task_1_2(seed, Rx, Ry, Rz, n, N, s) {
        wasm.wasmmanager_task_1_2(this.__wbg_ptr, seed, Rx, Ry, Rz, n, N, s);
    }
    /**
     * @param {number} N
     * @param {number} r
     * @param {number} R
     */
    task_2_0(N, r, R) {
        wasm.wasmmanager_task_2_0(this.__wbg_ptr, N, r, R);
    }
    /**
     * @param {number} N
     * @param {number} m
     * @param {number} r
     * @param {number} M
     * @param {number} R
     */
    task_2_1(N, m, r, M, R) {
        wasm.wasmmanager_task_2_1(this.__wbg_ptr, N, m, r, M, R);
    }
    /**
     * @param {number} N
     * @param {number} m
     * @param {number} r
     * @param {number} M
     * @param {number} R
     */
    task_2_2(N, m, r, M, R) {
        wasm.wasmmanager_task_2_2(this.__wbg_ptr, N, m, r, M, R);
    }
}
if (Symbol.dispose) WasmManager.prototype[Symbol.dispose] = WasmManager.prototype.free;
export function __wbg___wbindgen_throw_6ddd609b62940d55(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
}
export function __wbg_getRandomValues_76dfc69825c9c552() { return handleError(function (arg0, arg1) {
    globalThis.crypto.getRandomValues(getArrayU8FromWasm0(arg0, arg1));
}, arguments); }
export function __wbindgen_init_externref_table() {
    const table = wasm.__wbindgen_externrefs;
    const offset = table.grow(4);
    table.set(0, undefined);
    table.set(offset + 0, undefined);
    table.set(offset + 1, null);
    table.set(offset + 2, true);
    table.set(offset + 3, false);
}
const WasmManagerFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_wasmmanager_free(ptr >>> 0, 1));

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_externrefs.set(idx, obj);
    return idx;
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return decodeText(ptr, len);
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}


let wasm;
export function __wbg_set_wasm(val) {
    wasm = val;
}
