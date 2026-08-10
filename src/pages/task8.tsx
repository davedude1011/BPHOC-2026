import "chart.js/auto";
import { Scatter } from "solid-chartjs";
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

function MismatchCalculator() {
  const [range, set_range] = createSignal(180);
  const fold = (d: number) => {
    let f = d % 180;
    return f > 90 ? 180 - f : f;
  };
  const quantum = (d: number) => Math.pow(Math.sin((d * Math.PI) / 180), 2);
  const classical = (d: number) => fold(d) / 90;
  const curves = createMemo(() => {
    const max = range();
    const step = max / 200;
    const q = [];
    const c = [];
    for (let d = 0; d <= max; d += step) {
      q.push({ x: d, y: quantum(d) });
      c.push({ x: d, y: classical(d) });
    }
    return { q, c };
  });
  const data = createMemo(() => ({
    datasets: [
      {
        label: "Quantum sin²(Δ)",
        data: curves().q,
        borderColor: "#8b5cf6",
        backgroundColor: "#8b5cf6",
        showLine: true,
        pointRadius: 0,
        borderWidth: 2,
      },
      {
        label: "Classical (hidden variables)",
        data: curves().c,
        borderColor: "#f59e0b",
        backgroundColor: "#f59e0b",
        showLine: true,
        pointRadius: 0,
        borderWidth: 2,
        borderDash: [5, 5],
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
          text: "Δ (θ − φ)",
        },
        min: 0,
        max: range(),
      },
      y: {
        title: {
          display: true,
          text: "mismatch probability",
        },
        min: 0,
        max: 1,
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
          label="\text{angle range}"
          from={90}
          to={720}
          step={15}
          value={range}
          set_value={set_range}
        />
      </div>
    </div>
  );
}

export default function TaskEight() {
  return (
    <PageContainer>
      <PathButton index={0} title="Home" subtitle="" href="/" />
      <Divider />

      <Break />

      <MutedHeader>Task Eight</MutedHeader>

      <Header>Quantum cryptography</Header>

      <Break count={2} />

      <Quote label="Bruce Schneier" href="https://www.schneier.com/">
        The basic idea is still unbelievably cool, in theory, and nearly useless
        in real life. Even quantum cryptography doesn't 'solve' all of
        cryptography: The keys are exchanged with photons, but a conventional
        mathematical algorithm takes over for the actual encryption.
      </Quote>

      <Break />

      <Text>
        quantum cryptography, which for the purpose of this entire paper will be
        in reference specifically to the E91 quantum key distribution protocol,
        is a topic that strongly binds two of the most rapidly developing and
        modern topics of our time, quantum physics and computational
        cryptography, specifically it acts to use quantum phenomena (entangled
        photons), and a clever process, to generate secret keys between devices,
        and safely compare over public channels
      </Text>

      <Break />

      <Text>
        classical cryptography has two main classes of encryption and decryption
        algorithms, symmetric and asymmetric, symmetric algorithms are fast and
        lightweight, but assume both the host and client know of a secret key
        before hand, asymmetric algorithms are slower, more computationally
        expensive algorithms designed to securely send data across public
        channels using two keys per user, a public and a private, the exact
        methodology of asymmetric cryptographic algorithms is far too much for
        me to put in this topic, and is a genuinely fascinating area of
        mathematics and computation, but for purposes of this text we will just
        accept that it works
      </Text>
      <Text>
        classical communication over a public network, i.e. the internet,
        essentially boils down to using the asymmetric algorithm once to
        generate a private key both host and client agree on (the handshake),
        then using that key for the faster symmetric algorithm, the issue of
        classical communication is the handshake part, whilst the asymmetric
        algorithms are very good, they are not perfect, for classical computers,
        attempting to decrypt it would be infeasible, both time wise and
        economically, but for a quantum computer, specifically one big enough
        using{" "}
        <Link
          label="Shor's algorithm"
          href="https://en.wikipedia.org/wiki/Shor's_algorithm"
        />{" "}
        would reduce the challenge by orders of magnitude, and if that handshake
        got decrypted, the entire proceeding data stream would be public (to the
        decrypter), and worse-so the host and client would be none the wiser
      </Text>

      <Break />

      <Text>
        this is where QKE (quantum key encryption) comes into play, it
        specifically replaces the handshake portion of the pipeline, and does so
        in a way that's both mathematically secure against quantum decryption
        algorithms, and physically secure from skinning (eavesdropping the
        public channel)
      </Text>
      <Text>it can be loosely defined by the following protocols</Text>

      <Break />

      <Text>
        given two clients, Alice and Bob, and a source for the entangled
        photons, the SPDC source (
        <Link
          label="Spontaneous parametric down-conversion"
          href="https://en.wikipedia.org/wiki/Spontaneous_parametric_down-conversion"
        />
        ), you get a setup where the SPDC generates an entangled pair, and sends
        one to each client, importantly the photons can not be read midway
        transmission, so classical boosters like routers are off the table since
        reading the photon would collapse the entanglement, this also means this
        protocol has limited range between clients due to photon energy drop off
        during transmission, at least until quantum routers are devised such
        that they could route photons without reading them or generate
        identically entangled photons
      </Text>

      <Break />
      <TaskVisual task={8} filename="alice-bob.svg" />
      <Break />

      <Text>
        each client has a detector device for the photon that reaches it, and
        this detector has a polarizing filter with an electronically set angle,
        before each photon reaches the detector, it sets its polarization angle
        (<Latex>{"\\theta"}</Latex> for Alice, and <Latex>{"\\phi"}</Latex> for
        Bob) to a random angle (generally chosen from a discrete small set, i.e.
        0deg, 45deg, 90deg, ..., 215deg), importantly the two clients do this
        independently and do not communicate with each other whatsoever, more
        often than not <Latex>{"\\theta \\ne \\phi"}</Latex>, but due to the
        entanglement property of the photons, both photons will have the same
        polarity when reaching both detectors, and due to the polarization
        filters, a signal of <Latex>1</Latex> would occur if the polarization of
        the photon matched the filter, and <Latex>0</Latex> if not, (in
        actuality a blending function is used such that there is a smooth{" "}
        <Latex>50/50</Latex> probability instead, since the naive implementation
        would be massively biased towards <Latex>0</Latex>)
      </Text>

      <Break />
      <TaskVisual task={8} filename="angles.svg" />
      <Break />

      <Text>
        this process would occur thousands of times, with each client recording
        its set of random angles, and the signal they received from the photon
        on that pass
      </Text>

      <Break />
      <TaskVisual task={8} filename="angle-data.svg" />
      <Break />

      <Text>
        at this point, both clients will send each other the list of angles they
        chose, over the public channel, specifically they only send the angles
        they chose, not the conclusion they received from their angles, this
        means eavesdroppers only get the random data generated by each client,
        without knowing the states of the photons at each pass that data is
        garbage
      </Text>
      <Text>
        after receiving the other clients list of angles, they compare that list
        with their own set of angles, and filter their data set to only those in
        which both clients chose the same angle, (this is why the protocol uses
        a discrete set of angles to choose from), after which both clients
        should possess the same dataset
      </Text>

      <Break />
      <TaskVisual task={8} filename="filter.svg" />
      <Break />

      <Text>
        since both clients have the same dataset, the binary values obtained can
        be concatenated to form a secure cryptographically secure key to be used
        in classical symmetric encryption methods
      </Text>

      <Break />
      <TaskVisual task={8} filename="binary.svg" />
      <Break />

      <Break count={2} />

      <Text>
        due to the statistical nature of the polarization of the photon, and
        angles <Latex>{"\\theta"}</Latex> and <Latex>{"\\phi"}</Latex>, it is,
        as shown above, quite possible for clients to get differing bits as a
        conclusion of a pass, this is the entire reason for the public channel
        cross referencing and filtering, these differences are called a
        mismatch, or quantum mismatch, with the mismatch probability being the
        fraction of passes that mismatch, given that{" "}
        <Latex>{"\\Delta = \\theta - \\phi"}</Latex>, the quantum prediction for
        this mismatch probability is{" "}
        <Latex>{"P_q(\\Delta) = \\sin ^2 (\\Delta)"}</Latex>, this leaves the
        match probability to be{" "}
        <Latex>
          {"P_q(\\Delta) = 1 - \\sin ^2 (\\Delta) = \\cos ^2 (\\Delta)"}
        </Latex>
      </Text>

      <Break />

      <Text>
        this makes sense intuitively, if <Latex>{"\\Delta = 0"}</Latex>, meaning{" "}
        <Latex>{"\\theta = \\phi"}</Latex>, it should be a guaranteed match, and{" "}
        <Latex>{"\\cos ^2 (0) = 1"}</Latex>, for <Latex>{"\\Delta = 90"}</Latex>
        , then <Latex>{"\\theta"}</Latex> and <Latex>{"\\phi"}</Latex> should be
        perpendicular, and thus should be a guaranteed mismatch,{" "}
        <Latex>{"\\sin ^2 (90) = 1"}</Latex>
      </Text>

      <Break />

      <Text>
        classical interpretations of the setup would result in sawtooth
        probabilities for mismatch due to photons being presumed to carry a
        hidden variable constant polarization, and following a linear pattern as
        would be expected if dropping the quantum complexities, the graph still
        agrees at <Latex>45</Latex>deg intervals though
      </Text>

      <Break />

      <MismatchCalculator />
    </PageContainer>
  );
}
