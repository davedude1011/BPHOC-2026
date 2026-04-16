import 'chart.js/auto';
import Chart, { registerables } from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';
import { Scatter } from "solid-chartjs";
import { createMemo, createSignal } from "solid-js";
import { DualInput } from '../components/components';
import { Text } from "../components/content";
import { Header, MutedHeader } from "../components/headers";
import { Break, Divider, Latex, PageContainer, PathButton, TaskVisual } from "../components/page-utils";

Chart.register(...registerables, annotationPlugin);

function ModelEmission() {
    const [nf_max, set_nf_max] = createSignal(4);
    const [ni_max, set_ni_max] = createSignal(10);
    
    const h  = 6.62607015 * Math.pow(10, -34);
    const c  = 299792458;
    const RH = 10973731.5682;

    const L = (nf: number, ni: number) => {
        const nf_sq = nf * nf;
        const ni_sq = ni * ni;

        const inv_nf = 1 / nf_sq;
        const inv_ni = 1 / ni_sq;

        const diff = inv_nf - inv_ni;

        const prod = RH * diff;

        return 1 / prod;
    }

    const E = (nf: number, ni: number) => {
        const nf_sq = nf * nf;
        const ni_sq = ni * ni;

        const inv_nf = 1 / nf_sq;
        const inv_ni = 1 / ni_sq;

        const diff = inv_nf - inv_ni;

        const prod = RH * h * c * diff;

        return prod;
    }

    const values = createMemo(() => {
        const vals: {x: number, y: number}[] = [];

        for (let nf = 1; nf <= nf_max(); nf++) {
            for (let ni = nf + 1; ni <= nf + ni_max(); ni++) {
                const l = L(nf, ni) * 1e9;
                const e = E(nf, ni) * 6.242e18;
                
                if (isFinite(l) && isFinite(e)) {
                    vals.push({ x: l, y: e, nf: nf });
                }
            }
        }
        
        return vals;
    });
    
    const colors = [
        '#e33232', '#e37a32', '#e3c332', '#b3e332', '#32e35d', 
        '#32e3b9', '#32b9e3', '#3262e3', '#6632e3', '#b932e3'
    ];

    const data = createMemo(() => ({
        datasets: [
            {
                label: "Photon Energy vs Wavelength",
                data: values(),
                backgroundColor: (context: { raw: { nf: any; }; }) => {
                    const nf = context.raw?.nf;
                    return colors[nf - 1] || '#000';
                },
            },
        ],
    }));
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 0, },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "wavelength (nm)",
                }
            },
            y: {
                title: {
                    display: true,
                    text: "photon energy (eV)",
                },
            },
        },
    };

    const drop_lines = {
        id: 'dropLines',
        beforeDraw: (chart: { getDatasetMeta?: any; ctx?: any; scales?: any; }) => {
            const { ctx, scales: { _, y } } = chart;
            ctx.save();
            ctx.setLineDash([5, 5]);
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
            
            chart.getDatasetMeta(0).data.forEach((point: { x: any; y: any; }) => {
                ctx.beginPath();
                ctx.moveTo(point.x, point.y);
                ctx.lineTo(point.x, y.bottom);
                ctx.stroke();
            });
            ctx.restore();
        }
    };

    return (
        <div>
            <div>
                <Scatter
                    data={data()}
                    options={options}
                    plugins={[drop_lines]}
                />
            </div>
            <div class="flex flex-row">
                <DualInput label="m_f" from={1} to={10}  step={1} value={nf_max} set_value={set_nf_max} />
                <DualInput label="m_i" from={1} to={100} step={1} value={ni_max} set_value={set_ni_max} />
            </div>
        </div>
    )
}

