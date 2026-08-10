import "chart.js/auto";
import { Line, Scatter } from "solid-chartjs";
import { createMemo, createSignal } from "solid-js";
import { DualInput } from "../components/components";
import { Link, Quote, Text } from "../components/content";
import { Header, MutedHeader } from "../components/headers";
import {
  Break,
  Divider,
  Latex,
  PageContainer,
  PathButton,
  TaskVisual,
} from "../components/page-utils";

function ModelProbabilityDensity() {
  const [n, set_n] = createSignal(1);
  const L = 10;

  const values = createMemo(() => {
    const current_n = n();

    const count = Math.max(300 * current_n, 5000);

    const step = L / count;

    return [...Array(count + 1).keys()].map((i) => {
      const x = i * step;
      const density =
        (2 / L) * Math.pow(Math.sin((current_n * Math.PI * x) / L), 2);

      return {
        x: x,
        y: density,
      };
    });
  });

  const data = createMemo(() => ({
    datasets: [
      {
        label: `n = ${n()}`,
        data: values(),
        backgroundColor: "#3b82f6",
        borderColor: "#3b82f6",
        showLine: true,
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  }));

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 },
    scales: {
      x: {
        type: "linear",
        title: {
          display: true,
          text: "displacement (Å)",
        },
        min: 0,
        max: L,
      },
      y: {
        title: {
          display: true,
          text: "probability density (×10¹⁰ m⁻¹)",
        },
        min: 0,
        suggestedMax: 0.25,
      },
    },
  };

  return (
    <div>
      <div style={{ height: "300px" }}>
        <Scatter data={data()} options={options} />
      </div>
      <div class="flex flex-row mt-4">
        <DualInput
          label="n"
          from={1}
          to={25}
          step={1}
          value={n}
          set_value={set_n}
        />
      </div>
    </div>
  );
}

function ModelEnergySpectrum() {
  const [L, set_L] = createSignal(10);
  const [m, set_m] = createSignal(1);

  const values = createMemo(() => {
    const current_L = L();
    const current_m = m();
    const constant = 37.6;

    return [...Array(10).keys()].map((i) => {
      const n = i + 1;
      const energy =
        (constant * Math.pow(n, 2)) / (current_m * Math.pow(current_L, 2));

      return {
        x: n,
        y: energy,
      };
    });
  });

  const data = createMemo(() => ({
    datasets: [
      {
        label: `Energy vs n`,
        data: values(),
        backgroundColor: "#ef4444",
        borderColor: "#ef4444",
        showLine: true,
        pointRadius: 4,
        borderWidth: 2,
        borderDash: [5, 5],
      },
    ],
  }));

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 },
    scales: {
      x: {
        type: "linear",
        title: {
          display: true,
          text: "quantum number (n)",
        },
        min: 0,
        max: 11,
        ticks: {
          stepSize: 1,
        },
      },
      y: {
        title: {
          display: true,
          text: "Energy (eV)",
        },
        min: 0,
      },
    },
  };

  return (
    <div>
      <div style={{ height: "300px" }}>
        <Scatter data={data()} options={options} />
      </div>
      <div class="flex flex-col gap-4 mt-4">
        <DualInput
          label="L"
          from={1}
          to={20}
          step={0.5}
          value={L}
          set_value={set_L}
        />
        <DualInput
          label="m"
          from={0.1}
          to={5}
          step={0.1}
          value={m}
          set_value={set_m}
        />
      </div>
    </div>
  );
}

