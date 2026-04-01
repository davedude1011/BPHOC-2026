import { createEffect, createSignal, onCleanup } from "solid-js";
import type { WasmManager } from "../../rust-wasm/pkg/manager";
import { DualInput } from "../components/components";
import { Quote, Text } from "../components/content";
import { Header, MutedHeader } from "../components/headers";
import { Break, Credit, Divider, Latex, PageContainer, PathButton, TaskVisual } from "../components/page-utils";
import { Manager } from "../logic/manager";

function Component2_0() {
    let canvas_ref: HTMLCanvasElement | undefined;

    const [N, set_N] = createSignal<number>(1000);

    const [r, set_r] = createSignal<number>(1);
    const [R, set_R] = createSignal<number>(50);

    const manager = new Manager();

    createEffect(() => {
        if (!canvas_ref) return;
        manager.link_canvas(canvas_ref);
    })

    const tick = () => {
        manager.update_canvas((wasm) => wasm.task_2_0(
            N(), r(), R(),
        ));
    };

    createEffect(() => {
        if (!canvas_ref) return;

        const callback = (wasm_manager: WasmManager) =>
            wasm_manager.task_2_0(N(), r(), R());

        manager.update_canvas(callback);
    })

    createEffect(() => {
        const interval = setInterval(tick, 10);
        onCleanup(() => clearInterval(interval));
    });

    return (
        <div>
            <canvas
                class="w-full aspect-square border border-muted rounded"
                ref={canvas_ref}
            />

            <div class="flex flex-col gap-2">
                <DualInput label="N" from={0} to={50_000} step={1} value={N} set_value={set_N} />
                <div class="flex flex-row">
                    <DualInput label="r" from={0} to={10}  step={1} value={r} set_value={set_r} />
                    <DualInput label="R" from={0} to={200} step={1} value={R} set_value={set_R} />
                </div>
            </div>
        </div>
    )
}

function Component2_1() {
    let canvas_ref: HTMLCanvasElement | undefined;

    const [N, set_N] = createSignal<number>(40000);

    const [m, set_m] = createSignal<number>(1);
    const [r, set_r] = createSignal<number>(1);
    const [M, set_M] = createSignal<number>(100);
    const [R, set_R] = createSignal<number>(50);

    const manager = new Manager();

    createEffect(() => {
        if (!canvas_ref) return;
        manager.link_canvas(canvas_ref);
    })

    const tick = () => {
        manager.update_canvas((wasm) => wasm.task_2_1(
            N(), m(), r(), M(), R(),
        ));
    };

    createEffect(() => {
        if (!canvas_ref) return;

        const callback = (wasm_manager: WasmManager) =>
            wasm_manager.task_2_1(N(), m(), r(), M(), R());

        manager.update_canvas(callback);
    })

    createEffect(() => {
        const interval = setInterval(tick, 10);
        onCleanup(() => clearInterval(interval));
    });

    return (
        <div>
            <canvas
                class="w-full aspect-square border border-muted rounded"
                ref={canvas_ref}
            />

            <div class="flex flex-col gap-2">
                <DualInput label="N" from={0} to={50_000} step={1} value={N} set_value={set_N} />
                <div class="flex flex-row">
                    <DualInput label="m" from={0} to={50}  step={1} value={m} set_value={set_m} />
                    <DualInput label="r" from={0} to={10}  step={1} value={r} set_value={set_r} />
                </div>
                <div class="flex flex-row">
                    <DualInput label="M" from={0} to={500} step={1} value={M} set_value={set_M} />
                    <DualInput label="R" from={0} to={200} step={1} value={R} set_value={set_R} />
                </div>
            </div>
        </div>
    )
}

function Component2_2() {
    let canvas_ref: HTMLCanvasElement | undefined;

    const [N, set_N] = createSignal<number>(2500);

    const [m, set_m] = createSignal<number>(1);
    const [r, set_r] = createSignal<number>(1);
    const [M, set_M] = createSignal<number>(100);
    const [R, set_R] = createSignal<number>(50);

    const manager = new Manager();

    createEffect(() => {
        if (!canvas_ref) return;
        manager.link_canvas(canvas_ref);
    })

    const tick = () => {
        manager.update_canvas((wasm) => wasm.task_2_2(
            N(), m(), r(), M(), R(),
        ));
    };

    createEffect(() => {
        if (!canvas_ref) return;

        const callback = (wasm_manager: WasmManager) =>
            wasm_manager.task_2_2(N(), m(), r(), M(), R());

        manager.update_canvas(callback);
    })

    createEffect(() => {
        const interval = setInterval(tick, 10);
        onCleanup(() => clearInterval(interval));
    });

    return (
        <div>
            <canvas
                class="w-full aspect-square border border-muted rounded"
                ref={canvas_ref}
            />

            <div class="flex flex-col gap-2">
                <DualInput label="N" from={0} to={50_000} step={1} value={N} set_value={set_N} />
                <div class="flex flex-row">
                    <DualInput label="m" from={0} to={50}  step={1} value={m} set_value={set_m} />
                    <DualInput label="r" from={0} to={10}  step={1} value={r} set_value={set_r} />
                </div>
                <div class="flex flex-row">
                    <DualInput label="M" from={0} to={500} step={1} value={M} set_value={set_M} />
                    <DualInput label="R" from={0} to={200} step={1} value={R} set_value={set_R} />
                </div>
            </div>
        </div>
    )
}

