import "chart.js/auto";
import { createEffect, createSignal, For, onCleanup, Show } from "solid-js";
import type { WasmManager } from "../../rust-wasm/pkg/manager";
import { Button, DualInput } from "../components/components";
import { Link, Text } from "../components/content";
import { Header, MutedHeader } from "../components/headers";
import {
  Break,
  Credit,
  Divider,
  Latex,
  PageContainer,
  PathButton,
  TaskVisual,
} from "../components/page-utils";
import { Manager } from "../logic/manager";

const PLANES = ["z = 0", "y = 0", "x = 0"];

function Component10_0() {
  let canvas_ref: HTMLCanvasElement | undefined;

  const [n, set_n] = createSignal<number>(3);
  const [l, set_l] = createSignal<number>(2);
  const [m, set_m] = createSignal<number>(-2);
  const [plane, set_plane] = createSignal<number>(0);
  const [Z, set_Z] = createSignal<number>(1);
  const [A, set_A] = createSignal<number>(1);
  const [zoom, set_zoom] = createSignal<number>(1);
  const [more, set_more] = createSignal<boolean>(false);

  const manager = new Manager();

  createEffect(() => {
    if (l() > n() - 1) set_l(n() - 1);
  });
  createEffect(() => {
    const bound = l();
    if (m() > bound) set_m(bound);
    if (m() < -bound) set_m(-bound);
  });

  createEffect(() => {
    if (!canvas_ref) return;
    manager.link_canvas(canvas_ref);
  });

  createEffect(() => {
    if (!canvas_ref) return;
    const callback = (wasm_manager: WasmManager) =>
      wasm_manager.task_10_0(n(), l(), m(), Z(), A(), plane(), zoom());
    manager.update_canvas(callback);
  });

  return (
    <div>
      <div class="pb-2 flex flex-row justify-between items-center">
        <Button
          label={PLANES[plane()]}
          onclick={() => set_plane((plane() + 1) % 3)}
        />
      </div>

      <canvas
        class="w-full aspect-square border border-muted rounded rendering-pixelated"
        ref={canvas_ref}
      />

      <div class="flex flex-col gap-2">
        <div class="flex flex-row items-center">
          <DualInput
            label="n"
            from={1}
            to={8}
            step={1}
            value={n}
            set_value={set_n}
          />
          <DualInput
            label="l"
            from={0}
            to={n() - 1}
            step={1}
            value={l}
            set_value={set_l}
          />
          <DualInput
            label="m"
            from={-l()}
            to={l()}
            step={1}
            value={m}
            set_value={set_m}
          />
        </div>

        <div class="flex flex-row justify-end">
          <Button
            label={more() ? "hide" : "more"}
            onclick={() => set_more(!more())}
          />
        </div>

        <Show when={more()}>
          <div class="flex flex-row items-center">
            <DualInput
              label="Z"
              from={1}
              to={20}
              step={1}
              value={Z}
              set_value={set_Z}
            />
            <DualInput
              label="A"
              from={1}
              to={40}
              step={1}
              value={A}
              set_value={set_A}
            />
            <DualInput
              label="\text{zoom}"
              from={0.3}
              to={3}
              step={0.1}
              value={zoom}
              set_value={set_zoom}
            />
          </div>
        </Show>
      </div>
    </div>
  );
}

