use shared::CanvasHandler;

const A0: f64 = 0.529_177_210_9;
const RY: f64 = 13.605_693_12;
const ME_U: f64 = 5.485_799_09e-4;

#[derive(Clone, Copy, PartialEq)]
pub struct Orbital {
    pub n: u32,
    pub l: u32,
    pub m: i32,
    pub z: f64,
    pub a: f64,
}

pub struct CloudNode {
    x: f32,
    y: f32,
    z: f32,
    sign: i8,
}

pub fn make_orbital(n: u32, l: u32, m: i32, z: f64, a: f64) -> Orbital {
    let n = n.max(1);
    let l = l.min(n - 1);
    let m = m.clamp(-(l as i32), l as i32);

    return Orbital {
        n,
        l,
        m,
        z: z.max(1.0),
        a: a.max(1.0),
    };
}

fn mass_ratio(orb: &Orbital) -> f64 {
    return 1.0 / (1.0 + ME_U / orb.a);
}

fn bohr(orb: &Orbital) -> f64 {
    return A0 / mass_ratio(orb);
}

pub fn energy(orb: &Orbital) -> f64 {
    let n = orb.n as f64;
    return -RY * mass_ratio(orb) * orb.z * orb.z / (n * n);
}

pub fn mean_radius(orb: &Orbital) -> f64 {
    let n = orb.n as f64;
    let l = orb.l as f64;

    return bohr(orb) / (2.0 * orb.z) * (3.0 * n * n - l * (l + 1.0));
}

pub fn radial_nodes(orb: &Orbital) -> u32 {
    return orb.n - orb.l - 1;
}

fn extent(orb: &Orbital, zoom: f64) -> f64 {
    return mean_radius(orb) * 1.15 / zoom.max(0.05);
}

fn factorial(k: u32) -> f64 {
    let mut out = 1.0;
    for i in 2..=k {
        out *= i as f64
    }

    return out;
}

fn laguerre(k: u32, alpha: f64, x: f64) -> f64 {
    if k == 0 {
        return 1.0;
    }

    let mut prev = 1.0;
    let mut curr = 1.0 + alpha - x;

    for i in 1..k {
        let i = i as f64;
        let next = ((2.0 * i + 1.0 + alpha - x) * curr - (i + alpha) * prev) / (i + 1.0);

        prev = curr;
        curr = next;
    }

    return curr;
}

fn legendre(l: u32, m: u32, x: f64) -> f64 {
    if m > l {
        return 0.0;
    }

    let mut pmm = 1.0;

    if m > 0 {
        let root = ((1.0 - x) * (1.0 + x)).max(0.0).sqrt();
        let mut odd = 1.0;

        for _ in 0..m {
            pmm *= -odd * root;
            odd += 2.0;
        }
    }

    if l == m {
        return pmm;
    }

    let mut pmm1 = x * (2.0 * m as f64 + 1.0) * pmm;
    if l == m + 1 {
        return pmm1;
    }

    let mut pll = 0.0;

    for ll in (m + 2)..=l {
        let ll = ll as f64;
        let m = m as f64;

        pll = (x * (2.0 * ll - 1.0) * pmm1 - (ll + m - 1.0) * pmm) / (ll - m);

        pmm = pmm1;
        pmm1 = pll;
    }

    return pll;
}

pub fn radial(orb: &Orbital, r: f64) -> f64 {
    let n = orb.n as f64;
    let l = orb.l;

    let k = 2.0 * orb.z / (n * bohr(orb));
    let rho = k * r;

    let norm = (k * k * k * factorial(orb.n - l - 1) / (2.0 * n * factorial(orb.n + l))).sqrt();

    return norm
        * (-0.5 * rho).exp()
        * rho.powi(l as i32)
        * laguerre(orb.n - l - 1, 2.0 * l as f64 + 1.0, rho);
}

pub fn harmonic(l: u32, m: i32, cos_theta: f64, phi: f64) -> f64 {
    let am = m.unsigned_abs();

    let norm = ((2.0 * l as f64 + 1.0) / (4.0 * std::f64::consts::PI) * factorial(l - am)
        / factorial(l + am))
    .sqrt();

    let p = legendre(l, am, cos_theta);
    let angle = am as f64 * phi;

    if m == 0 {
        return norm * p;
    }
    if m > 0 {
        return std::f64::consts::SQRT_2 * norm * p * angle.cos();
    }

    return std::f64::consts::SQRT_2 * norm * p * angle.sin();
}

#[inline]
pub fn psi(orb: &Orbital, x: f64, y: f64, z: f64) -> f64 {
    let r2 = x * x + y * y + z * z;

    if r2 < 1e-18 {
        if orb.l != 0 {
            return 0.0;
        }
        return radial(orb, 0.0) * harmonic(0, 0, 1.0, 0.0);
    }

    let r = r2.sqrt();

    return radial(orb, r) * harmonic(orb.l, orb.m, z / r, y.atan2(x));
}

fn plane_point(plane: u32, u: f64, v: f64) -> (f64, f64, f64) {
    match plane {
        1 => (u, 0.0, v),
        2 => (0.0, u, v),
        _ => (u, v, 0.0),
    }
}

#[inline]
fn pack(r: u32, g: u32, b: u32) -> u32 {
    return 0xFF00_0000 | ((b & 0xFF) << 16) | ((g & 0xFF) << 8) | (r & 0xFF);
}

#[inline]
fn blend(dst: u32, r: u32, g: u32, b: u32) -> u32 {
    let dr = (dst & 0xFF) + r;
    let dg = ((dst >> 8) & 0xFF) + g;
    let db = ((dst >> 16) & 0xFF) + b;

    return pack(dr.min(255), dg.min(255), db.min(255));
}

