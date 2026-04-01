import 'chart.js/auto';
import { Scatter } from "solid-chartjs";
import { createEffect, createMemo, createSignal, onCleanup } from "solid-js";
import type { WasmManager } from "../../rust-wasm/pkg/manager";
import { DualInput } from "../components/components";
import { Text } from "../components/content";
import { Header, MutedHeader } from "../components/headers";
import { Break, Divider, Latex, PageContainer, PathButton } from "../components/page-utils";
import { Manager } from "../logic/manager";

function Component4_0() {
    let canvas_ref1: HTMLCanvasElement | undefined;
    let canvas_ref2: HTMLCanvasElement | undefined;

    const [N, set_N] = createSignal<number>(15);

    const manager1 = new Manager();
    const manager2 = new Manager();

    createEffect(() => {
        if (!canvas_ref1) return;
        if (!canvas_ref2) return;

        manager1.link_canvas(canvas_ref1);
        manager2.link_canvas(canvas_ref2);
    })

    const tick = () => {
        manager1.update_canvas((wasm) => wasm.task_4_0_0(
            N(),
        ));
        manager2.update_canvas((wasm) => wasm.task_4_0_1(
            N(),
        ));
    };

    createEffect(() => {
        if (!canvas_ref1) return;
        if (!canvas_ref2) return;

        const callback1 = (wasm_manager: WasmManager) =>
            wasm_manager.task_4_0_0(N());

        const callback2 = (wasm_manager: WasmManager) =>
            wasm_manager.task_4_0_1(N());

        manager1.update_canvas(callback1);
        manager2.update_canvas(callback2);
    })

    createEffect(() => {
        const interval = setInterval(tick, 10);
        onCleanup(() => clearInterval(interval));
    });

    return (
        <div>
            <div class="flex flex-row gap-2">
                <div class="flex flex-1 flex-col">
                    <Text centered>Random Walk</Text>
                    <canvas
                        class="w-full aspect-square border border-muted rounded"
                        ref={canvas_ref1}
                    />
                </div>
                <div class="flex flex-1 flex-col">
                    <Text centered>Linear Walk</Text>
                    <canvas
                        class="w-full aspect-square border border-muted rounded"
                        ref={canvas_ref2}
                    />
                </div>
            </div>

            <div class="flex flex-col gap-2">
                <DualInput label="N" from={0} to={10_000} step={1} value={N} set_value={set_N} />
            </div>
        </div>
    )
}

function Component4_1() {
    let canvas_ref: HTMLCanvasElement | undefined;

    const [N, set_N] = createSignal<number>(5000);
    const [I, set_I] = createSignal<number>(100);
    const [f, set_f] = createSignal<number>(500);

    const [escape_score, set_escape_score] = createSignal<number>(0);
    const [history, set_history] = createSignal<{x: number, y: number}[]>([]);

    const manager = new Manager();

    createEffect(() => {
        if (!canvas_ref) return;
        manager.link_canvas(canvas_ref);
    })

    const tick = () => {
        manager.update_canvas((wasm) => {
            const escaped_in_frame = wasm.task_4_1(N(), f(), I());
            set_escape_score(e => e + escaped_in_frame);
        });
    };

    const update_score = () => {
        const current_val = escape_score();
        set_escape_score(0);

        set_history(prev => {
            const next = [...prev, { x: prev.length, y: current_val }];
            return next;
        });
    };

    const chart_data = createMemo(() => ({
        datasets: [
            {
                label: "Electrons per second",
                data: history().slice(-600),
                backgroundColor: "#e33232",
                showLine: true,
            },
        ],
    }));

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 0 },
        scales: {
            x: { title: { display: true, text: "Time (s)" } },
            y: { title: { display: true, text: "Escaped Electrons" }, beginAtZero: true }
        }
    };

    createEffect(() => {
        const score_interval = setInterval(update_score, 100);
        const interval = setInterval(tick, 10);
        onCleanup(() => {
            clearInterval(interval);
            clearInterval(score_interval);
        });
    });

    return (
        <div class="flex flex-col gap-4">
            <div class="flex flex-1 aspect-square">
                <Scatter data={chart_data()} options={chartOptions} />
            </div>
            <canvas
                class="w-full aspect-square border border-muted rounded"
                ref={canvas_ref}
            />

            <div class="flex flex-col gap-2">
                <div class="flex flex-row">
                    <DualInput label="N" from={0} to={50_000} step={1} value={N} set_value={set_N} />
                    <DualInput label="I" from={0} to={1_000} step={1} value={I} set_value={set_I} />
                </div>
                <DualInput label="f" from={300} to={900} step={1} value={f} set_value={set_f} />
            </div>
        </div>
    )
}

