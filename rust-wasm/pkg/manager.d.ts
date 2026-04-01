/* tslint:disable */
/* eslint-disable */

export class WasmManager {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    define_canvas(width: number, height: number, bg: number): void;
    get_pixels_ptr(): number;
    static new(): WasmManager;
    task_1_0(seed: bigint, N: number, s: number): void;
    task_1_1(seed: bigint, n: number, N: number, s: number): void;
    task_1_2(seed: bigint, Rx: number, Ry: number, Rz: number, n: number, N: number, s: number): void;
    task_2_0(N: number, r: number, R: number): void;
    task_2_1(N: number, m: number, r: number, M: number, R: number): void;
    task_2_2(N: number, m: number, r: number, M: number, R: number): void;
    task_4_0_0(N: number): void;
    task_4_0_1(N: number): void;
    task_4_1(N: number, f: number, I: number): number;
    task_4_2(N: number, f: number, I: number): number;
}