export default function TaskTwo() {
    return (
        <PageContainer>
            <PathButton index={0} title="Home" subtitle="" href="/" />
            <Divider />

            <Break />
            
            <MutedHeader>
                Task Two
            </MutedHeader>

            <Header>
                Brownian Motion
            </Header>

            <Break count={2} />

            <Quote label="wikipedia" href="https://simple.wikipedia.org/wiki/Brownian_motion">
                Brownian motion is the random motion of particles suspended in a medium (a liquid or a gas).
                The motion is caused by fast-moving atoms or molecules that hit the particles.
            </Quote>

            <Break count={2} />

            <Text>
                to model brownian motion, you need a system containing particles, like a fluid, such that every tick, or unit
                time, each particle walks a random step, and for visual integrity the particles should be confined
                to the system so that they don't escape, then we can implement the main particle, where its movement is determined solely by
                the mass and velocities of particles in the fluid that collide with it, for now we can
                assume perfect elastic collisions between the particle and fluid
            </Text>
            <Break />
            <Text>
                first we can model the fluid and a static particle, instead of calculating collisions, this early version just
                displaces any fluid particles inside the particle to its circumference during changes of radius
            </Text>

            <Break />

            <Component2_0 />

            <Break count={2} />

            <Text>
                to calculate the movement of the particle and the fluid particle during a collision, we
                first need to derive a formula for final velocity in one dimension, which can be done
                by combining the formula for conservation of momentum and the formula for conservation of
                energy
            </Text>
            <Break />
            <Text centered><Latex>{"\\frac{1}{2}mv^2 + \\frac{1}{2}MV^2 = \\frac{1}{2}m(v')^2 + \\frac{1}{2}M(V')^2"}</Latex></Text>
            <Break />
            <Text centered><Latex>\to mv^2 + MV^2 = m(v')^2 + M(V')^2</Latex></Text>
            <Break />
            <Text centered><Latex>\to m(v^2 - (v')^2) = M((V')^2 - V^2)</Latex></Text>
            <Break />
            <Text centered><Latex>\to m(v - v')(v + v') = M(V' - V)(V' + V)</Latex></Text>
            <Break count={2} />
            <Text centered><Latex>mv + MV = mv' + MV'</Latex></Text>
            <Break />
            <Text centered><Latex>\to m(v - v') = M(V' - V)</Latex></Text>
            <Break count={2} />
            <Text centered><Latex>\to v + v' = V + V'</Latex></Text>
            <Break />
            <Text>
                then using this simplified formula, we can substitute into the original
                conservation of momentum equation, then solve for <Latex>v'</Latex> and <Latex>V'</Latex> individually,
                again only working for one dimensional collisions
            </Text>
            <Break />
            <Text centered><Latex>mv + MV = mv' + MV'</Latex></Text>
            <Break />
            <Text centered><Latex>\to m(v - v') = M(V' - V)</Latex></Text>
            <Break count={2} />
            <Text centered><Latex>v + v' = V + V'</Latex></Text>
            <Break />
            <div class="flex flex-row justify-between">
                <div>
                    <Text tail="text-lg!" centered><Latex>\to V' = v + v' - V</Latex></Text>
                    <Break count={2} />
                    <Text tail="text-lg!" centered><Latex>m(v - v') = M((v + v' - V) - V)</Latex></Text>
                    <Break />
                    <Text tail="text-lg!" centered><Latex>\to mv - mv' = Mv + Mv' - 2MV</Latex></Text>
                    <Break />
                    <Text tail="text-lg!" centered><Latex>\to mv - Mv + 2MV = v'M + v'm</Latex></Text>
                    <Break />
                    <Text tail="text-lg!" centered><Latex>{"\\to v' = \\dfrac{v(m - M) + 2MV}{m + M}"}</Latex></Text>
                </div>
                <div>
                    <Text tail="text-lg!" centered><Latex>\to v' = V' + V - v</Latex></Text>
                    <Break count={2} />
                    <Text tail="text-lg!" centered><Latex>m(v - (V' + V - v)) = M(V' - V)</Latex></Text>
                    <Break />
                    <Text tail="text-lg!" centered><Latex>\to m(2v - V' - V) = MV' - MV</Latex></Text>
                    <Break />
                    <Text tail="text-lg!" centered><Latex>\to 2mv - mV' - mV = MV' - MV</Latex></Text>
                    <Break />
                    <Text tail="text-lg!" centered><Latex>{"\\to V' = \\dfrac{2mv + V(M - m)}{m + M}"}</Latex></Text>
                </div>
            </div>
            <Break />
            <Text>
                now we can derive a method for calculating the two dimensional resultant velocity vectors after
                a collision, the following working is an overview of the process, with partial credit
                to <Credit label="wikipedia" task={2} author="wikipedia" href="https://en.wikipedia.org/wiki/Elastic_collision#Two-dimensional" />
            </Text>
            <Break />
            <Text>
                for a given fluid particle, let <Latex>m</Latex> be its mass, <Latex>v</Latex> be its 2 dimensional
                velocity such that <Latex>{"v = \\begin{bmatrix}v_x \\\\ v_y\\end{bmatrix}"}</Latex>, and <Latex>p</Latex> be
                its 2 dimensional position such that <Latex>{"p = \\begin{bmatrix}p_x \\\\ p_y\\end{bmatrix}"}</Latex>
            </Text>
            <Break />
            <Text>
                similarly for the particle, let <Latex>M</Latex> be its mass, <Latex>V</Latex> be its 2 dimensional
                velocity such that <Latex>{"V = \\begin{bmatrix}V_x \\\\ V_y\\end{bmatrix}"}</Latex>, and <Latex>P</Latex> be
                its 2 dimensional position such that <Latex>{"P = \\begin{bmatrix}P_x \\\\ P_y\\end{bmatrix}"}</Latex>
            </Text>
            <Break />
            <TaskVisual task={2} filename="definitions.svg" />
            <Break />
            <Text>
                during the collision of the particles, we can calculate the normal of their positions, <Latex>n = P - p</Latex>, to
                get a vector line of action that the force will take place over, then we can convert it to a unit vector to get purely
                the direction across the line of action, ignoring the magnitude, <Latex>{"\\hat{n} = \\frac{n}{|n|}"}</Latex>
            </Text>
            <Break />
            <TaskVisual task={2} filename="collision.svg" />
            <Break />
            <Text>
                using this <Latex>{"\\hat{n}"}</Latex> value, we can find the proportion of <Latex>v</Latex> and <Latex>V</Latex> that
                acts in the direction of the line of action, using a dot product
            </Text>
            <Break />
            <Text centered><Latex>{"v_n = v \\cdot \\hat{n}"}</Latex></Text>
            <Break />
            <Text centered><Latex>{"V_n = V \\cdot \\hat{n}"}</Latex></Text>
            <Break />
            <Text>
                since these values <Latex>v_n</Latex> and <Latex>V_n</Latex> are scalar values, we can use the previously derived one
                dimensional resultant velocity formulas on them, with their masses
            </Text>
            <Break />
            <Text centered><Latex>{"v'_n = \\dfrac{v_n(m - M) + 2MV_n}{m + M}"}</Latex></Text>
            <Break />
            <Text centered><Latex>{"V'_n = \\dfrac{2mv_n + V_n(M - m)}{m + M}"}</Latex></Text>
            <Break />
            <Text>
                before we can reconstruct the resultant two dimensional resultant vectors, we need to take into account the velocity
                that was not acting in the normal direction, so the velocity that acted in the tangent direction, for simplicity, im going
                to assume the surfaces have no friction, so the tangential velocities stay the same, to calculate the tangential velocities,
                you can just subtract the velocity in the normal from the original
            </Text>
            <Break />
            <Text centered><Latex>{"v_t = v - v_n\\hat{n}"}</Latex></Text>
            <Break />
            <Text centered><Latex>{"V_t = V - V_n\\hat{n}"}</Latex></Text>
            <Break />
            <Text>
                then finally we can construct the final velocity vectors <Latex>v'</Latex> and <Latex>V'</Latex> by pointing the resultant normal
                scalars <Latex>v'_n</Latex> and <Latex>V'_n</Latex> in the direction of <Latex>n</Latex> to make them vectors, then adding back
                the tangential components
            </Text>
            <Break />
            <Text centered><Latex>{"v' = v_t + v'_n\\hat{n}"}</Latex></Text>
            <Break  />
            <Text centered><Latex>{"V' = V_t + V'_n\\hat{n}"}</Latex></Text>

            <Break />

            <Component2_1 />

            <Break count={2} />

            <Text>
                currently the fluid particles are randomly changing directions every tick, (following the random walk
                algorithm), what if instead, they keep their direction and velocity, until either collision with the
                particle, or with the boundaries of the canvas, the logic for particle collisions we already have, so that
                just leaves the collision with the boundary, in which i will again assume an elastic collision and
                simply reflect the point off the surface
            </Text>
            <Break />
            <Text>
                just as before, the fluid particles will not interact with other fluid particles
            </Text>

            <Break />

            <Component2_2 />
        </PageContainer>
    )
}