function Component4_2() {
    let canvas_ref: HTMLCanvasElement | undefined;

    const [N, set_N] = createSignal<number>(5000);
    const [I, set_I] = createSignal<number>(100);
    const [f, set_f] = createSignal<number>(0);

    const [history, set_history] = createSignal<{x: number, y: number}[]>([]);

    const manager = new Manager();

    createEffect(() => {
        if (!canvas_ref) return;
        manager.link_canvas(canvas_ref);
    })

    const tick = () => {
        manager.update_canvas((wasm) => {
            const frame_max_k = wasm.task_4_2(N(), f(), I());
            
            set_history(prev => {
                const existing_index = prev.findIndex(p => Math.round(p.x) === Math.round(f()));
                
                if (existing_index !== -1) {
                    if (frame_max_k > prev[existing_index].y) {
                        const next = [...prev];
                        next[existing_index] = { x: f(), y: frame_max_k };
                        return next;
                    }
                    return prev;
                } else {
                    return [...prev, { x: f(), y: frame_max_k }];
                }
            });
        });
    };

    const f_animate = () => {
        if (f() == 900) set_f(0);
        else set_f(f => f + 10);
    }

    const chart_data = createMemo(() => ({
        datasets: [
            {
                label: "Energy vs Frequency",
                data: history().slice(-600),
                backgroundColor: "#e33232",
                showLine: true,
            },
        ],
    }));

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 0 },
        scales: {
            x: { title: { display: true, text: "Frequency" }, beginAtZero: true },
            y: { title: { display: true, text: "Maximum Energy" }, beginAtZero: true }
        }
    };

    createEffect(() => {
        const f_interval = setInterval(f_animate, 100);
        const interval = setInterval(tick, 10);
        onCleanup(() => {
            clearInterval(f_interval);
            clearInterval(interval);
        });
    });

    return (
        <div class="flex flex-col gap-4">
            <div class="flex flex-1 aspect-square">
                <Scatter data={chart_data()} options={chartOptions} />
            </div>
            <canvas
                class="w-full aspect-square border border-muted rounded"
                ref={canvas_ref}
            />

            <div class="flex flex-col gap-2">
                <div class="flex flex-row">
                    <DualInput label="N" from={0} to={50_000} step={1} value={N} set_value={set_N} />
                    <DualInput label="I" from={0} to={1_000} step={1} value={I} set_value={set_I} />
                </div>
                <DualInput label="f" from={0} to={900} step={1} value={f} set_value={set_f} />
            </div>
        </div>
    )
}

export default function TaskFour() {
    return (
        <PageContainer>
            <PathButton index={0} title="Home" subtitle="" href="/" />
            <Divider />

            <Break />
            
            <MutedHeader>
                Task Four
            </MutedHeader>

            <Header>
                Photoelectric Effect
            </Header>

            <Break count={2} />

            <Text>
                to model the photoelectric effect, you first need a model for the delocalized electrons in the metal
                lattice, for this we can reuse the earlier used models for motion, namely the random walk, and the linear walk model
                i introduced at the end of the brownian motion topic, where the particles maintain their velocity and
                direction until collision, both methods can be seen below, with the variable <Latex>N</Latex> being
                the number of delocalized electrons
            </Text>
            <Break />
            <Text>
                for simplicity im not going to model the metal ions in the lattice structure, or model electron to electron
                collisions, due to both not largely effecting the results of the model, and being too computationally expensive
                for large values of <Latex>N</Latex>
            </Text>

            <Break />

            <Component4_0 />

            <Break count={2} />

            <Text>
                next, we just need to introduce the ray of light, represented by a stream of packets over time, then implement
                collision detection between the packets and the electrons, at which point the packet can transfer its velocity
                magnitude to the electron, essentially transferring its energy, then disappears, or in the case of this model,
                just teleport to the start of the stream to create a loop :P
            </Text>
            <Break />
            <Text>
                the frequency of the light is what determines the energy per packet, using Planck's formula <Latex>E = hf</Latex>, 
                with <Latex>E</Latex> being the energy per packet, <Latex>h</Latex> being Planck's constant, and <Latex>f</Latex> being
                the frequency of the wave
            </Text>
            <Break />
            <Text>
                using the energy of the photon, we can check during the collision wether the total energy of the electron after absorbing
                the energy of the packet is over the work function <Latex>\Phi</Latex>, with <Latex>\Phi</Latex> being the minimum energy
                required for an electron to escape the bounds of its metal lattice
            </Text>
            <Break count={2} />
            <Text>
                below is a model of this using a linear walk for electrons, and has a live graph of escaped electrons over time, the work
                function for this models substance is set such that a frequency of above <Latex>400</Latex> is required to free an electron, 
                and the color of the packets is corresponding to the visual color of the frequency, frequencies outside of the visible
                spectrum will be invisible but still be present
            </Text>
            <Break />
            <Text>
                the parameter <Latex>N</Latex> is again the number of delocalized electrons, <Latex>I</Latex> is the number of packets 
                passing per arbitrary unit time, and <Latex>f</Latex> is the frequency of wavelength, or terms of packets its the relative
                scale of energy per packet
            </Text>
            <Break />

            <Component4_1 />

            <Break />

            <Text>
                the data shown in the graph doesn't appear to follow a general function, which is expected due to the probabilistic nature
                of the simulation, the results are purely statistical, but what the data above does show well is the shift in average position
                of the points when the intensity changes, more packets means statistically more electrons can be displaced, which is showed by
                the "mass" of the points moving
            </Text>

            <Break count={2} />

            <Text>
                now if instead of measuring the number of electrons leaving, we can run the simulation, and increase the frequency by one every
                tenth of a second, then for each simulated frame we can find the energy levels of all the electrons that have left the lattice
                and calculate the maximum one and return it, then similarly we can list all the maximums for each frame of the simulation spanning
                a single frequency value, in other words all the returned maximums each tenth of a second, which should be 10 values, since the simulation
                runs at a fixed one frame per hundredth of a second, then we can find the maximum from that list and plot it against the frequency value
            </Text>
            <Break />
            <Text>
                doing this we get the graph shown bellow, the simulation has been running since this page loaded, so if you wish to see it from the beginning
                refresh the page
            </Text>
            <Break />

            <Component4_2 />
        </PageContainer>
    )
}