import "chart.js/auto";
import { createEffect, createSignal, onCleanup, Show } from "solid-js";
import type { WasmManager } from "../../rust-wasm/pkg/manager";
import { Button, DualInput } from "../components/components";
import { Text } from "../components/content";
import { Header, MutedHeader } from "../components/headers";
import {
  Break,
  Divider,
  Latex,
  PageContainer,
  PathButton,
  TaskVisual,
} from "../components/page-utils";
import { Manager } from "../logic/manager";

function Component6_0() {
  let canvas_ref: HTMLCanvasElement | undefined;

  const [active, set_active] = createSignal<boolean>(false);

  const [m, set_m] = createSignal<number>(5);
  const [S, set_S] = createSignal<number>(1);

  const manager = new Manager();

  createEffect(() => {
    if (!canvas_ref) return;
    manager.link_canvas(canvas_ref);
  });

  const tick = () => {
    if (active()) manager.update_canvas((wasm) => wasm.task_6_0(m(), S()));
  };

  createEffect(() => {
    if (!canvas_ref) return;

    const callback = (wasm_manager: WasmManager) =>
      wasm_manager.task_6_0(m(), S());

    manager.update_canvas(callback);
  });

  createEffect(() => {
    const interval = setInterval(tick, 100);
    onCleanup(() => clearInterval(interval));
  });

  return (
    <div>
      <div class="pb-2 flex flex-row justify-end">
        <Show
          when={active()}
          fallback={<Button label="play" onclick={() => set_active(true)} />}
        >
          <Button label="pause" onclick={() => set_active(false)} />
        </Show>
      </div>

      <canvas
        class="w-full aspect-square border border-muted rounded rendering-pixelated"
        ref={canvas_ref}
      />

      <div class="flex flex-col gap-2">
        <div class="flex flex-row items-center">
          <DualInput
            label="m"
            from={1}
            to={6}
            step={1}
            value={m}
            set_value={set_m}
          />
          <DualInput
            label="S"
            from={1}
            to={5}
            step={1}
            value={S}
            set_value={set_S}
          />
        </div>
      </div>
    </div>
  );
}

function Component6_1() {
  let canvas_ref: HTMLCanvasElement | undefined;

  const [active, set_active] = createSignal<boolean>(false);

  const [m, set_m] = createSignal<number>(3);
  const [t, set_t] = createSignal<number>(25);
  const [S, set_S] = createSignal<number>(2);
  const [o, set_o] = createSignal<boolean>(false);

  const manager = new Manager();

  createEffect(() => {
    if (!canvas_ref) return;
    manager.link_canvas(canvas_ref);
  });

  const tick = () => {
    if (active())
      manager.update_canvas((wasm) => wasm.task_6_1(m(), t(), S(), o()));
  };

  createEffect(() => {
    if (!canvas_ref) return;

    const callback = (wasm_manager: WasmManager) =>
      wasm_manager.task_6_1(m(), t(), S(), o());

    manager.update_canvas(callback);
  });

  createEffect(() => {
    const interval = setInterval(tick, 100);
    onCleanup(() => clearInterval(interval));
  });

  return (
    <div>
      <div class="pb-2 flex flex-row justify-between">
        <Show
          when={o()}
          fallback={
            <Button label="show electrons" onclick={() => set_o(true)} />
          }
        >
          <Button label="hide electrons" onclick={() => set_o(false)} />
        </Show>

        <Show
          when={active()}
          fallback={<Button label="play" onclick={() => set_active(true)} />}
        >
          <Button label="pause" onclick={() => set_active(false)} />
        </Show>
      </div>

      <canvas
        class="w-full aspect-square border border-muted rounded rendering-pixelated"
        ref={canvas_ref}
      />

      <div class="flex flex-col gap-2">
        <div class="flex flex-row items-center">
          <DualInput
            label="m"
            from={1}
            to={6}
            step={1}
            value={m}
            set_value={set_m}
          />
          <DualInput
            label="t"
            from={1}
            to={50}
            step={1}
            value={t}
            set_value={set_t}
          />
        </div>
        <DualInput
          label="S"
          from={1}
          to={5}
          step={1}
          value={S}
          set_value={set_S}
        />
      </div>
    </div>
  );
}

