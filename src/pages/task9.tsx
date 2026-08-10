import "chart.js/auto";
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
import { createMemo, createSignal } from "solid-js";
import { Scatter } from "solid-chartjs";
import { DualInput } from "../components/components";

function FractionalWavelengthShift() {
  const [energy, set_energy] = createSignal(17.4);

  const alpha = () => energy() / 511;

  const fractional = (theta: number) =>
    alpha() * (1 - Math.cos(theta * (Math.PI / 180)));

  const points = createMemo(() => {
    const p = [];

    for (let theta = 0; theta <= 180; theta++) {
      p.push({ x: theta, y: fractional(theta) });
    }

    return p;
  });

  const data = createMemo(() => ({
    datasets: [
      {
        data: points(),
        borderColor: "#8b5cf6",
        backgroundColor: "#8b5cf6",
        showLine: true,
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  }));

  const options = createMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 },
    scales: {
      x: {
        type: "linear",
        title: {
          display: true,
          text: "theta",
        },
        min: 0,
        max: 180,
      },
      y: {
        title: {
          display: true,
          text: "fractional wavelength shift",
        },
        min: 0,
        max: fractional(180),
      },
    },
  }));

  return (
    <div>
      <div style={{ height: "300px" }}>
        <Scatter data={data()} options={options()} />
      </div>
      <div class="flex flex-col gap-4 mt-4">
        <DualInput
          label="E_p"
          from={1}
          to={1_000}
          step={1}
          value={energy}
          set_value={set_energy}
        />
      </div>
    </div>
  );
}

function RecoilVelocity() {
  const [energy, set_energy] = createSignal(17.4);

  const alpha = () => energy() / 511;

  const u = (theta: number) =>
    alpha() * (1 - Math.cos(theta * (Math.PI / 180)));

  const recoil = (theta: number) =>
    Math.sqrt(1 - 1 / Math.pow(1 + alpha() * (u(theta) / (1 + u(theta))), 2));

  const points = createMemo(() => {
    const p = [];

    for (let theta = 0; theta <= 180; theta++) {
      p.push({ x: theta, y: recoil(theta) });
    }

    return p;
  });

  const data = createMemo(() => ({
    datasets: [
      {
        data: points(),
        borderColor: "#8b5cf6",
        backgroundColor: "#8b5cf6",
        showLine: true,
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  }));

  const options = createMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 },
    scales: {
      x: {
        type: "linear",
        title: {
          display: true,
          text: "theta",
        },
        min: 0,
        max: 180,
      },
      y: {
        title: {
          display: true,
          text: "electron recoil velocity",
        },
        min: 0,
        max: recoil(180),
      },
    },
  }));

  return (
    <div>
      <div style={{ height: "300px" }}>
        <Scatter data={data()} options={options()} />
      </div>
      <div class="flex flex-col gap-4 mt-4">
        <DualInput
          label="E_p"
          from={1}
          to={1_000}
          step={1}
          value={energy}
          set_value={set_energy}
        />
      </div>
    </div>
  );
}

function RecoilAngle() {
  const [energy, set_energy] = createSignal(17.4);

  const alpha = () => energy() / 511;

  const angle = (theta: number) =>
    Math.atan(1 / ((1 + alpha()) * Math.tan((theta * (Math.PI / 180)) / 2))) *
    (180 / Math.PI);

  const points = createMemo(() => {
    const p = [];

    for (let theta = 0; theta <= 180; theta++) {
      p.push({ x: theta, y: angle(theta) });
    }

    return p;
  });

  const data = createMemo(() => ({
    datasets: [
      {
        data: points(),
        borderColor: "#8b5cf6",
        backgroundColor: "#8b5cf6",
        showLine: true,
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  }));

  const options = createMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 },
    scales: {
      x: {
        type: "linear",
        title: {
          display: true,
          text: "theta",
        },
        min: 0,
        max: 180,
      },
      y: {
        title: {
          display: true,
          text: "electron recoil angle",
        },
        min: 0,
        max: angle(0),
      },
    },
  }));

  return (
    <div>
      <div style={{ height: "300px" }}>
        <Scatter data={data()} options={options()} />
      </div>
      <div class="flex flex-col gap-4 mt-4">
        <DualInput
          label="E_p"
          from={1}
          to={1_000}
          step={1}
          value={energy}
          set_value={set_energy}
        />
      </div>
    </div>
  );
}