function Component10_1() {
  let canvas_ref: HTMLCanvasElement | undefined;

  const [active, set_active] = createSignal<boolean>(true);
  const [n, set_n] = createSignal<number>(3);
  const [l, set_l] = createSignal<number>(2);
  const [m, set_m] = createSignal<number>(0);
  const [Z, set_Z] = createSignal<number>(1);
  const [A, set_A] = createSignal<number>(1);
  const [points, set_points] = createSignal<number>(120000);
  const [gain, set_gain] = createSignal<number>(2);
  const [zoom, set_zoom] = createSignal<number>(1);
  const [more, set_more] = createSignal<boolean>(false);

  const [yaw, set_yaw] = createSignal<number>(0.6);
  const [pitch, set_pitch] = createSignal<number>(0.35);

  const manager = new Manager();

  createEffect(() => {
    if (l() > n() - 1) set_l(n() - 1);
  });
  createEffect(() => {
    const bound = l();
    if (m() > bound) set_m(bound);
    if (m() < -bound) set_m(-bound);
  });

  createEffect(() => {
    if (!canvas_ref) return;
    manager.link_canvas(canvas_ref);
  });

  const draw = () => {
    const callback = (wasm_manager: WasmManager) =>
      wasm_manager.task_10_1(
        n(),
        l(),
        m(),
        Z(),
        A(),
        points(),
        zoom(),
        yaw(),
        pitch(),
        gain(),
      );
    manager.update_canvas(callback);
  };

  createEffect(() => {
    if (!canvas_ref) return;
    draw();
  });

  createEffect(() => {
    let frame = requestAnimationFrame(function loop() {
      if (active()) {
        set_yaw((y) => (y + 0.012) % (Math.PI * 2));
        draw();
      }
      frame = requestAnimationFrame(loop);
    });
    onCleanup(() => cancelAnimationFrame(frame));
  });

  let dragging = false;
  let last_x = 0;
  let last_y = 0;

  const on_down = (e: PointerEvent) => {
    dragging = true;
    last_x = e.clientX;
    last_y = e.clientY;
    (e.currentTarget as HTMLCanvasElement).setPointerCapture(e.pointerId);
  };
  const on_move = (e: PointerEvent) => {
    if (!dragging) return;
    set_yaw((y) => y + (e.clientX - last_x) * 0.008);
    set_pitch((p) =>
      Math.max(-1.5, Math.min(1.5, p + (e.clientY - last_y) * 0.008)),
    );
    last_x = e.clientX;
    last_y = e.clientY;
  };
  const on_up = () => {
    dragging = false;
  };

  return (
    <div>
      <div class="pb-2 flex flex-row justify-between items-center">
        <Show
          when={active()}
          fallback={<Button label="play" onclick={() => set_active(true)} />}
        >
          <Button label="pause" onclick={() => set_active(false)} />
        </Show>
      </div>

      <canvas
        class="w-full aspect-square border border-muted rounded rendering-pixelated touch-none cursor-grab"
        ref={canvas_ref}
        onpointerdown={on_down}
        onpointermove={on_move}
        onpointerup={on_up}
        onpointercancel={on_up}
      />

      <div class="flex flex-col gap-2">
        <div class="flex flex-row items-center">
          <DualInput
            label="n"
            from={1}
            to={8}
            step={1}
            value={n}
            set_value={set_n}
          />
          <DualInput
            label="l"
            from={0}
            to={n() - 1}
            step={1}
            value={l}
            set_value={set_l}
          />
          <DualInput
            label="m"
            from={-l()}
            to={l()}
            step={1}
            value={m}
            set_value={set_m}
          />
        </div>

        <div class="flex flex-row justify-end">
          <Button
            label={more() ? "hide" : "more"}
            onclick={() => set_more(!more())}
          />
        </div>

        <Show when={more()}>
          <div class="flex flex-row items-center">
            <DualInput
              label="Z"
              from={1}
              to={20}
              step={1}
              value={Z}
              set_value={set_Z}
            />
            <DualInput
              label="A"
              from={1}
              to={40}
              step={1}
              value={A}
              set_value={set_A}
            />
            <DualInput
              label="\text{pts}"
              from={20000}
              to={400000}
              step={20000}
              value={points}
              set_value={set_points}
            />
          </div>
          <div class="flex flex-row items-center">
            <DualInput
              label="\text{gain}"
              from={0.2}
              to={4}
              step={0.1}
              value={gain}
              set_value={set_gain}
            />
            <DualInput
              label="\text{zoom}"
              from={0.3}
              to={3}
              step={0.1}
              value={zoom}
              set_value={set_zoom}
            />
          </div>
        </Show>
      </div>
    </div>
  );
}