export default function TaskFive() {
    return (
        <PageContainer>
            <PathButton index={0} title="Home" subtitle="" href="/" />
            <Divider />

            <Break />
            
            <MutedHeader>
                Task Five
            </MutedHeader>

            <Header>
                Hydrogen emission spectrum
            </Header>

            <Break count={2} />

            <Text>
                niels bohr made several improvements, following rutherfords planetary model of the atom, to theoretical reasoning
                of experimental data on atoms, namely explaining the observed photon emission bands of atoms, incorporating previously
                discussed ideas of energy quantization from max planck, and extending that to atomic electron levels, whilst outdated,
                this model helped pave the current understanding of quantum mechanics
            </Text>

            <Break count={2} />

            <TaskVisual task={5} filename='atom-r.svg' />

            <Break />

            <Text>
                as seen above, bohr's model has, mathematically, infinite rings, with each subsequent ring <Latex>n = 1  \to n = \infty</Latex>, having
                a larger gap than the last, following a squared relationship such that the radius <Latex>r_n \propto n^2</Latex>, and the energy
                required to go from one ring to the next decreases in a squared relation such that <Latex>{"E_n \\propto \\frac{1}{n^2}"}</Latex>
            </Text>
            <Text>
                the decrease in energy requirement is due to the increasing distance from the nucleus, as the electron gets further, the pull from
                the nucleus decreases, meaning less energy is required to overcome the pulling force and reach the next ring
            </Text>

            <Break count={2} />

            <TaskVisual task={5} filename='atom-bump.svg' />

            <Break />

            <Text>
                bohr's model, following the observed banding in photon emission wavelengths, restricted electrons to only exist in these rings, and didn't
                allow them to exist between, even during transitions from one to the other, resulting in electrons "jumping" between rings
            </Text>
            <Text>
                during this "jump", the electron can go up, or down, any number of rings, with down being closer to the nucleus, lower rings are preferable
                for an electron to be in, due to requiring the least energy in the electron, so giving an electron energy, i.e. hitting it with a photon
                as was shown in the previous photoelectric effect modelling, the electron gains energy and jumps to a higher ring corresponding to how much
                energy was in the photon, similarly an electron can emit a photon and go down the rings, again with the energy of the photon emitted being
                proportional to the amount of rings fallen
            </Text>
            <Text>
                this change in energy of the photon is what determines the wavelength of the emitted light, and explained why specific wavelengths were
                emitted from hydrogen, because the rings are quantized, the energy allowed to be emitted is quantized, resulting in only specific wavelengths
                being emitted
            </Text>

            <Break />

            <Text>
                as explained earlier, as the rings increase the energy required to go from one to the other decreases exponentially, so only the first few rings release
                relevant amounts of energy, so if an electron hypothetically drops from ring <Latex>20</Latex> to ring <Latex>2</Latex>, the energy released is
                roughly the same as the energy released from dropping from ring <Latex>200</Latex> to <Latex>2</Latex>, with the energy level of ring <Latex>2</Latex> being
                the vast majority of this emission
            </Text>
            <Text>
                due to this, the "jumping" of an electron is categorized based on the ring it lands on, for the first few rings
            </Text>

            <Break />

            <Text>
                we can plot this data using the rydberg formula, which relates the initial ring of the electron <Latex>n_i</Latex>, the resultant ring the electron jumps
                to <Latex>n_f</Latex>, the rydberg constant <Latex>R_H</Latex>, and finally the wavelength of the emitted photon <Latex>\lambda</Latex>
            </Text>

            <Break />

            <Text centered>
                <Latex>{"\\dfrac{1}{\\lambda} = R_H \\begin{pmatrix} \\dfrac{1}{n^2_f} - \\dfrac{1}{n^2_i} \\end{pmatrix}"}</Latex>
            </Text>

            <Break />

            <Text>
                then for energy we can extend the formula using <Latex>{"E = \\frac{hc}{\\lambda}"}</Latex>, then rearranging for
                wavelength <Latex>{"\\lambda = \\frac{hc}{E}"}</Latex>
            </Text>

            <Break />

            <Text centered>
                <Latex>{"\\dfrac{E}{hc} = R_H \\begin{pmatrix} \\dfrac{1}{n^2_f} - \\dfrac{1}{n^2_i} \\end{pmatrix}"}</Latex>
            </Text>
            <Break />
            <Text centered>
                <Latex>{"E = R_Hhc \\begin{pmatrix} \\dfrac{1}{n^2_f} - \\dfrac{1}{n^2_i} \\end{pmatrix}"}</Latex>
            </Text>

            <Break />

            <Text>
                below, is a model of these two functions, with photon energy on y-axis and wavelength on the x-axis, using multiple <Latex>n_f</Latex> and
                <Latex>n_i</Latex> values, with <Latex>m</Latex> representing the ranges of these values, for example <Latex>n_f = 1, 2, ...,  m_f</Latex>
            </Text>

            <Break />

            <ModelEmission />
        </PageContainer>
    )
}