export default function TaskSeven() {
  return (
    <PageContainer>
      <PathButton index={0} title="Home" subtitle="" href="/" />
      <Divider />

      <Break />

      <MutedHeader>Task Seven</MutedHeader>

      <Header>Particle-in-a-box</Header>

      <Break count={2} />

      <Text>
        the Particle-in-a-box model is a model that describes the movement of a
        particle in space, specifically bounded between impenetrable barriers,
        for this task we will be using the <Latex>1</Latex> dimensional
        solution, assuming an electron is on a line such that given its position
        is <Latex>x</Latex>, and the boundary positions are <Latex>0</Latex> and{" "}
        <Latex>L</Latex>, then <Latex>{"0 < x < L"}</Latex>
      </Text>

      <Break />

      <TaskVisual task={7} filename="electron-on-line.svg" />

      <Break />

      <Text>
        from previous tasks, we have established that particles at this size
        tend to match the model of random walk, so extending that logic to this
        simulation is a starting point
      </Text>
      <Text>
        lets take a particle with position <Latex>x</Latex>, where initially{" "}
        <Latex>x = 0</Latex>, and each step from <Latex>1..N</Latex>, the
        particle will move either <Latex>+1</Latex> or <Latex>-1</Latex>{" "}
        randomly, we will only focus on the cumulative result as{" "}
        <Latex>N</Latex> increases rather than the process itself
      </Text>

      <Break />

      <TaskVisual task={7} filename="random-walk.svg" />

      <Break />

      <Text>
        there are two main things that stand out from this model, for starters
        the range of possible outcomes is quantized, due to both the fact that
        the magnitude of movement is fixed, and because this model oscillates
        phase with each even value of <Latex>N</Latex> resulting in only even
        possible resulting positions, and vice versa with odd values of{" "}
        <Latex>N</Latex>
      </Text>
      <Text>
        the second is the probability distribution of these final values, lets
        take <Latex>N = 2</Latex>, it is clearly more likely for the result to
        end in <Latex>0</Latex> net displacement rather than{" "}
        <Latex>\pm 2</Latex>, and this trend continues as <Latex>N</Latex>{" "}
        increases
      </Text>
      <Text>
        if we where to take an arbitrarily large value of <Latex>N</Latex>, with
        an arbitrarily small step size, and plot the probability against
        resulting displacement, we would get a graph similar to this bell curve
        shown below, the importance of this will be more clear later
      </Text>

      <Break />

      <TaskVisual task={7} filename="random-probability.svg" />

      <Break />

      <Text>
        everything discussed so far is essentially my mental reasoning for the
        upcoming probability wave representation of particle-in-a-box which is
        the physics standard, using wavefunctions calculated by the Schrödinger
        equation
      </Text>
      <Text>
        whether or not these two models are some derivation of each other or
        whether they happen to share similarities by happenstance is beyond my
        wanting of research and is not really the focus of this task, so i will
        stick with it for a baseline mental model of the first principles
      </Text>

      <Break count={2} />

      <Quote
        label="wikipedia"
        href="https://en.wikipedia.org/wiki/Schr%C3%B6dinger_equation"
      >
        The Schrödinger equation is a partial differential equation that governs
        the wave function of a non-relativistic quantum-mechanical system.
        <br />
        ...Conceptually, the Schrödinger equation is the quantum counterpart of
        Newton's second law in classical mechanics. Given a set of known initial
        conditions, Newton's second law makes a mathematical prediction as to
        what path a given physical system will take over time.
      </Quote>

      <Break />

      <Text>
        the Schrödinger equation is used to evaluate a wavefunction for a
        particle which corresponds to a probability amplitude wave, from which
        you can derive the probability density wave to calculate the probability
        of the particle being in specific positions
      </Text>
      <Text>
        the formula (specifically relating to 1d particle-in-a-box) is given as
      </Text>

      <Break />

      <Latex block>
        {
          "\\Large \\Psi_n(x) = \\sqrt{\\dfrac{2}{L}} \\sin \\begin{pmatrix} \\dfrac{n \\pi x}{L} \\end{pmatrix}"
        }
      </Latex>

      <Break />

      <Text>
        this evaluates a standing wave such that <Latex>{"\\Psi(0) = 0"}</Latex>{" "}
        and <Latex>{"\\Psi(L) = 0"}</Latex>, with <Latex>n</Latex> more nodes
        between them, this makes <Latex>x = 0</Latex> and <Latex>x = L</Latex>{" "}
        the boundary positions, and also shows the fact that there are an
        infinite number of solutions, since <Latex>n</Latex> can be any number
        in <Latex>{"\\Z^+"}</Latex>
      </Text>

      <Break />

      <TaskVisual task={7} filename="amplitude-waves.svg" />

      <Break />

      <Text>
        each wavefunction computed is a valid interpretation of the
        probabilities of the particle's positions between the boundaries, the
        one you use is determined by the energy of the particle, where{" "}
        <Latex>{"E \\propto n^2"}</Latex>
      </Text>

      <Break />

      <Text>
        currently this wavefunction cant be used to directly read probability,
        this specific wavefunction is a complex function composed of the
        particles phase and position as complex values, the particles phase
        comes from its wave-like interpretation which is applied due to the de
        Broglie wavelength and the particles size, this explains the inclusion
        of negative values due to phase
      </Text>
      <Text>
        to convert this wavefunction into a probability density wave, we can
        simply take the square of its absolute, this relationship is simply
        defined as a "postulate of quantum mechanics", known as the{" "}
        <Link
          label="Born rule"
          href="https://en.wikipedia.org/wiki/Born_rule"
        />
      </Text>

      <Break />

      <Latex block>{"\\Large P_n(x) = \\lvert \\Psi_n(x) \\rvert ^2"}</Latex>
      <Latex block>
        {
          "\\Large P_n(x) = \\dfrac{2}{L} \\sin ^2 \\begin{pmatrix} \\dfrac{n \\pi x}{L} \\end{pmatrix}"
        }
      </Latex>

      <Break />

      <Text>
        plotting this again we get usable probability density graphs for the
        position of the particle, similarly to distributions like the Normal
        distribution, the probability of the particle being between{" "}
        <Latex>x_0</Latex> and <Latex>x_1</Latex> is the area under the curve
        between those positions, in other words it is{" "}
        <Latex>{"\\displaystyle \\int_{x_0}^{x_1} P_n(x)"}</Latex>, using an
        arbitrarily small delta, <Latex>{"h \\approx 0"}</Latex>, we can
        simplify this such that the probability of a particle being in a
        position <Latex>x</Latex> simply becomes <Latex>hP_n(x)</Latex>
      </Text>

      <Break />

      <TaskVisual task={7} filename="probability-waves.svg" />

      <Break />

      <Text>
        with this knowledge we can plot probability densities{" "}
        <Latex>{"\\lvert \\Psi \\rvert ^2"}</Latex> vs displacement{" "}
        <Latex>x</Latex>, with a variable slider <Latex>n</Latex> relating to
        the number of nodes in the wavefunction, as stated earlier{" "}
        <Latex>{"E \\propto n^2"}</Latex>
      </Text>

      <Break />

      <ModelProbabilityDensity />

      <Break />

      <Text>
        as mentioned earlier the quantum number <Latex>n</Latex> is directly
        linked to the Energy <Latex>E</Latex> of the particle, specifically it
        follows the formula given below with <Latex>m</Latex> being the mass of
        the particle, as you can see <Latex>E</Latex> grows quadratically to{" "}
        <Latex>n</Latex>, another observation that can be made is that since{" "}
        <Latex>n</Latex> is quantized such that <Latex>{"n \\in Z^+"}</Latex>,
        and <Latex>E</Latex> is computed from it, then the possible energy
        states of the particle is also quantized, not only that but the
        differences between states <Latex>{"\\Delta E"}</Latex> grows as{" "}
        <Latex>n</Latex> increases
      </Text>

      <Break />

      <Latex block>{"\\Large E_n = \\dfrac{n^2 h^2}{8 m L^2}"}</Latex>

      <Break />

      <TaskVisual task={7} filename="energy-quadratic.svg" />

      <Break />

      <Text>
        below is an interactive graph of this <Latex>E</Latex> against{" "}
        <Latex>n</Latex> relationship, with sliders to change the mass the
        particle <Latex>m</Latex> and length between boundaries <Latex>L</Latex>
        , both in arbitrary units
      </Text>

      <Break />

      <ModelEnergySpectrum />

      <Break />

      <Text>
        knowing the particles position is only one half of the story, to get the
        full picture ideally you would want to also calculate its momentum{" "}
        <Latex>p</Latex>, unfortunately at the quantum scale, the more precisely
        you measure one, the less precisely you can measure the other, this is
        known as the{" "}
        <Link
          label="uncertainty principle"
          href="https://en.wikipedia.org/wiki/Uncertainty_principle"
        />
        , and the formula is shown below
      </Text>

      <Break />

      <Latex block>
        {"\\Large \\Delta x \\Delta p \\ge \\dfrac{\\hbar}{2}"}
      </Latex>

      <Break />

      <Text>
        this shows that to measure a smaller change in x (
        <Latex>{"\\Delta x \\downarrow"}</Latex>) you must make the change in
        <Latex>p</Latex> measured larger (<Latex>{"\\Delta p \\uparrow"}</Latex>
        ), below the threshold point <Latex>{"\\dfrac{1}{2} \\hbar"}</Latex>,
        and vice versa, you cant measure both to a large precision at the same
        time
      </Text>

      <Break />

      <Text>
        we can derive this formula by calculating the uncertainty of position
        and momentum then combining them, in general uncertainty from a
        probability perspective is defined as{" "}
        <Latex>
          {
            "\\Delta A = \\sqrt{\\langle A ^2 \\rangle - \\langle A \\rangle ^2}"
          }
        </Latex>
        , so for position and momentum we get
      </Text>

      <Break />

      <Latex block>
        {
          "\\Large \\Delta x = \\sqrt{\\langle x ^2 \\rangle - \\langle x \\rangle ^2}"
        }
      </Latex>

      <Break />

      <Latex block>
        {
          "\\Large \\Delta p = \\sqrt{\\langle p ^2 \\rangle - \\langle p \\rangle ^2}"
        }
      </Latex>

      <Break />

      <Text>
        starting with position, we first need to calculate the average position{" "}
        <Latex>{"\\langle x \\rangle"}</Latex>, average in this case meaning the
        mean over a large set, finding this is simple enough, just by using a
        weighted mean
      </Text>

      <Break />

      <Latex block>
        {"\\Large \\langle x \\rangle =  \\int _0 ^L x P_n(x) dx"}
      </Latex>

      <Break />

      <Latex block>
        {
          "\\Large \\langle x \\rangle = \\int _0 ^L x \\lvert \\Psi _n (x) \\rvert ^2 dx"
        }
      </Latex>

      <Break />

      <Text>
        since <Latex>n</Latex> is always an integer, this simplifies to{" "}
        <Latex>{"\\dfrac{1}{2} L"}</Latex>
      </Text>

      <Break />

      <Latex block>{"\\Large \\langle x \\rangle = \\dfrac{1}{2} L"}</Latex>

      <Break />

      <Text>
        similarly for <Latex>{"\\langle x^2 \\rangle"}</Latex>, we can compute a
        weighted average, just using <Latex>x^2</Latex> as the weight instead
      </Text>

      <Break />

      <Latex block>
        {"\\Large \\langle x^2 \\rangle =  \\int _0 ^L x ^2 P_n(x) dx"}
      </Latex>

      <Break />

      <Latex block>
        {
          "\\Large \\langle x^2 \\rangle = \\int _0 ^L x ^2 \\lvert \\Psi _n (x) \\rvert ^2 dx"
        }
      </Latex>

      <Break />

      <Text>
        filling these values into the uncertainty formula for position, we get
      </Text>

      <Break />

      <Latex block>
        {
          "\\Large \\Delta x = \\sqrt{\\int _0 ^L x ^2 \\lvert \\Psi _n (x) \\rvert ^2 dx - \\dfrac{L^2}{4}}"
        }
      </Latex>

      <Break />

      <Latex block>
        {
          "\\Large \\Delta x = \\dfrac{L}{2 \\pi n} \\sqrt{\\dfrac{\\pi ^2 n ^2}{3} - 2}"
        }
      </Latex>

      <Break />

      <Text>
        for momentum, we can say the average{" "}
        <Latex>{"\\langle p \\rangle"}</Latex> is <Latex>0</Latex> due to always
        moving back and forth between the boundaries
      </Text>
      <Text>
        and the average square momentum <Latex>{"\\langle p^2 \\rangle"}</Latex>
        , can be found using the <Latex>E_n</Latex> formula from earlier, as
        shown below
      </Text>

      <Break />

      <Latex block>{"\\Large E_n = \\dfrac{\\langle p^2 \\rangle}{2m}"}</Latex>

      <Break />

      <Latex block>{"\\Large \\langle p^2 \\rangle = 2m E_n"}</Latex>

      <Break />

      <Latex block>
        {"\\Large \\langle p^2 \\rangle = \\dfrac{n^2 \\pi ^2 \\hbar ^2}{L^2}"}
      </Latex>

      <Break />

      <Text>
        again using the uncertainty formula for the momentum, ignoring{" "}
        <Latex>{"\\langle p \\rangle"}</Latex> since its <Latex>0</Latex>, we
        just get
      </Text>

      <Break />

      <Latex block>{"\\Large \\Delta p = \\sqrt{\\langle p^2 \\rangle}"}</Latex>

      <Break />

      <Latex block>{"\\Large \\Delta p = \\dfrac{n \\pi \\hbar}{L}"}</Latex>

      <Break />

      <Text>
        combining these uncertainties similarly to how the original equation
        does we get
      </Text>

      <Break />

      <Latex block>
        {
          "\\Large \\Delta x \\Delta p = \\dfrac{L}{2 \\pi n} \\sqrt{\\dfrac{\\pi ^2 n ^2}{3} - 2} \\dfrac{n \\pi \\hbar}{L}"
        }
      </Latex>

      <Break />

      <Latex block>
        {
          "\\Large \\Delta x \\Delta p = \\dfrac{\\hbar}{2} \\sqrt{\\dfrac{\\pi ^2 n ^2}{3} - 2}"
        }
      </Latex>

      <Break />

      <Text>
        assuming the ground state <Latex>n = 1</Latex>, then we can further
        simplify to
      </Text>

      <Break />

      <Latex block>
        {
          "\\Large \\Delta x \\Delta p = \\dfrac{\\hbar}{2 } \\sqrt{\\dfrac{\\pi ^2 }{3} - 2}"
        }
      </Latex>

      <Break />

      <Latex block>{"\\Large \\Delta x \\Delta p \\approx 0.568 \\hbar"}</Latex>

      <Break />

      <Latex block>
        {"\\Large \\Delta x \\Delta p \\ge \\dfrac{1}{2} \\hbar"}
      </Latex>
    </PageContainer>
  );
}