export default function TaskTen() {
  return (
    <PageContainer>
      <PathButton index={0} title="Home" subtitle="" href="/" />
      <Divider />

      <Break />

      <MutedHeader>Task ten</MutedHeader>

      <Header>Hydrogenic orbitals</Header>

      <Break count={2} />

      <Text>
        hydrogenic atoms are those with a single electron, with the only neutral
        one being hydrogen, the rest are ions that lost enough electrons to
        leave only one, giving their nucleus a charge of <Latex>+Ze</Latex>
      </Text>

      <Break />

      <Text>
        the Schrödinger equation, and its solutions can be used to model these
        hydrogenic atoms position probabilities{" "}
        <Latex>\lvert \Psi \rvert ^2</Latex>
      </Text>
      <Text>
        although derivations of these equations are outside the scope of this
        task
      </Text>

      <Break />

      <Text>
        the first model is a planar slice through{" "}
        <Latex>\lvert \Psi \rvert ^2</Latex>, with a toggle for the dimension
        being sliced in, centered at <Latex>x, y, z = 0</Latex>
      </Text>

      <Break />

      <Component10_0 />

      <Break />

      <Text>
        the slice is built over two passes, because the vectors need to be
        computed fully, to find the maximum values to use to sample them all
        between <Latex>0</Latex> and <Latex>1</Latex>, which gets used in the
        colourbar
      </Text>
      <Text>
        <Credit
          label="On the cover: Hydrogen orbitals"
          href="https://chalkdustmagazine.com/regulars/on-the-cover/on-the-cover-hydrogen-orbitals/"
          author="Tom Rivlin"
          task={10}
        />{" "}
        was helpful in the visualization, and research direction for this model
      </Text>

      <Break count={2} />

      <Text>
        there are numerous ways to plot <Latex>3</Latex> dimensional data on a
        flat <Latex>2</Latex> dimensional canvas, so for plotting the whole the{" "}
        <Latex>3</Latex>d distribution, i had multiple options to pick from
      </Text>
      <Text>the main options i looked into were</Text>
      <Break />
      <Text>
        marching cubes: this was the obvious choice, a highly robust algorithm
        for visualizing <Latex>3</Latex>d meshes, but the issue i had with it
        was its hard boundaries, there's no fading which is particularly
        important for a very gradient like model like the probability
        distribution
      </Text>
      <Break />
      <Text>
        volume ray-marching: this one would most likely produce the best, and
        highest quality results, but its ray-traced and far too slow for my
        CPU-bound single threaded rust WASM to handle
      </Text>
      <Break />
      <Text>
        slice stack: this one would just involve computing the slice like from
        the first model, and doing it repeatedly and stacking them in a{" "}
        <Latex>3</Latex>d scene, whilst very cheap, its quality is quite low
      </Text>
      <Break />
      <Text>
        Monte-Carlo point cloud: this is the option i went with, you sample a
        set number of <Latex>3</Latex>d points with their probability being{" "}
        <Latex>\propto \lvert \Psi \rvert ^2</Latex>, and you plot them, this
        allows you to naturally see dense areas and looks nice, as well as being
        quite performant
      </Text>

      <Break />

      <Component10_1 />

      <Break />

      <Text>
        the points being plotted are chosen from the{" "}
        <Latex>\lvert \Psi \rvert ^2</Latex> distribution, and typically to do
        that you would need to calculate the inverse distribution in all
        dimensions, which again far beyond the scope of the topic, and i didn't
        find much online for it, so i went with an alternative method called{" "}
        <Link
          href="https://en.wikipedia.org/wiki/Rejection_sampling"
          label="rejection sampling"
        />
        , and is the method used in similar visuals done by other people
      </Text>

      <Break />

      <Text>
        orthographic perspective was also incorporated instead of perspective,
        this is mainly due to nicer visuals (avoids symmetric orbitals looking
        asymmetric etc), and again that seems to be the status quo
      </Text>
    </PageContainer>
  );
}