export default function TaskNine() {
  return (
    <PageContainer>
      <PathButton index={0} title="Home" subtitle="" href="/" />
      <Divider />

      <Break />

      <MutedHeader>Task Nine</MutedHeader>

      <Header>Compton scattering</Header>

      <Break count={2} />

      <Text>
        given a system containing a static electron, <Latex>v_e = 0</Latex>, and
        a photon with wavelength <Latex>{"\\lambda"}</Latex>, moving such that
        the photon will hit the electron
      </Text>
      <Text>
        after said collision, the photon scatters off at an angle of{" "}
        <Latex>{"\\theta"}</Latex>, with its wavelength increasing to{" "}
        <Latex>{"\\lambda'"}</Latex>, and the electron recoils at an angle{" "}
        <Latex>{"\\varphi"}</Latex>
      </Text>

      <Break />

      <TaskVisual task={9} filename="angles.svg" />

      <Break />

      <Text>
        the key part of Compton scattering is that{" "}
        <Latex>{"\\Delta \\lambda"}</Latex> (
        <Latex>{"\\lambda' - \\lambda"}</Latex>) depends only on{" "}
        <Latex>{"\\theta"}</Latex>, it is not effected by the material (electron
        in this case), or initial wavelength <Latex>{"\\lambda"}</Latex> of the
        photon, this is an instance of light acting as a particle instead of a
        wave
      </Text>

      <Break />

      <Text>
        by treating it as a particle, you can treat the system as an elastic
        collision, and use the Plank-Einstein and de Broglie formulas to
        calculate resultant energy and momentum
      </Text>

      <Break />

      <Text>
        using the relativistic energy-momentum formula relation, we can derive
        equations for the energy and momentums of our photon and electron
      </Text>

      <Break />

      <Latex block>{"\\Large E^2 = (pc)^2 + (mc^2)^2"}</Latex>

      <Break />

      <Text>
        given the electron is stationary (<Latex>p_e = 0</Latex>), we can derive
        its energy as
      </Text>

      <Break />

      <Latex block>{"\\Large E_e^2 = (m_e c^2)^2"}</Latex>
      <Latex block>\Large E_e = m_e c^2</Latex>

      <Break />

      <Text>
        and given that the photon has no mass (<Latex>m_p = 0</Latex>), we can
        derive its momentum as
      </Text>

      <Break />

      <Latex block>{"\\Large E_p^2 = (p_p c)^2"}</Latex>
      <Latex block>{"\\Large E_p = p_p c"}</Latex>
      <Latex block>{"\\Large p_p = \\frac{E_p}{c}"}</Latex>

      <Break />

      <Text>
        then using Plank's formulas, we can get the photons formulas in terms of
        wavelength
      </Text>

      <Break />

      <Latex block>{"\\Large E = hf = \\dfrac{hc}{\\lambda}"}</Latex>
      <Latex block>{"\\Large p_p = \\frac{\\frac{hc}{\\lambda}}{c}"}</Latex>
      <Latex block>{"\\Large p_p = \\frac{h}{\\lambda}"}</Latex>

      <Break />

      <Text>
        and for the electron, classical Newtonian formulas such as{" "}
        <Latex>p = mv</Latex> and <Latex>{"E_k = \\dfrac{1}{2}mv^2"}</Latex>,
        are low speed approximations, so we need to introduce a factor that
        accounts for these changes, which is where the{" "}
        <Link
          label="Lorentz factor"
          href="https://en.wikipedia.org/wiki/Lorentz_factor"
        />{" "}
        (<Latex>\gamma</Latex>) comes in, further details on how it works, and
        why its implemented are beyond the scope for this task
      </Text>
      <Text>
        using this factor, we get the following formulas for the electron
      </Text>

      <Break />

      <Latex block>\Large p_e = \gamma m_e v_e</Latex>
      <Latex block>\Large E_e = \gamma m_e c^2</Latex>
      <Latex block>\Large (E_k)_e = E_e - m_e c^2</Latex>
      <Latex block>\Large (E_k)_e = (\gamma - 1) m_e c^2</Latex>

      <Break />

      <Text>
        finally, we can link together the formulas for the electron, and photon,
        as a "before = after" equation, where the total energy before (photon
        energy and electron energy), equals the total energy afterwords (photon
        energy and electron energy)
      </Text>

      <Break />

      <Latex block>
        {
          "\\Large \\dfrac{hc}{\\lambda} + m_e c^2 = \\dfrac{hc}{\\lambda'} + \\gamma m_e c^2"
        }
      </Latex>

      <Break />

      <Text>
        and for the momentum, we can split it into the <Latex>x</Latex>{" "}
        direction and <Latex>y</Latex> direction, with the <Latex>x</Latex>{" "}
        direction initially being all the photons energy, then becoming the
        components of the photon and electron, and the <Latex>y</Latex>{" "}
        direction initially being <Latex>0</Latex>, then again becoming a
        component of the photon and electron
      </Text>

      <Break />

      <Latex block>
        {
          "\\Large \\dfrac{h}{\\lambda} = \\dfrac{h}{\\lambda'} \\cos \\theta + \\gamma m_e v_e \\cos \\varphi"
        }
      </Latex>

      <Break />

      <Latex block>
        {
          "\\Large 0 = \\dfrac{h}{\\lambda'} \\sin \\theta - \\gamma m_e v_e \\sin \\varphi"
        }
      </Latex>

      <Break />

      <Text>
        after some rearranging, and simplifications you can come to this formula
      </Text>

      <Break />

      <Latex block>
        {"\\Large \\lambda' - \\lambda = \\dfrac{h}{m_e c} (1 - \\cos \\theta)"}
      </Latex>

      <Break />
      <Latex block>
        {"\\Large \\Delta \\lambda = \\dfrac{h}{m_e c} (1 - \\cos \\theta)"}
      </Latex>

      <Break />

      <Text>
        this shows that the change in wavelength in the photon{" "}
        <Latex>{"\\Delta \\lambda"}</Latex> is solely dependent on the exit
        angle of the photon <Latex>\theta</Latex>
      </Text>

      <Break count={2} />

      <Text>
        using these derived formulas, we can begin to plot various attributes of
        the system against the photon scattering angle <Latex>\theta</Latex>
      </Text>
      <Text>
        but before that, we should define a dimensionless energy parameter{" "}
        <Latex>\alpha</Latex>, such that{" "}
        <Latex>{"\\alpha = \\frac{E_p}{m_e c^2}"}</Latex>, and since we are
        using an electron, and <Latex>m_e</Latex> is constant,{" "}
        <Latex>{"\\alpha = \\frac{E_p}{511}"}</Latex>, measured in{" "}
        <Latex>keV</Latex>
      </Text>
      <Text>
        <Latex>\alpha</Latex> is essentially the incoming photons energy
        measured in units of the electrons rest energy, this unit will simplify
        the upcoming formulas and make numbers more digestible
      </Text>

      <Break />

      <Text>
        for starters we can plot the fractional wavelength shift{" "}
        <Latex>{"\\frac{\\Delta \\lambda}{\\lambda}"}</Latex>, against{" "}
        <Latex>\theta</Latex>
      </Text>
      <Text>
        the formula for this, implementing <Latex>\alpha</Latex>, comes to{" "}
      </Text>

      <Break />

      <Latex block>
        {
          "\\Large \\dfrac{\\Delta \\lambda}{\\lambda} = \\alpha (1 - \\cos \\theta)"
        }
      </Latex>

      <Break count={2} />

      <Text>
        below is this relationship modelled, with the initial photon energy{" "}
        <Latex>E_p</Latex> being adjustable
      </Text>

      <Break />

      <FractionalWavelengthShift />

      <Break count={2} />

      <Text>
        the next plot, is of the electron recoil velocity <Latex>v</Latex>{" "}
        against theta, i found that this is typically plotted as a fraction of
        the speed of light, so i will be plotting{" "}
        <Latex>{"\\frac{v}{c}"}</Latex> against <Latex>\theta</Latex>
      </Text>

      <Break />

      <Text>
        this plot requires a few more steps to derive the velocity, first we
        need to find the photons surviving energy fraction{" "}
        <Latex>{"\\frac{E_p '}{E_p}"}</Latex>
      </Text>

      <Break />

      <Latex block>{"\\Large r = \\dfrac{E_p '}{E_p}"}</Latex>

      <Break />

      <Latex block>
        {"\\Large r = \\dfrac{1}{1 + \\alpha (1 - \\cos \\theta)}"}
      </Latex>

      <Break />

      <Text>
        then we can find the electrons kinetic energy, by conservation of
        energy, it should be the energy that the photon lost
      </Text>

      <Break />

      <Latex block>{"\\Large (E_k)_e = E_p (1 - r)"}</Latex>

      <Break />

      <Text>
        then using the kinetic formula derived earlier, and further
        simplifications we can arrive to
      </Text>

      <Break />

      <Latex block>
        {"\\Large \\dfrac{v}{c} = \\sqrt{1 - \\dfrac{1}{\\gamma ^ 2}}"}
      </Latex>

      <Break />

      <Text>you can also expand the formula out, and get</Text>

      <Break />

      <Latex block>{"\\Large u = \\alpha (1 - \\cos \\theta)"}</Latex>

      <Break />

      <Latex block>
        {
          "\\Large \\dfrac{v}{c} = \\sqrt{1 - \\dfrac{1}{\\left(1 + \\dfrac{\\alpha u}{1 + u}\\right)^{2}}}"
        }
      </Latex>

      <Break />

      <RecoilVelocity />

      <Break count={2} />

      <Text>
        finally, the last plot is the electrons recoil angle{" "}
        <Latex>\varphi</Latex>, again against <Latex>\theta</Latex>
      </Text>
      <Text>again the formula can be derived, and is simplified to</Text>

      <Latex block>
        {"\\Large \\cot \\varphi = (1 + \\alpha) \\tan \\dfrac{\\theta}{2}"}
      </Latex>

      <Break />

      <Latex block>
        {
          "\\Large \\varphi = \\operatorname{acot} ((1 + \\alpha) \\tan \\dfrac{\\theta}{2})"
        }
      </Latex>

      <Break />

      <RecoilAngle />
    </PageContainer>
  );
}
