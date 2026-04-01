use std::f64::consts::PI;

use rand::RngExt;
use shared::CanvasHandler;

fn rgba_to_argb_hex(r: u8, g: u8, b: u8, a: u8) -> u32 {
    // Pack as AAAA RRRR GGGG BBBB
    ((a as u32) << 24) | ((r as u32) << 16) | ((g as u32) << 8) | (b as u32)
}

fn wavelength_to_hex(wavelength: f64) -> u32 {
    let mut r = wavelength;
    let mut g = wavelength;
    let mut b = wavelength;
    let mut a = wavelength;
    let wl    = wavelength;

    let gamma = 1.0;

    if wl > 380.0 && wl < 440.0 {
        r = -(wl - 440.0) / (440 - 380) as f64;
        g = 0.0;
        b = 1.0;
    }
    else if wl >= 440.0 && wl < 490.0 {
        r = 0.0;
        g = (wl - 440.0) / (490 - 440) as f64;
        b = 1.0;
    }
    else if wl >= 490.0 && wl < 510.0 {
        r = 0.0;
        g = 1.0;
        b = -(wl - 510.0) / (510 - 490) as f64;
    }
    else if wl >= 510.0 && wl < 580.0 {
        r = (wl - 510.0) / (580 - 510) as f64;
        g = 1.0;
        b = 0.0;
    }
    else if wl >= 580.0 && wl < 645.0 {
        r = 1.0;
        g = -(wl - 645.0) / (645 - 580) as f64;
        b = 0.0;
    }
    else if wl >= 645.0 && wl < 781.0 {
        r = 1.0;
        g = 0.0;
        b = 0.0;
    }
    else {
        r = 0.0;
        g = 0.0;
        b = 0.0;
    }

    if wl >= 380.0 && wl < 420.0 {
        a = 0.3 + 0.7 * (wl - 380.0) / (420 - 380) as f64;
    }
    else if wl >= 420.0 && wl < 701.0 {
        a = 1.0;
    }
    else if wl >= 701.0 && wl < 781.0 {
        a = 0.3 + 0.7 * (780.0 - wl) / (780 - 701) as f64;
    }
    else {
        a = 0.0;
    }

    let final_r = (255.0 * r.powf(gamma)).round() as u8;
    let final_g = (255.0 * g.powf(gamma)).round() as u8;
    let final_b = (255.0 * b.powf(gamma)).round() as u8;
    let final_a = (255.0 * a).round() as u8;

    rgba_to_argb_hex(final_r, final_g, final_b, final_a)
}

pub fn init_state_buffer(buffer: &mut Vec<(u32, u32, f64, f64)>, canvas: &CanvasHandler, N: u32) {
    // inits N electrons in buffer with random velocity vectors

    const AVG_VELOCITY_MAGNITUDE: f64 = 5.0;
    const MAX_VELOCITY_DEVIATION: f64 = 2.5;

    let mut rng = rand::rng();

    let width  = canvas.width;
    let height = canvas.height;

    let boundary_width = width / 3;

    buffer.clear();

    for _ in 0..N {
        let rx = rng.random_range(0..boundary_width);
        let ry = rng.random_range(0..height);

        let rn = rng.random_range(0.0..1.0);
        let ra = rn * 2.0 * PI;

        let deviation = rng.random_range(-MAX_VELOCITY_DEVIATION..MAX_VELOCITY_DEVIATION);

        let rvx = AVG_VELOCITY_MAGNITUDE * ra.cos() + deviation;
        let rvy = AVG_VELOCITY_MAGNITUDE * ra.sin() + deviation;

        buffer.push((rx, ry, rvx, rvy));
    }
}

pub fn init_state_buffer_packets_beta(buffer: &mut Vec<(u32, u32, f64, f64)>, canvas: &CanvasHandler, N: u32) {
    // inits N packets in buffer

    const PACKET_VELOCITY: f64        = 15.0;
    const MAX_VERTICAL_DEVIATION: i32 = 25;

    let mut rng = rand::rng();

    let width  = canvas.width;
    let height = canvas.height;

    buffer.clear();

    for _ in 0..N {
        let x_offset = rng.random_range(0..width);
        let rx = width + x_offset;

        let dry = rng.random_range(-MAX_VERTICAL_DEVIATION..MAX_VERTICAL_DEVIATION);
        let ry = ((height as i32 / 2) + dry) as u32;

        let rvx = -PACKET_VELOCITY;
        let rvy =  0.0;

        buffer.push((rx, ry, rvx, rvy));
    }
}

