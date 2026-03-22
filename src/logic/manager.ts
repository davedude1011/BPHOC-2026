import { WasmManager } from "../../rust-wasm/pkg";
import { memory } from "../../rust-wasm/pkg/manager_bg.wasm";

export function generate_seed() {
    const array = new Uint8Array(8);
    crypto.getRandomValues(array);
    return array.reduce((acc, byte) => (acc << 8n) + BigInt(byte), 0n);
}

export class Manager {
    wasm_manager?: WasmManager;
    ctx?: CanvasRenderingContext2D;
    width?: number;
    height?: number;

    constructor() {
        this.wasm_manager = WasmManager.new();
    }

    link_canvas(canvas: HTMLCanvasElement) {
        if (!this.wasm_manager) return;

        const width  = canvas.clientWidth;
        const height = canvas.clientHeight;

        canvas.width  = width;
        canvas.height = height;

        this.width  = width;
        this.height = height;

        const context = canvas.getContext("2d");
        if (!context) return;

        this.ctx = context;

        this.wasm_manager.define_canvas(width, height, 0xffffffff);
    }

    update_canvas(callback: (wasm_manager: WasmManager) => void) {
        if (!this.wasm_manager) return;
        if (!this.ctx) return;
        if (!this.width) return;
        if (!this.height) return;

        callback(this.wasm_manager);

        const pixels_ptr = this.wasm_manager.get_pixels_ptr();
        const pixels = new Uint8ClampedArray(memory.buffer, pixels_ptr, this.width * this.height * 4);

        const image_data = new ImageData(pixels, this.width, this.height);
        
        this.ctx.putImageData(image_data, 0, 0);
    }
}