fn jet(t: f64) -> (u32, u32, u32) {
    let t = t.clamp(0.0, 1.0);

    let r = (1.5 - (4.0 * t - 3.0).abs()).clamp(0.0, 1.0);
    let g = (1.5 - (4.0 * t - 2.0).abs()).clamp(0.0, 1.0);
    let b = (1.5 - (4.0 * t - 1.0).abs()).clamp(0.0, 1.0);

    return ((r * 255.0) as u32, (g * 255.0) as u32, (b * 255.0) as u32);
}

// additive blending needs a dark base, so never rely on canvas.clear() here
fn fill_black(canvas: &mut CanvasHandler) {
    for pixel in canvas.pixels.iter_mut() {
        *pixel = 0xFF00_0000
    }
}

pub fn draw_slice(canvas: &mut CanvasHandler, orb: &Orbital, plane: u32, zoom: f64) -> f64 {
    let w = canvas.width as usize;
    let h = canvas.height as usize;
    let half = extent(orb, zoom);

    let mut density = vec![0.0; w * h];
    let mut max = 0.0;

    // first pass: evaluate the field
    for j in 0..h {
        let v = (0.5 - (j as f64 + 0.5) / h as f64) * 2.0 * half;

        for i in 0..w {
            let u = ((i as f64 + 0.5) / w as f64 - 0.5) * 2.0 * half;
            let (x, y, z) = plane_point(plane, u, v);

            let p = psi(orb, x, y, z);
            let d = p * p;

            density[j * w + i] = d;
            max = f64::max(max, d);
        }
    }

    // second pass: normalise to 0..1 and colour
    let inv = if max > 0.0 { 1.0 / max } else { 0.0 };

    for i in 0..(w * h) {
        let (r, g, b) = jet(density[i] * inv);
        canvas.pixels[i] = pack(r, g, b);
    }

    return half;
}

struct Rng(u64);

impl Rng {
    fn new(seed: u64) -> Self {
        Rng(seed | 1)
    }

    #[inline]
    fn unit(&mut self) -> f64 {
        let mut x = self.0;

        x ^= x >> 12;
        x ^= x << 25;
        x ^= x >> 27;

        self.0 = x;

        return (x.wrapping_mul(0x2545_F491_4F6C_DD1D) >> 11) as f64 / 9007199254740992.0;
    }
}

fn peak_density(orb: &Orbital, half: f64, steps: usize) -> f64 {
    let mut max = 0.0;

    for k in 0..steps {
        let z = (k as f64 / (steps - 1) as f64 - 0.5) * 2.0 * half;

        for j in 0..steps {
            let y = (j as f64 / (steps - 1) as f64 - 0.5) * 2.0 * half;

            for i in 0..steps {
                let x = (i as f64 / (steps - 1) as f64 - 0.5) * 2.0 * half;
                let p = psi(orb, x, y, z);

                max = f64::max(max, p * p);
            }
        }
    }

    return max * 1.35;
}

pub fn init_cloud_buffer(
    buffer: &mut Vec<CloudNode>,
    orb: &Orbital,
    target: usize,
    zoom: f64,
    seed: u64,
) -> f64 {
    let half = extent(orb, zoom);
    let ceiling = peak_density(orb, half, 40);

    let mut rng = Rng::new(seed);
    let budget = target * 400;
    let mut tries = 0;

    buffer.clear();
    buffer.reserve(target);

    while buffer.len() < target && tries < budget {
        tries += 1;

        let x = (rng.unit() - 0.5) * 2.0 * half;
        let y = (rng.unit() - 0.5) * 2.0 * half;
        let z = (rng.unit() - 0.5) * 2.0 * half;

        let p = psi(orb, x, y, z);
        if p * p <= rng.unit() * ceiling {
            continue;
        }

        let node = CloudNode {
            x: x as f32,
            y: y as f32,
            z: z as f32,
            sign: if p >= 0.0 { 1 } else { -1 },
        };
        buffer.push(node);
    }

    return half;
}

pub fn draw_cloud_buffer(
    buffer: &Vec<CloudNode>,
    canvas: &mut CanvasHandler,
    half: f64,
    yaw: f64,
    pitch: f64,
    gain: f64,
) {
    const SPLAT: f64 = 110.0;

    fill_black(canvas);

    let w = canvas.width as i64;
    let h = canvas.height as i64;

    let scale = w.min(h) as f64 * 0.45 / half;
    let cx = w as f64 * 0.5;
    let cy = h as f64 * 0.5;

    let (sin_yaw, cos_yaw) = yaw.sin_cos();
    let (sin_pit, cos_pit) = pitch.sin_cos();

    for node in buffer {
        let x = node.x as f64;
        let y = node.y as f64;
        let z = node.z as f64;

        let rx = x * cos_yaw - y * sin_yaw;
        let ry = x * sin_yaw + y * cos_yaw;

        let depth = ry * cos_pit - z * sin_pit;
        let up = ry * sin_pit + z * cos_pit;

        let px = (cx + rx * scale) as i64;
        let py = (cy - up * scale) as i64;

        if px < 0 || py < 0 || px >= w || py >= h {
            continue;
        }

        let shade = 0.45 + 0.55 * (0.5 - 0.5 * (depth / half).clamp(-1.0, 1.0));
        let v = (shade * gain * SPLAT).clamp(0.0, 255.0) as u32;

        let i = (py * w + px) as usize;
        let dst = canvas.pixels[i];

        canvas.pixels[i] = if node.sign > 0 {
            blend(dst, v, v / 3, v / 6)
        } else {
            blend(dst, v / 6, v / 3, v)
        };
    }
}