pub fn init_state_buffer_beta(buffer: &mut Vec<(u32, u32, f64, f64)>, canvas: &CanvasHandler, N: u32) {
    // inits N electrons in buffer with random velocity vectors

    const AVG_VELOCITY_MAGNITUDE: f64 = 5.0;
    const MAX_VELOCITY_DEVIATION: f64 = 2.5;

    let mut rng = rand::rng();

    let width  = canvas.width;
    let height = canvas.height;

    let boundary_width = (width / 4) * 3;

    buffer.clear();

    for _ in 0..N {
        let rx = rng.random_range(0..boundary_width);
        let ry = rng.random_range(0..height);

        let rn = rng.random_range(0.0..1.0);
        let ra = rn * 2.0 * PI;

        let deviation = rng.random_range(-MAX_VELOCITY_DEVIATION..MAX_VELOCITY_DEVIATION);

        let rvx = AVG_VELOCITY_MAGNITUDE * ra.cos() + deviation;
        let rvy = AVG_VELOCITY_MAGNITUDE * ra.sin() + deviation;

        buffer.push((rx, ry, rvx, rvy));
    }
}

pub fn step_buffer_beta(buffer: &mut Vec<(u32, u32, f64, f64)>, canvas: &CanvasHandler) {
    let N = buffer.len();

    let width  = canvas.width;
    let height = canvas.height;

    let boundary_width = (width / 4) * 3;

    for i in 0..N {
        let (x, y, vx, vy) = buffer[i];

        let dx = (x as f64 + vx).round_ties_even() as i32;
        let dy = (y as f64 + vy).round_ties_even() as i32;

        let mut rvx = vx;
        let mut rvy = vy;

        if dx > boundary_width as i32 { rvx = -rvx; }
        if dy > height         as i32 { rvy = -rvy; }

        if dx < 0 { rvx = -rvx; }
        if dy < 0 { rvy = -rvy; }
        
        let safe_x = dx.clamp(0, (width - 1) as i32) as u32;
        let safe_y = dy.clamp(0, (height - 1) as i32) as u32;

        buffer[i] = (safe_x, safe_y, rvx, rvy);
    }
}

pub fn step_buffer_beta_walk(buffer: &mut Vec<(u32, u32, f64, f64)>, canvas: &CanvasHandler) {
    let mut rng = rand::rng();

    let N = buffer.len();

    let width  = canvas.width;
    let height = canvas.height;

    let boundary_width = (width / 4) * 3;

    for i in 0..N {
        let (x, y, vx, vy) = buffer[i];

        let mut dx = (x as f64 + vx).round_ties_even() as i32;
        let mut dy = (y as f64 + vy).round_ties_even() as i32;

        let velocity = vx.hypot(vy);

        let rn = rng.random_range(0.0..1.0);
        let ra = rn * 2.0 * PI;

        let mut rvx = velocity * ra.cos();
        let mut rvy = velocity * ra.sin();

        if dx > boundary_width as i32 { rvx = -rvx; dx = boundary_width as i32; }
        if dy > height         as i32 { rvy = -rvy; dy = height         as i32; }

        if dx < 0 { rvx = -rvx; dx = 0; }
        if dy < 0 { rvy = -rvy; dy = 0; }
        
        let safe_x = dx.clamp(0, (width - 1) as i32) as u32;
        let safe_y = dy.clamp(0, (height - 1) as i32) as u32;

        buffer[i] = (safe_x, safe_y, rvx, rvy);
    }
}