function Component6_2() {
  let canvas_ref: HTMLCanvasElement | undefined;

  const [active, set_active] = createSignal<boolean>(false);

  const [m, set_m] = createSignal<number>(3);
  const [t, set_t] = createSignal<number>(50);
  const [S, set_S] = createSignal<number>(2);
  const [c, set_c] = createSignal<number>(3);
  const [h, set_h] = createSignal<number>(10);
  const [s, set_s] = createSignal<number>(50);
  const [o, set_o] = createSignal<boolean>(false);

  const manager = new Manager();

  createEffect(() => {
    if (!canvas_ref) return;
    manager.link_canvas(canvas_ref);
  });

  const tick = () => {
    if (active())
      manager.update_canvas((wasm) =>
        wasm.task_6_2(m(), t(), c(), h(), s(), S(), o()),
      );
  };

  createEffect(() => {
    if (!canvas_ref) return;

    const callback = (wasm_manager: WasmManager) =>
      wasm_manager.task_6_2(m(), t(), c(), h(), s(), S(), o());

    manager.update_canvas(callback);
  });

  createEffect(() => {
    const interval = setInterval(tick, 100);
    onCleanup(() => clearInterval(interval));
  });

  return (
    <div>
      <div class="pb-2 flex flex-row justify-between">
        <Show
          when={o()}
          fallback={
            <Button label="show electrons" onclick={() => set_o(true)} />
          }
        >
          <Button label="hide electrons" onclick={() => set_o(false)} />
        </Show>

        <Show
          when={active()}
          fallback={<Button label="play" onclick={() => set_active(true)} />}
        >
          <Button label="pause" onclick={() => set_active(false)} />
        </Show>
      </div>

      <canvas
        class="w-full aspect-square border border-muted rounded rendering-pixelated"
        ref={canvas_ref}
      />

      <div class="flex flex-col gap-2">
        <div class="flex flex-row items-center">
          <DualInput
            label="m"
            from={1}
            to={6}
            step={1}
            value={m}
            set_value={set_m}
          />
          <DualInput
            label="t"
            from={1}
            to={50}
            step={1}
            value={t}
            set_value={set_t}
          />
        </div>
        <div class="flex flex-row items-center">
          <DualInput
            label="c"
            from={1}
            to={20}
            step={1}
            value={c}
            set_value={set_c}
          />
          <DualInput
            label="h"
            from={1}
            to={50}
            step={1}
            value={h}
            set_value={set_h}
          />
          <DualInput
            label="s"
            from={1}
            to={50}
            step={1}
            value={s}
            set_value={set_s}
          />
        </div>
        <DualInput
          label="S"
          from={1}
          to={5}
          step={1}
          value={S}
          set_value={set_S}
        />
      </div>
    </div>
  );
}

