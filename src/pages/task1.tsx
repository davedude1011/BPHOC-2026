import { createEffect, createSignal } from "solid-js";
import type { WasmManager } from "../../rust-wasm/pkg/manager";
import { Button, DualInput } from "../components/components";
import { Text } from "../components/content";
import { Header, MutedHeader } from "../components/headers";
import { Break, Credit, Divider, Latex, PageContainer, PathButton, TaskVisual } from "../components/page-utils";
import { generate_seed, Manager } from "../logic/manager";

function Component1_0() {
    let canvas_ref: HTMLCanvasElement | undefined;

    const [seed, set_seed] = createSignal<bigint>(generate_seed());
    const [N, set_N] = createSignal<number>(250);
    const [s, set_s] = createSignal<number>(25);

    const manager = new Manager();

    createEffect(() => {
        if (!canvas_ref) return;
        manager.link_canvas(canvas_ref);
    })

    createEffect(() => {
        if (!canvas_ref) return;

        const callback = (wasm_manager: WasmManager) =>
            wasm_manager.task_1_0(seed(), N()+1, s()+1);

        manager.update_canvas(callback);
    })

    return (
        <div>
            <canvas
                class="w-full aspect-square border border-muted rounded"
                ref={canvas_ref}
            />

            <div class="flex flex-col gap-2">
                <div class="flex flex-row">
                    <DualInput label="N" from={0} to={100_000} step={1} value={N} set_value={set_N} />
                    <DualInput label="s" from={0} to={100}     step={1} value={s} set_value={set_s} />
                </div>
                
                <Button label="randomize" onclick={() => set_seed(generate_seed())} />
            </div>
        </div>
    )
}

function Component1_1() {
    let canvas_ref: HTMLCanvasElement | undefined;

    const [seed, set_seed] = createSignal<bigint>(generate_seed());
    const [n, set_n] = createSignal<number>(50);
    const [N, set_N] = createSignal<number>(1500);
    const [s, set_s] = createSignal<number>(5);

    const manager = new Manager();

    createEffect(() => {
        if (!canvas_ref) return;
        manager.link_canvas(canvas_ref);
    })

    createEffect(() => {
        if (!canvas_ref) return;

        const callback = (wasm_manager: WasmManager) =>
            wasm_manager.task_1_1(seed(), n(), N()+1, s()+1);

        manager.update_canvas(callback);
    })

    return (
        <div>
            <canvas
                class="w-full aspect-square border border-muted rounded"
                ref={canvas_ref}
            />

            <div class="flex flex-col gap-2">
                <DualInput label="n" from={0} to={50} step={1} value={n} set_value={set_n} />

                <div class="flex flex-row">
                    <DualInput label="N" from={0} to={10_000} step={1} value={N} set_value={set_N} />
                    <DualInput label="s" from={0} to={100}    step={1} value={s} set_value={set_s} />
                </div>

                <Button label="randomize" onclick={() => set_seed(generate_seed())} />
            </div>
        </div>
    )
}

function Component1_2() {
    let canvas_ref: HTMLCanvasElement | undefined;

    const [seed, set_seed] = createSignal<bigint>(generate_seed());

    const [n, set_n] = createSignal<number>(5);
    const [N, set_N] = createSignal<number>(500);
    const [s, set_s] = createSignal<number>(30);

    const [Rx, set_Rx] = createSignal<number>(0);
    const [Ry, set_Ry] = createSignal<number>(0);
    const [Rz, set_Rz] = createSignal<number>(0);

    const manager = new Manager();

    createEffect(() => {
        if (!canvas_ref) return;
        manager.link_canvas(canvas_ref);
    })

    createEffect(() => {
        if (!canvas_ref) return;

        const callback = (wasm_manager: WasmManager) =>
            wasm_manager.task_1_2(seed(), Rx(), Ry(), Rz(), n(), N()+1, s()+1);

        manager.update_canvas(callback);
    })

    return (
        <div>
            <canvas
                class="w-full aspect-square border border-muted rounded"
                ref={canvas_ref}
            />

            <div class="flex flex-col gap-2">
                <DualInput label="n" from={0} to={50} step={1} value={n} set_value={set_n} />

                <div class="flex flex-row">
                    <DualInput label="N" from={0}  to={5_000} step={1} value={N} set_value={set_N} />
                    <DualInput label="s" from={0}  to={150}   step={1} value={s} set_value={set_s} />
                </div>

                <div class="flex flex-row">
                    <DualInput label="R_x" from={0} to={Math.PI * 2} step={0.01} value={Rx} set_value={set_Rx} />
                    <DualInput label="R_y" from={0} to={Math.PI * 2} step={0.01} value={Ry} set_value={set_Ry} />
                    <DualInput label="R_z" from={0} to={Math.PI * 2} step={0.01} value={Rz} set_value={set_Rz} />
                </div>

                <Button label="randomize" onclick={() => set_seed(generate_seed())} />
            </div>
        </div>
    )
}