pub fn step_buffer(electron_buffer: &mut Vec<(u32, u32, f64, f64)>, packet_buffer: &mut Vec<(u32, u32, f64, f64)>, canvas: &CanvasHandler, f: f32) -> u32 {
    const MAX_VERTICAL_DEVIATION: i32 = 25;

    const AVG_VELOCITY_MAGNITUDE: f64 = 5.0;
    const MAX_VELOCITY_DEVIATION: f64 = 2.5;

    const HITBOX_SQ: f64 = 25.0;

    const PLANCK_H: f64 = 0.01;
    const WORK_FUNCTION: f64 = 4.0;

    // when a packet collides with an electron
    // it should transfer its energy to the electron
    // which increases its velocity magnitude
    
    // therefore the bounds checking for the electron
    // staying in the metal lattice should check
    // if the electrons velocity magnitude is above
    // the average, and let it escape if so

    let mut rng = rand::rng();

    let N = electron_buffer.len();

    let width  = canvas.width;
    let height = canvas.height;

    let boundary_width = width / 3;

    let mut escaped_electron_count = 0;

    for i in 0..N {
        let (x, y, vx, vy) = electron_buffer[i];

        let dx = (x as f64 + vx).round_ties_even() as i32;
        let dy = (y as f64 + vy).round_ties_even() as i32;

        let mut rvx = vx;
        let mut rvy = vy;

        let mag = vx.hypot(vy);
        if mag < (AVG_VELOCITY_MAGNITUDE + MAX_VELOCITY_DEVIATION) {
            if dx > boundary_width as i32 { rvx = -rvx; }
            if dy > height         as i32 { rvy = -rvy; }

            if dx < 0 { rvx = -rvx; }
            if dy < 0 { rvy = -rvy; }
        }
        
        let safe_x = dx.clamp(0, (width - 1) as i32) as u32;
        let safe_y = dy.clamp(0, (height - 1) as i32) as u32;

        electron_buffer[i] = (safe_x, safe_y, rvx, rvy);
    }

    let I = packet_buffer.len();

    for i in 0..I {
        let (x, y, vx, vy) = packet_buffer[i];

        let mut dx = (x as f64 + vx).round_ties_even() as u32;
        let mut dy = (y as f64 + vy).round_ties_even() as u32;

        if dx == 0 {
            let x_offset = rng.random_range(0..width);
            let rx = width + x_offset;

            let dry = rng.random_range(-MAX_VERTICAL_DEVIATION..MAX_VERTICAL_DEVIATION);
            let ry = ((height as i32 / 2) + dry) as u32;

            dx = rx;
            dy = ry;
        }

        for j in 0..N {
            let (ex, ey, evx, evy) = electron_buffer[j];

            let dist_sq = (dx as f64 - ex as f64).powi(2) + (dy as f64 - ey as f64).powi(2);
            if dist_sq > HITBOX_SQ { continue; }

            let packet_energy = PLANCK_H * f as f64;

            let remaining_energy = packet_energy - WORK_FUNCTION;

            if remaining_energy > 0.0 {
                let boost = remaining_energy.sqrt() * 2.0;
                
                let devx = evx + boost;
                let devy = evy + (rng.random_range(-1.0..1.0));

                electron_buffer[j] = (ex, ey, devx, devy);
                escaped_electron_count += 1;
            }

            let x_offset = rng.random_range(0..width);
            let rx = width + x_offset;

            let dry = rng.random_range(-MAX_VERTICAL_DEVIATION..MAX_VERTICAL_DEVIATION);
            let ry = ((height as i32 / 2) + dry) as u32;

            dx = rx;
            dy = ry;

            break;
        }

        packet_buffer[i] = (dx, dy, vx, vy);
    }

    return escaped_electron_count;
}