export default function TaskSix() {
  return (
    <PageContainer>
      <PathButton index={0} title="Home" subtitle="" href="/" />
      <Divider />

      <Break />

      <MutedHeader>Task Six</MutedHeader>

      <Header>Electron diffraction</Header>

      <Break count={2} />

      <Text>
        for this task, the diffraction of electrons needs to be modeled, which
        requires a model of electrons as waves, or for this model, density
        clouds, such that instead of defining an electron as a point in space,
        we define the electron as a "cloud" taking the full volume of its
        container, and such that the density of a portion of the cloud
        represents the probability of the electron being in that specific place,
        higher density regions representing higher probability for the electron
        to exist there at that given point in time
      </Text>
      <Text>
        the reason for this model is due to the earlier covered random walk
        topic, every unit time the electron moves in an unpredictable manner,
        and observing the electron at every time frame is implausible, so
        instead of drawing a massive tree diagram of cascading node positions,
        we can calculate them under the hood, then generalize them as a density
        cloud
      </Text>

      <Break />

      <Text>
        below are some different representations to help visualize it, including
        the normal physical representation, a wave representation, and a
        1-dimensional density cloud representation, continuing from here we will
        be working with 2d and 3d density clouds
      </Text>

      <Break />
      <TaskVisual task={6} filename="electron.svg" />
      <Break count={2} />

      <Text>
        I'm going about modeling these electron clouds via a statistical model,
        in which at any point in time an electron has a variable number of
        "states", in which it could exist, and going to the next point in time,
        each state generates <Latex>m</Latex> new states, this is akin to the
        random walk, accept in this case we are doing multiple jumps at every
        point. This process will continue for <Latex>s</Latex> steps
      </Text>
      <Text>
        to avoid the memory and performance issues of this exponential model, i
        can keep track of the local probability of each state occurring from the
        origin, then cutoff branches once a sufficiently low probability is
        reached
      </Text>

      <Break />
      <TaskVisual task={6} filename="branch.svg" />
      <Break />

      <Text>
        since the nodes don't move, velocity of the electron as a whole is
        represented by the spreading out of the nodes at each step{" "}
        <Latex>s_n</Latex>, if a simple linear distribution for the angle of the
        random walk was used, the electron would essentially have a velocity
        with a fixed magnitude and random direction which for some simulations
        might be ideal, but for this model, i would like the electron to travel
        in a specific direction, so instead i can use a non-linear distribution
        for the angle, such as a Gaussian distribution where there's an
        overwhelming probability (<Latex>\approx 1</Latex>) for an offset angle
        of 0, meaning it keeps its direction, then the probability sharply falls
        off as the angle increases and decreases, which probabilistically keeps
        the electron traveling in the roughly same direction
      </Text>

      <Break />

      <Text>
        for the purposes required, the "probability" distribution used
        technically peaks at <Latex>1</Latex>, unlike a statistical distribution
        like a Normal which totals to <Latex>1</Latex>, meaning this
        distribution sums to over <Latex>1</Latex>, and so cant be considered a
        proper statistical model, but since each new branch multiplies its
        generated "random" value by the one before to get its "local
        probability", if the highest likelihood wasn't <Latex>1</Latex>, then
        the branches would quickly spiral below the probability threshold, which
        is unrealistic, and breaks the model for high values of <Latex>s</Latex>
      </Text>

      <Break />
      <TaskVisual task={6} filename="gaussian.png" />
      <Break />

      <Text>
        to avoid the memory and computational costs of this algorithm, which
        using the earlier <Latex>m</Latex> and <Latex>s</Latex> values results
        in <Latex>O(m^s)</Latex> for runtime and space complexity, we can keep
        track of a "state probability" in each node which is the accumulation of
        probabilities since the origin in that branch, then stop branching once
        it falls bellow a certain probability threshold
      </Text>
      <Text>
        another major optimization that can be made is using a spacial hashmap,
        this can bring the time and space complexity to <Latex>O(a)</Latex>{" "}
        where <Latex>a</Latex> is the number of pixels on the canvas, it works
        by building a hashmap with a key type of <Latex>(u32, u32)</Latex> and
        value type of a node, then for each node in the current outer branch,
        you can round the floating point <Latex>x</Latex> and <Latex>y</Latex>{" "}
        values, to use for the nodes key then check the hashmap if another
        already exists within that spacial position, if not insert the node, if
        one does exist then you can sum add the phase and amplitude to the
        existing node, by the end the hashmap contains a maximum of{" "}
        <Latex>a</Latex> nodes that hold the cumulative data of the original
        branch, then it can be simply converted back into the original format to
        prepare for the next step, this is at the obvious cost of losing
        floating point positional data on nodes, which isn't too much of an
        issue, since they will be rounded at the end anyways to render
      </Text>

      <Break />

      <Text>
        using this method, and a few more alterations such as decreasing the
        opacity of older nodes every frame, and calculating the next step every
        frame, we get the result shown bellow, where <Latex>m</Latex> is the
        number of branches per node, due to the algorithms complexity, it may
        run poorly on some machines for higher values of <Latex>m</Latex>, so a
        second parameter <Latex>S</Latex> was added such that the grid of pixels
        in the canvas is divided by <Latex>S</Latex> then upscaled on render,
        resulting on points being drawn further apart, so losing detail, but
        running much faster for larger values of <Latex>S</Latex>
      </Text>
      <Text>
        further more for more complex simulations like these, i will be
        implementing a play/pause button instead of automatically running them
        to reduce background stuttering in the website
      </Text>

      <Break />

      <Component6_0 />

      <Break />

      <Text>
        whilst the model above does form wave-like patterns, this is mainly due
        to some finetuning, this model doesn't inherently model electron
        probability clouds due to not taking into account the amplitude and
        phase of each node, as well as having an arbitrary opacity drop off for
        older nodes which is unrealistic
      </Text>

      <Break />

      <Text>
        to fix this we can use a technique called tiled histogram binning, in
        which instead of plotting all the nodes as individual points, we split
        the canvas into an arbitrary number of tiles, since the canvases used
        here are square it will be <Latex>n \times n</Latex> square tiles, in
        which each tile has a filled color that is calculated by all the nodes
        that have positions that lay inside of it, its typically used as a
        method for averaging large data, but by altering the color calculation
        function of the tiles we can account for phase and amplitude by running
        multiple passes
      </Text>
      <Text>
        another interesting idea with tiled binning is changing how the nodes
        used in each tile are weighted, for example its not strictly necessary
        to have each tile only use the nodes inside of its boundary, we could
        instead, for every tile and every node, calculate the distance between
        the node and the center of the tile and use this as a weighting for how
        much influence the node has on the tiles value, Manhattan distance is
        also an optimization that could be made here, since calculating
        millions-billions of squares and square roots is slow, especially so on
        the single CPU thread i have access to for these demonstrations
      </Text>

      <Break />
      <TaskVisual task={6} filename="binning.svg" />
      <Break />

      <Text>
        using this, we can add a new parameter <Latex>t</Latex> such that the
        grid is <Latex>t \times t</Latex> in size, and a toggle to display the
        electron nodes on top to help visualize
      </Text>

      <Break />

      <Component6_1 />

      <Break />

      <Text>
        with this model in place, all we need to do is introduce some sort of
        obstacle, linking back to the task that obstacle would be a diffraction
        grating in the form of the atomic layers in a graphite structure, for
        simplicity we can just model a simple diffraction grating based on
        rectangles, with spacings proportional to that of the ratio of graphite
        layer spacings to electron size
      </Text>

      <Break />

      <Component6_2 />
    </PageContainer>
  );
}
