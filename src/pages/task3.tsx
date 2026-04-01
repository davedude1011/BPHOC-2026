import { Scatter } from "solid-chartjs";
import { createMemo, createSignal } from "solid-js";
import { DualInput } from "../components/components";
import { Text } from "../components/content";
import { Header, MutedHeader } from "../components/headers";
import { Break, Credit, Divider, Latex, PageContainer, PathButton, TaskVisual } from "../components/page-utils";

function ExperimentalRadiation() {
    const data = {
        labels: "wavelength",
        datasets: [
            {
                label: "Experimental",
                data: [
                    { x: 2.27, y: 200.723 },
                    { x: 2.72, y: 249.508 },
                    { x: 3.18, y: 293.024 },
                    { x: 3.63, y: 327.770 },
                    { x: 4.08, y: 354.081 },
                    { x: 4.54, y: 372.079 },
                    { x: 4.99, y: 381.493 },
                    { x: 5.45, y: 383.478 },
                    { x: 5.90, y: 378.901 },
                    { x: 6.35, y: 368.833 },
                    { x: 6.81, y: 354.063 },
                    { x: 7.26, y: 336.278 },
                    { x: 7.71, y: 316.076 },
                    { x: 8.17, y: 293.924 },
                    { x: 8.62, y: 271.432 },
                    { x: 9.08, y: 248.239 },
                    { x: 9.53, y: 225.940 },
                    { x: 9.98, y: 204.327 },
                    { x: 10.44, y: 183.262 },
                    { x: 10.89, y: 163.830 },
                    { x: 11.34, y: 145.750 },
                    { x: 11.80, y: 128.835 },
                    { x: 12.25, y: 113.568 },
                    { x: 12.71, y: 99.451 },
                    { x: 13.16, y: 87.036 },
                    { x: 13.61, y: 75.876 },
                    { x: 14.07, y: 65.766 },
                    { x: 14.52, y: 57.008 },
                    { x: 14.97, y: 49.223 },
                    { x: 15.43, y: 42.267 },
                    { x: 15.88, y: 36.352 },
                    { x: 16.34, y: 31.062 },
                    { x: 16.79, y: 26.580 },
                    { x: 17.24, y: 22.644 },
                    { x: 17.70, y: 19.255 },
                    { x: 18.15, y: 16.391 },
                    { x: 18.61, y: 13.811 },
                    { x: 19.06, y: 11.716 },
                    { x: 19.51, y: 9.921 },
                    { x: 19.97, y: 8.364 },
                    { x: 20.42, y: 7.087 },
                    { x: 20.87, y: 5.801 },
                    { x: 21.33, y: 4.523 }
                ],
                backgroundColor: "#e33232"
            },
        ],
    };
    const options = {
        responsive: true,
        maintainAspectRatio: false,
    };

    return (
        <div>
            <Scatter
                data={data}
                options={options}
            />
        </div>
    )
}