pub fn step_buffer_energy(electron_buffer: &mut Vec<(u32, u32, f64, f64)>, packet_buffer: &mut Vec<(u32, u32, f64, f64)>, canvas: &CanvasHandler, f: f32) -> f32 {
    const MAX_VERTICAL_DEVIATION: i32 = 25;

    const AVG_VELOCITY_MAGNITUDE: f64 = 5.0;
    const MAX_VELOCITY_DEVIATION: f64 = 2.5;

    const HITBOX_SQ: f64 = 25.0;

    const PLANCK_H: f64 = 0.01;
    const WORK_FUNCTION: f64 = 4.0;

    // when a packet collides with an electron
    // it should transfer its energy to the electron
    // which increases its velocity magnitude
    
    // therefore the bounds checking for the electron
    // staying in the metal lattice should check
    // if the electrons velocity magnitude is above
    // the average, and let it escape if so

    let mut rng = rand::rng();

    let N = electron_buffer.len();

    let width  = canvas.width;
    let height = canvas.height;

    let boundary_width = width / 3;

    let mut max_k = 0.0;

    for i in 0..N {
        let (x, y, vx, vy) = electron_buffer[i];

        let dx = (x as f64 + vx).round_ties_even() as i32;
        let dy = (y as f64 + vy).round_ties_even() as i32;

        let mut rvx = vx;
        let mut rvy = vy;

        let mag = vx.hypot(vy);
        if mag < (AVG_VELOCITY_MAGNITUDE + MAX_VELOCITY_DEVIATION) {
            if dx > boundary_width as i32 { rvx = -rvx; }
            if dy > height         as i32 { rvy = -rvy; }

            if dx < 0 { rvx = -rvx; }
            if dy < 0 { rvy = -rvy; }
        }
        
        let safe_x = dx.clamp(0, (width - 1) as i32) as u32;
        let safe_y = dy.clamp(0, (height - 1) as i32) as u32;

        electron_buffer[i] = (safe_x, safe_y, rvx, rvy);
    }

    let I = packet_buffer.len();

    for i in 0..I {
        let (x, y, vx, vy) = packet_buffer[i];

        let mut dx = (x as f64 + vx).round_ties_even() as u32;
        let mut dy = (y as f64 + vy).round_ties_even() as u32;

        if dx == 0 {
            let x_offset = rng.random_range(0..width);
            let rx = width + x_offset;

            let dry = rng.random_range(-MAX_VERTICAL_DEVIATION..MAX_VERTICAL_DEVIATION);
            let ry = ((height as i32 / 2) + dry) as u32;

            dx = rx;
            dy = ry;
        }

        for j in 0..N {
            let (ex, ey, evx, evy) = electron_buffer[j];

            let dist_sq = (dx as f64 - ex as f64).powi(2) + (dy as f64 - ey as f64).powi(2);
            if dist_sq > HITBOX_SQ { continue; }

            let packet_energy = PLANCK_H * f as f64;

            let remaining_energy = packet_energy - WORK_FUNCTION;

            if remaining_energy > 0.0 {
                let boost = remaining_energy.sqrt() * 2.0;

                if remaining_energy > max_k { max_k = remaining_energy; }
                
                let devx = evx + boost;
                let devy = evy + (rng.random_range(-1.0..1.0));

                electron_buffer[j] = (ex, ey, devx, devy);
            }

            let x_offset = rng.random_range(0..width);
            let rx = width + x_offset;

            let dry = rng.random_range(-MAX_VERTICAL_DEVIATION..MAX_VERTICAL_DEVIATION);
            let ry = ((height as i32 / 2) + dry) as u32;

            dx = rx;
            dy = ry;

            break;
        }

        packet_buffer[i] = (dx, dy, vx, vy);
    }

    return max_k as f32;
}

pub fn render_state_buffer_beta(electron_buffer: &Vec<(u32, u32, f64, f64)>, packet_buffer: &Vec<(u32, u32, f64, f64)>, canvas: &mut CanvasHandler) {
    let N = electron_buffer.len();
    let I = packet_buffer.len();

    const ELECTRON_R: u32 = 1;

    let width  = canvas.width;

    canvas.clear();

    for i in 0..N {
        let (x, y, _, _) = electron_buffer[i];

        if x + ELECTRON_R >= canvas.width  { continue; }
        if y + ELECTRON_R >= canvas.height { continue; }

        if x < ELECTRON_R { continue }
        if y < ELECTRON_R { continue }

        canvas.draw_circle(x, y, ELECTRON_R, true);
    }

    for i in 0..I {
        let (x, y, _, _) = packet_buffer[i];

        if x > width { continue; }

        canvas.draw_dot(x, y);
    }
}

pub fn render_state_buffer(electron_buffer: &Vec<(u32, u32, f64, f64)>, packet_buffer: &Vec<(u32, u32, f64, f64)>, canvas: &mut CanvasHandler, f: f32) {
    let N = electron_buffer.len();
    let I = packet_buffer.len();

    const ELECTRON_R: u32 = 1;
    const PACKET_R:   u32 = 2;

    let width  = canvas.width;

    canvas.clear();

    for i in 0..N {
        let (x, y, _, _) = electron_buffer[i];

        if x + ELECTRON_R >= canvas.width  { continue; }
        if y + ELECTRON_R >= canvas.height { continue; }

        if x < ELECTRON_R { continue }
        if y < ELECTRON_R { continue }

        canvas.draw_circle(x, y, ELECTRON_R, true);
    }

    const SOL: f64 = 299_792_458.0;

    let frequency_hz = f as f64 * 1e12; 
    let wavelength_m = SOL / frequency_hz;
    let wl_nm = wavelength_m * 1e9;

    let hex = wavelength_to_hex(wl_nm);

    for i in 0..I {
        let (x, y, _, _) = packet_buffer[i];

        if x > width { continue; }

        if x + PACKET_R >= canvas.width  { continue; }
        if y + PACKET_R >= canvas.height { continue; }

        if x < PACKET_R { continue }
        if y < PACKET_R { continue }

        canvas.draw_circle_color(x, y, PACKET_R, true, hex);
    }
}