use std::f64::consts::PI;

use rand::RngExt;
use shared::CanvasHandler;

pub fn rinse_particle(buffer: &mut Vec<(u32, u32, f64, f64)>, N: u32, r: u32, R: u32) {
    // for fluid particles inside of the particle, they get pushed to the circumference
    // of the particle

    // this should only be used when updating fluid particle radius, or particle
    // radius, not during simulation

    let padding: f64 = r as f64 + 0.0;
    let push_distance = R as f64 + padding;

    let (Px, Py, _, _) = buffer[N as usize];

    let Px = Px as f64;
    let Py = Py as f64;

    for i in 0..N {
        let (x, y, vx, vy) = buffer[i as usize];

        let x = x as f64;
        let y = y as f64;

        let dx = x - Px;
        let dy = y - Py;

        let dm = dx.hypot(dy);

        if dm < push_distance {
            let (nx, ny) = if dm < 0.1 { (1.0, 0.0) } else { (dx / dm, dy / dm) };

            let ax = (Px + nx * push_distance).round_ties_even() as u32;
            let ay = (Py + ny * push_distance).round_ties_even() as u32;

            buffer[i as usize] = (ax, ay, vx, vy);
        }
    }
}

pub fn init_state_buffer(buffer: &mut Vec<(u32, u32, f64, f64)>, canvas: &CanvasHandler, N: u32, r: u32, R: u32) {
    const INITIAL_FLUID_PARTICLE_VELOCITY: f64 = 5.0;

    let mut rng = rand::rng();

    let width  = canvas.width;
    let height = canvas.height;

    buffer.clear();

    for _ in 0..N {
        let rx = rng.random_range(0..width);
        let ry = rng.random_range(0..height);

        let rn = rng.random_range(0.0..1.0);
        let ra = rn * 2.0 * PI;

        let rvx = INITIAL_FLUID_PARTICLE_VELOCITY * ra.cos();
        let rvy = INITIAL_FLUID_PARTICLE_VELOCITY * ra.sin();

        buffer.push((rx, ry, rvx, rvy));
    }

    buffer.push((width / 2, height / 2, 0.0, 0.0));
}

pub fn step_buffer_beta(buffer: &mut Vec<(u32, u32, f64, f64)>) {
    let mut rng = rand::rng();

    let N = buffer.len() - 1;

    for i in 0..N {
        let (x, y, vx, vy) = buffer[i];

        let dx = (x as f64 + vx).round_ties_even() as u32;
        let dy = (y as f64 + vy).round_ties_even() as u32;

        let velocity = vx.hypot(vy);

        let rn = rng.random_range(0.0..1.0);
        let ra = rn * 2.0 * PI;

        let rvx = velocity * ra.cos();
        let rvy = velocity * ra.sin();

        buffer[i] = (dx, dy, rvx, rvy);
    }
}

pub fn step_buffer(buffer: &mut Vec<(u32, u32, f64, f64)>, canvas: &CanvasHandler, r: u32, m: u32, R: u32, M: u32) {
    let mut rng = rand::rng();

    let N = buffer.len() - 1;

    let particle_distance = R as f64 + r as f64;

    let mut total_delta_Vx = 0.0;
    let mut total_delta_Vy = 0.0;

    let m = m as f64;
    let M = M as f64;

    let (Px, Py, Vx, Vy) = buffer[N];

    let Px = Px as f64;
    let Py = Py as f64;

    let Px = Px + Vx;
    let Py = Py + Vy;

    for i in 0..N {
        let (x, y, vx, vy) = buffer[i];

        let x = x as f64;
        let y = y as f64;

        let dx = (x + vx).round_ties_even() as u32;
        let dy = (y + vy).round_ties_even() as u32;

        let nx = Px - x;
        let ny = Py - y;

        let mn = nx.hypot(ny);

        let mut fvx = 0.0;
        let mut fvy = 0.0;

        if mn.abs() <= particle_distance.abs() {
            let unx = nx / mn;
            let uny = ny / mn;

            let vn = (vx * unx) + (vy * uny);
            let Vn = (Vx * unx) + (Vy * uny);

            let vn_prime = (vn * (m - M) + 2.0 * M * Vn) / (m + M);
            let Vn_prime = (2.0 * m * vn + Vn * (M - m)) / (m + M);

            let vtx = vx - vn * unx;
            let vty = vy - vn * uny;

            let Vtx = Vx - Vn * unx;
            let Vty = Vy - Vn * uny;

            let v_prime_x = vtx + vn_prime * unx;
            let v_prime_y = vty + vn_prime * uny;

            fvx = v_prime_x;
            fvy = v_prime_y;

            let V_prime_x = Vtx + Vn_prime * unx;
            let V_prime_y = Vty + Vn_prime * uny;

            total_delta_Vx += V_prime_x - Vx;
            total_delta_Vy += V_prime_y - Vy;
        }
        else {
            let v = vx.hypot(vy);
            
            let rn = rng.random_range(0.0..1.0);
            let ra = rn * 2.0 * PI;

            fvx = v * ra.cos();
            fvy = v * ra.sin();
        }


        buffer[i] = (dx, dy, fvx, fvy);
    }

    let mut Px = Px.round_ties_even() as u32;
    let mut Py = Py.round_ties_even() as u32;

    if Px + R >= canvas.width  { Px = canvas.width  - (R + 1); }
    if Py + R >= canvas.height { Py = canvas.height - (R + 1); }

    if Px < R { Px = R; }
    if Py < R { Py = R; }

    let Vx = Vx + total_delta_Vx;
    let Vy = Vy + total_delta_Vy;

    buffer[N] = (Px, Py, Vx, Vy);
}