function ModelRadiation() {
    const [temp, set_temp] = createSignal(5000);

    const h = 6.62607015 * Math.pow(10, -34);
    const c = 299792458;
    const k = 1.380649 * Math.pow(10, -23);
    
    const B = (nm: number) => {
        const s = nm * 1e-9;
        if (s == 0) return 0;

        const exponent = (h * c) / (s * k * temp());
        const radiance = (2 * h * c * c) / (Math.pow(s, 5)) * (1 / (Math.exp(exponent) - 1));

        return radiance * 1e-12;
    }

    const values = createMemo(() => {
        return [...Array(60).keys()]
            .map(x => {
                const nm = x * 30 + 10;
                return {
                    x: nm * 1e-3,
                    y: B(nm),
                }
            });
    })

    const data = createMemo(() => ({
        datasets: [
            {
                data: values(),
                backgroundColor: "#e33232",
                showLine: true,
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
                    text: "wavelength (μm)",
                }
            },
            y: {
                title: {
                    display: true,
                    text: "Spectral Radiance (kW·sr⁻¹·m⁻²·nm⁻¹)",
                },
                suggestedMin: 0,
                suggestedMax: 15,
            },
        },
    };

    return (
        <div>
            <div>
                <Scatter
                    data={data()}
                    options={options}
                />
            </div>
            <DualInput label="temp" from={0} to={6_000} step={1} value={temp} set_value={set_temp} />
        </div>
    )
}


function ModelMolarHeatCapacity() {
    const [stiffness, set_stiffness] = createSignal(200);
    const [mass, set_mass] = createSignal(50); // *10^-26

    const h  = 6.62607015e-34;
    const rh = h / (2 * Math.PI);
    const bk = 1.380649e-23;

    const theta = createMemo(() => {
        const m = mass() * 1e-26;
        const freq = m == 0 ? 0 : Math.sqrt(stiffness() / m);
        return (rh * freq) / bk;
    });

    const R = 8.31446261815324;
    const R3 = 3 * R;
    
    const mhc = (temp: number) => {
        if (temp == 0) return 0;

        const thetaE = theta();
        const tot = thetaE / temp;

        const eto = Math.exp(tot);
        const left = Math.pow(tot, 2);
        const right = eto / Math.pow(eto - 1, 2);

        return R3 * left * right;
    }

    const values = createMemo(() => {
        const thetaE = theta();
        
        const baseRange = 100;
        const buffer = 1.5;
        
        const requiredMax = Math.max(baseRange, thetaE * buffer);
        const max_temp = Math.ceil(requiredMax / 100) * 100;
        
        const step = max_temp / 60;

        return [...Array(60).keys()]
            .map(i => {
                const t = i * step;
                return {
                    x: t,
                    y: mhc(t),
                }
            });
    })

    const data = createMemo(() => ({
        datasets: [
            {
                data: values(),
                backgroundColor: "#e33232",
                showLine: true,
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
                    text: "temperature (K)",
                }
            },
            y: {
                title: {
                    display: true,
                    text: "molar heat capacity (J/(mol·K))",
                },
                suggestedMin: 0,
                suggestedMax: 25,
            },
        },
    };

    return (
        <div>
            <div>
                <Scatter
                    data={data()}
                    options={options}
                />
            </div>
            <div class="flex flex-row">
                <DualInput label="m \cdot 10^{-26}" from={0} to={100}  step={0.01} value={mass}      set_value={set_mass} />
                <DualInput label="k"                from={0} to={1000} step={1}    value={stiffness} set_value={set_stiffness} />
            </div>
            <div class="flex flex-wrap">
                {
                    [
                        ["Diamond",   580, 1.99],
                        ["Beryllium", 125, 1.50],
                        ["Silicon",   55,  4.66],
                        ["Iron",      65,  9.27],
                        ["Copper",    50,  10.55],
                        ["Silver",    32,  17.91],
                        ["Gold",      28,  32.71],
                        ["Lead",      15,  34.41],
                        ["Sodium",    12,  3.82],
                        ["Platinum",  58,  32.4],
                        ["Osmium",     460, 31.59],
                        ["Tungsten",   105, 30.52],
                        ["Lithium",    13,  1.15],
                        ["Titanium",   62,  7.95],
                        ["Nickel",     72,  9.74],
                        ["Zinc",       35,  10.85],
                        ["Molybdenum", 85,  15.93],
                        ["Tin",        22,  19.70],
                        ["Graphite",   160, 1.99],
                        ["Iridium",    380, 31.91],
                    ].map(([n, s, m]) => (
                        <div
                            class="font-serif p-2 flex-1 max-w-32 text-center px-4 hover:underline hover:bg-muted/10 rounded cursor-pointer"
                            onclick={() => {
                                set_mass(m as number);
                                set_stiffness(s as number);
                            }}
                        >
                            {n}
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default function TaskThree() {
    return (
        <PageContainer>
            <PathButton index={0} title="Home" subtitle="" href="/" />
            <Divider />

            <Break />
            
            <MutedHeader>
                Task Three
            </MutedHeader>

            <Header>
                Energy quantization
            </Header>

            <Break count={2} />

            <Text>
                model of plancks black body radiation spectrum, with varying temperature, data matches those from <Credit task={3} label="wikipedia" href="https://en.wikipedia.org/wiki/Black-body_radiation" author="wikipedia" />
            </Text>
            <Break />

            <ModelRadiation />

            <Break count={2} />

            <Text>
                experimental data collected by NASA, <Credit label="source" author="NASA" href="https://lambda.gsfc.nasa.gov/product/cobe/firas_monopole_spect.html" task={3} />, 
                matching the shape of the computed model data above
            </Text>
            <Break />

            <ExperimentalRadiation />

            <Break count={4} />

            <Text>
                classical physics said that the molar heat capacity of substances was a constant <Latex>3R</Latex>, <Credit label="Dulong-petit law" author="wikipedia" href="https://en.wikipedia.org/wiki/Dulong%E2%80%93Petit_law" task={3} />, 
                but experimental data showed that at low temperatures, nearing <Latex>0K</Latex>, that it decreased rapidly, and at different points for different materials
            </Text>
            <Break />
            <Text>
                einstein modeled atoms as being vibrating oscillators, as if they where connected in each dimension by springs, then following earlier work
                by max plank, einstein quantized the energy level of the atoms, such that a minimum temperature (a materials einstein temperature <Latex>\theta_E</Latex>) 
                was required for any atom in the solid to vibrate at all, meaning below this non-zero value, the atom simply doesn't have the required energy
                to reach the next quantized energy level, and so remains motionless
            </Text>
            <Break />

            <TaskVisual task={3} filename="einstein-solid.svg" />
            <Break />

            <Text>
                to calculate the einstein temperature <Latex>\theta_E</Latex> for a material, you need the angular frequency of the atomic oscillations of the materials 
                atoms, which can be calculated via <Latex>{"w_0 = \\sqrt{\\frac{k}{m}}"}</Latex>, where <Latex>k</Latex> is the "stiffness" between the atoms, due to 
                atomic forces, and <Latex>m</Latex> is the atomic mass of the material
            </Text>
            <Text>
                with the angular frequency <Latex>w_0</Latex>, you can calculate the einstein temperature with <Latex>{"\\theta_E = \\dfrac{\\hbar w_0}{k_B}"}</Latex>, where 
                <Latex>\hbar</Latex> is the reduced planks constant (<Latex>{"\\frac{h}{2\\pi}"}</Latex>), and <Latex>k_B</Latex> is the boltzmann constant
            </Text>
            <Break />
            <Text>
                expanded, the einstein temperature with regards to atomic mass and stiffness is
            </Text>
            <Break />
            <Text centered>
                <Latex>{"\\theta_E = \\dfrac{h k^{\\frac{1}{2}} m^{-\\frac{1}{2}}}{2 \\pi k_B}"}</Latex>
            </Text>
            <Break />

            <Text>
                if measuring a singular atom, the graph of molar heat capacity against temperature would jump from zero to <Latex>3R</Latex> instantly
                at <Latex>\theta = \theta_E</Latex>, but experimental data is measured on many billions of atoms, for the graph on this scale, the jump
                is heavily smoothed out
            </Text>
            <Break />
            <TaskVisual task={3} filename="graph.svg" />
            <Break />

            <Text>
                due to the material containing billions of atoms, and temperature not being completely uniform between all of them,
                there are statistically areas of higher energy and areas of lower energy in the material, as global temperature increases,
                theres a statistically higher chance for an atom in the material to pass the <Latex>\theta_E</Latex> level, even if the global
                temperature is lower than it itself, which is why the experimental data shows the graph slowly curving up before the <Latex>\theta_E</Latex> point, 
                and as the ratio of vibrating atoms to total atoms increases, the material can start taking more energy increasing its molar heat
                capacity, until the threshold of classical physics, <Latex>3R</Latex>, when all the atoms in the material have passed the <Latex>\theta_E</Latex> level,
                typically when the global temperature is far past the <Latex>\theta_E</Latex> level
            </Text>
            <Break />

            <Text>
                using the einstein temperature of a material <Latex>\theta_E</Latex>, we can calculate the molar heat capacity of the material
                using the formula einstein devised, shown below:
            </Text>
            <Break />
            <Text centered>
                <Latex>
                    {"C = 3R (\\dfrac{\\theta_E}{T})^2 \\dfrac{e^{\\frac{\\theta_E}{T}}}{(e^{\\frac{\\theta_E}{T}} - 1)^2}"}
                </Latex>
            </Text>
            <Break />
            <Text>
                where <Latex>C</Latex> is the molar heat capacity, <Latex>R</Latex> is the ideal gas constant, <Latex>T</Latex> is the
                temperature in kelvin, and <Latex>\theta_E</Latex> is the einstein temperature for the material
            </Text>
            <Break />

            <ModelMolarHeatCapacity />
        </PageContainer>
    )
}