/* tslint:disable */
/* eslint-disable */

export class WasmManager {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    define_canvas(width: number, height: number, bg: number): void;
    get_pixels_ptr(): number;
    static new(): WasmManager;
    task_10_0(n: number, l: number, m: number, z: number, a: number, plane: number, zoom: number): number;
    task_10_1(n: number, l: number, m: number, z: number, a: number, points: number, zoom: number, yaw: number, pitch: number, gain: number): void;
    task_10_energy(n: number, z: number, a: number): number;
    task_10_mean_radius(n: number, l: number, z: number, a: number): number;
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
    task_6_0(m: number, scalar: number): void;
    task_6_1(m: number, t: number, scalar: number, overlay: boolean): void;
    task_6_2(m: number, t: number, c: number, h: number, s: number, scalar: number, overlay: boolean): void;
}