pub fn step_buffer_bouncy(buffer: &mut Vec<(u32, u32, f64, f64)>, canvas: &CanvasHandler, r: u32, m: u32, R: u32, M: u32) {
    let mut rng = rand::rng();

    let N = buffer.len() - 1;

    let particle_distance = R as f64 + r as f64;

    let mut total_delta_Vx = 0.0;
    let mut total_delta_Vy = 0.0;

    let m = m as f64;
    let M = M as f64;

    let (Px, Py, Vx, Vy) = buffer[N];

    let Px = Px as f64;
    let Py = Py as f64;

    let Px = Px + Vx;
    let Py = Py + Vy;

    for i in 0..N {
        let (x, y, vx, vy) = buffer[i];

        let x = x as f64;
        let y = y as f64;

        let dx = (x + vx).round_ties_even() as u32;
        let dy = (y + vy).round_ties_even() as u32;

        let nx = Px - x;
        let ny = Py - y;

        let mn = nx.hypot(ny);

        let mut fvx = 0.0;
        let mut fvy = 0.0;

        if mn.abs() <= particle_distance.abs() {
            let unx = nx / mn;
            let uny = ny / mn;

            let vn = (vx * unx) + (vy * uny);
            let Vn = (Vx * unx) + (Vy * uny);

            let vn_prime = (vn * (m - M) + 2.0 * M * Vn) / (m + M);
            let Vn_prime = (2.0 * m * vn + Vn * (M - m)) / (m + M);

            let vtx = vx - vn * unx;
            let vty = vy - vn * uny;

            let Vtx = Vx - Vn * unx;
            let Vty = Vy - Vn * uny;

            let v_prime_x = vtx + vn_prime * unx;
            let v_prime_y = vty + vn_prime * uny;

            fvx = v_prime_x;
            fvy = v_prime_y;

            let V_prime_x = Vtx + Vn_prime * unx;
            let V_prime_y = Vty + Vn_prime * uny;

            total_delta_Vx += V_prime_x - Vx;
            total_delta_Vy += V_prime_y - Vy;
        }
        else {
            fvx = vx;
            fvy = vy;

            let dx = (x + fvx).round_ties_even() as u32;
            let dy = (y + fvy).round_ties_even() as u32;

            if dx + r >= canvas.width  { fvx *= -1.0; }
            if dy + r >= canvas.height { fvy *= -1.0; }

            if dx < r { fvx *= -1.0; }
            if dy < r { fvy *= -1.0; }
        }


        buffer[i] = (dx, dy, fvx, fvy);
    }

    let mut Px = Px.round_ties_even() as u32;
    let mut Py = Py.round_ties_even() as u32;

    if Px + R >= canvas.width  { Px = canvas.width  - (R + 1); }
    if Py + R >= canvas.height { Py = canvas.height - (R + 1); }

    if Px < R { Px = R; }
    if Py < R { Py = R; }

    let Vx = Vx + total_delta_Vx;
    let Vy = Vy + total_delta_Vy;

    buffer[N] = (Px, Py, Vx, Vy);
}

pub fn render_state_buffer(buffer: &Vec<(u32, u32, f64, f64)>, canvas: &mut CanvasHandler, r: u32, R: u32) {
    let N = buffer.len() - 1;

    canvas.clear();

    for i in 0..N {
        let (x, y, _, _) = buffer[i];

        if x + r >= canvas.width  { continue; }
        if y + r >= canvas.height { continue; }

        if x < r { continue }
        if y < r { continue }

        canvas.draw_circle(x, y, r, true);
    }

    let (Px, Py, _, _) = buffer[N];
    canvas.draw_circle(Px, Py, R, false);
}