export default function TaskOne() {
    return (
        <PageContainer>
            <PathButton index={0} title="Home" subtitle="" href="/" />
            <Divider />

            <Break />
            
            <MutedHeader>
                Task One
            </MutedHeader>

            <Header>
                Random Walk
            </Header>

            <Break count={2} />

            <Text>
                <Latex>N</Latex> steps of size <Latex>s</Latex>, each step being at a random angle <Latex>\theta</Latex> from the horizontal in a uniform distribution of <Latex>0</Latex> to <Latex>2\pi</Latex> radians
            </Text>

            <Break />

            <Component1_0 />

            <Break count={2} />

            <Text>
                randomly walking a size <Latex>s</Latex> can be thought of as picking an end point <Latex>P</Latex> such that it lays
                on the circumference of a circle of radius <Latex>s</Latex>, that is centered at the end of the last step,
                then walking to it
            </Text>

            <Break />

            <TaskVisual task={1} filename="circle.svg" />

            <Break />

            <Text>
                to do this, you can generate a random number <Latex>u</Latex> from a uniform distribution such that
                <Latex>0 \le u \le 1</Latex>, then calculate an angle <Latex>\theta</Latex> such that <Latex>\theta = 2\pi u</Latex>,
                then calculate the change in each axis by multiplying the
                radius <Latex>s</Latex> by <Latex>\sin</Latex> and <Latex>\cos</Latex> respectively
            </Text>

            <Break />

            <TaskVisual task={1} filename="calculations.svg" />

            <Break count={2} />

            <Text>
                the model can be extended by introducing more lines simultaneously, and randomizing their color to make them distinct
            </Text>

            <Break />

            <Text>
                <Latex>n</Latex> lines each of which with <Latex>N</Latex> steps of size <Latex>s</Latex>, each step being at a random angle <Latex>\theta</Latex> from the horizontal in a uniform distribution of <Latex>0</Latex> to <Latex>2\pi</Latex> radians
            </Text>

            <Break />

            <Component1_1 />

            <Break count={2} />

            <Text>
                the model can be further extended by introducing depth, making the model 3 dimensional, although this poses an issue
                with the previously used model for the calculation of the next position, the solution to be used in this section is
                to extend the model to randomly select a 3 dimensional point on the surface of a sphere, again with radius <b>s </b>
                centered at the point being traveled from
            </Text>

            <Break />

            <TaskVisual task={1} filename="sphere.svg" />

            <Break />

            <Text>
                to generate a point on the surface of a sphere, my original method involved inscribing a circle inside of the sphere,
                at an angle <Latex>\theta_1</Latex> from the horizontal, then using the original method for generating a random point
                on that inscribed circles circumference
            </Text>
            <Text>
                the issue with this method is that the resultant distribution of points on the spheres surface in non-uniform, with higher
                likelihoods of points being at the poles of the rotational axis of the inscribed circle
            </Text>

            <Break />

            <TaskVisual task={1} filename="sphere-rotation.svg" />

            <Break />

            <Text>
                the solution i came across, <Credit href="https://math.stackexchange.com/a/1586185" label={"source"} task={1} author="Brian Tung" />, involves two random variables, 
                <Latex>u_1</Latex>, <Latex>u_2</Latex>, similarly to earlier they follow a uniform distribution such that <Latex>0 \le u_1 \le 1 \space</Latex>
                and <Latex>0 \le u_2 \le 1</Latex>, then calculating the latitude <Latex>\phi</Latex> and longitude <Latex>\lambda</Latex> such that
            </Text>
            <Break />
            <Text centered>
                <Latex>{"\\phi = \\arccos(2u_1 - 1) - \\frac{\\pi}{2}"}</Latex>
            </Text>
            <Break />
            <Text centered>
                <Latex>\lambda = 2\pi u_2</Latex>
            </Text>
            <Break />
            <Text>
                then using these, we can convert to <Latex>x</Latex>, <Latex>y</Latex>, and <Latex>z</Latex> values, which map to a random point on a unit
                sphere, so for this use case should be multiplied by <Latex>s</Latex> to account for the walk size, which will give the change in each axis
                made by each step
            </Text>
            <Break />
            <Text centered>
                <Latex>dx = s \cos \phi \cos \lambda</Latex>
            </Text>
            <Break />
            <Text centered>
                <Latex>dy = s \cos \phi \sin \lambda</Latex>
            </Text>
            <Break />
            <Text centered>
                <Latex>dz = s \sin \phi</Latex>
            </Text>

            <Break />

            <Text>
                since this 3d visualization is being projected to a 2d canvas, extra sliders <Latex>R_x</Latex>, <Latex>R_y</Latex> and <Latex>R_z</Latex> have
                been added, they apply rotational matrices to every point in the <Latex>x</Latex>, <Latex>y</Latex> and <Latex>z</Latex> axis respectively, to help with viewing
                the data, credit to <Credit label="geeksforgeeks" author="madhav_mohan" href="https://www.geeksforgeeks.org/computer-graphics/computer-graphics-3d-rotation-transformations/" task={1}/>
            </Text>

            <Break />

            <Component1_2 />
        </PageContainer>
    )
}