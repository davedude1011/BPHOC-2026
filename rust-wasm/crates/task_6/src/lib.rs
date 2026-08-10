use rand::RngExt;
use rustc_hash::FxHashMap;
use std::f32::consts::{PI};

use rand::rngs::SmallRng;
use rand_distr::num_traits::{Float};
use rand_distr::{Distribution, Normal};
use shared::CanvasHandler;

#[derive(Clone, Copy)]
pub struct ElectronNode {
    x: f32,
    y: f32,
    theta0: f32,
    theta: f32,
    phase: f32,
    amplitude: f32,
    probability: f32,
}
pub struct HashElectronNode {
    X: f32,
    Y: f32,
    sin_theta_sum: f32,
    cos_theta_sum: f32,
    probability_sum: f32,
    merge_count: u32,
}

pub struct HistographicTile {
    x: u16,
    y: u16,
    X: f32,
    Y: f32,
    density: f32,
}

pub fn prune_electron_buffer(buffer: &mut Vec<ElectronNode>, canvas: &CanvasHandler, scalar: u32) {
    let mut spacial_hashmap: FxHashMap<(u32, u32, u32), HashElectronNode> = FxHashMap::default();

    let n = buffer.len();

    let width  = (canvas.width  / scalar) as f32;
    let height = (canvas.height / scalar) as f32;

    for i in 0..n {
        let electron = &buffer[i];

        if electron.x > width  { continue }
        if electron.y > height { continue }
        
        let wrapped_theta = electron.theta.rem_euclid(2.0 * PI);
        let rounded_theta = (wrapped_theta * 1.0).round() as u32;

        let x = electron.x.round() as u32;
        let y = electron.y.round() as u32;

        let key = (x, y, 0);

        let X = electron.amplitude * electron.phase.cos();
        let Y = electron.amplitude * electron.phase.sin();

        if spacial_hashmap.contains_key(&key) {
            let matching = spacial_hashmap.get_mut(&key).unwrap();
            matching.X += X;
            matching.Y += Y;
            matching.sin_theta_sum += electron.theta.sin();
            matching.cos_theta_sum += electron.theta.cos();
            matching.probability_sum += electron.probability;
            matching.merge_count += 1;
        }
        else {
            let hash_electron = HashElectronNode {
                X: X,
                Y: Y,
                sin_theta_sum: electron.theta.sin(),
                cos_theta_sum: electron.theta.cos(),
                probability_sum: electron.probability,
                merge_count: 1,
            };
            spacial_hashmap.insert(key, hash_electron);
        }
    }

    buffer.clear();

    for hash_data in spacial_hashmap {
        let ((x, y, _), hash_node) = hash_data;

        let theta = hash_node.sin_theta_sum.atan2(hash_node.cos_theta_sum).rem_euclid(2.0 * PI);
        let probability = hash_node.probability_sum / hash_node.merge_count as f32;
        let phase = hash_node.Y.atan2(hash_node.X).rem_euclid(2.0 * PI);
        let amplitude = ((hash_node.X.powi(2) + hash_node.Y.powi(2)) as f32).sqrt();

        let theta0 = theta;

        let x = x as f32;
        let y = y as f32;

        let electron = ElectronNode { x, y, theta0, theta, phase, amplitude, probability };
        buffer.push(electron);
    }
}

pub fn init_electron_buffer(buffer: &mut Vec<ElectronNode>, canvas: &CanvasHandler, scalar: u32) {
    let mut rng: SmallRng = rand::make_rng();

    let width  = (canvas.width  / scalar) as f32;
    let height = (canvas.height / scalar) as f32;

    buffer.clear();

    let x = width / 20.0;
    let y = height / 2.0;

    let theta = 0.0;
    let theta0 = theta;

    let float: f32 = rng.random();
    let phase = float * 2.0 * PI;

    let amplitude = 100.0;
    let probability = 1.0;

    let electron_node = ElectronNode { x, y, theta0, theta, phase, amplitude, probability };
    buffer.push(electron_node);

    prune_electron_buffer(buffer, canvas, scalar);
}

pub fn step_electron_buffer(buffer: &mut Vec<ElectronNode>, m: u32, canvas: &CanvasHandler, scalar: u32) {
    const ELECTRON_STEP_SIZE: f32 = 4.0;
    const PHASE_CONSTANT: f32 = 0.1;

    let mut rng: SmallRng = rand::make_rng();

    let width  = (canvas.width  / scalar) as f32;
    let height = (canvas.height / scalar) as f32;

    let mean = 0.0;
    let std_dev = 0.15;

    let dist = Normal::new(mean, std_dev).unwrap();
    let approx_inverse_variance = 1.0 / (2.0 * std_dev.powi(2));

    let n = buffer.len();
    buffer.reserve(n * m as usize);

    for i in 0..n {
        let electron = buffer[i];

        for _ in 0..m {
            let delta_theta = dist.sample(&mut rng);
            let prob = (-delta_theta.powi(2) * approx_inverse_variance).exp();

            let theta0 = electron.theta;
            
            let mut theta = theta0 + delta_theta;
                    
            let amplitude = if prob > 0.99989 { electron.amplitude } else { (electron.amplitude * prob * 1.40) / m as f32 };
            if amplitude < 7.5e-5 { continue }
            
            let probability = electron.probability * prob;

            let mut delta_x = ELECTRON_STEP_SIZE * theta.cos();
            let mut delta_y = ELECTRON_STEP_SIZE * theta.sin();

            let tx = electron.x + delta_x;
            let ty = electron.y + delta_y;

            if tx >= width    { theta = PI - theta; delta_x = -delta_x }
            else if tx <= 0.0 { theta = PI - theta; delta_x = -delta_x }

            if ty >= height   { theta = 2.0 * PI - theta; delta_y = -delta_y }
            else if ty <= 0.0 { theta = 2.0 * PI - theta; delta_y = -delta_y }

            let x = electron.x + delta_x;
            let y = electron.y + delta_y;

            let phase = (electron.phase + (ELECTRON_STEP_SIZE as f32) * PHASE_CONSTANT) % (2.0 * PI);

            let new_electron = ElectronNode { x, y, theta0, theta, phase, amplitude, probability };
            buffer.push(new_electron);
        }
    }

    buffer.drain(0..n);

    prune_electron_buffer(buffer, canvas, scalar);
}

pub fn draw_electron_buffer(buffer: &Vec<ElectronNode>, canvas: &mut CanvasHandler, scalar: u32) {
    let n = buffer.len();

    let width  = (canvas.width  / scalar) as f32;
    let height = (canvas.height / scalar) as f32;

    canvas.decrease_alpha(4);

    for i in 0..n {
        let electron = &buffer[i];

        if electron.x > width  - 1.0 { continue }
        if electron.y > height - 1.0 { continue }

        canvas.draw_dot(
            (electron.x * scalar as f32).round() as u32,
            (electron.y * scalar as f32).round() as u32,
        );
    }
}

pub fn init_tile_buffer(buffer: &mut Vec<HistographicTile>, canvas: &CanvasHandler, t: u32) {
    let width  = canvas.width;
    let height = canvas.height;

    let min = width.min(height);
    let tile_size = min / t;

    let tile_count = t * t;

    buffer.clear();
    buffer.reserve(tile_count as usize);

    let X:       f32 = 0.0;
    let Y:       f32 = 0.0;
    let density: f32 = 0.0;

    for ix in 0..t {
        let x = (ix * tile_size + (tile_size / 2)) as u16;

        for iy in 0..t {
            let y = (iy * tile_size + (tile_size / 2)) as u16;
            
            let tile = HistographicTile { x, y, X, Y, density };
            buffer.push(tile);
        }
    }
}

pub fn zero_tile_buffer(buffer: &mut Vec<HistographicTile>) {
    for tile in buffer {
        tile.X = 0.0;
        tile.Y = 0.0;
        tile.density = 0.0;
    }
}

pub fn step_tile_buffer(buffer: &mut Vec<HistographicTile>, electrons: &Vec<ElectronNode>, scalar: u32) {
    const DISTANCE_THRESHOLD: f32 = 250.0;

    let t = buffer.len();
    let n = electrons.len();

    // first pass: summing electrons for X, Y
    for i in 0..t {
        let tile = &mut buffer[i];

        tile.X = 0.0;
        tile.Y = 0.0;

        for j in 0..n {
            let electron = &electrons[j];

            let dx = tile.x as f32 - electron.x * scalar as f32;
            let dy = tile.y as f32 - electron.y * scalar as f32;
            let distance = (dx.powi(2) + dy.powi(2)).sqrt();

            if distance > DISTANCE_THRESHOLD { continue }
            
            let weighting = 1.0 / (distance * 0.05 + 1.0);

            let weighted_amplitude = electron.amplitude * weighting;
            let weighted_phase = electron.phase;

            let dX = weighted_amplitude * weighted_phase.cos();
            let dY = weighted_amplitude * weighted_phase.sin();

            tile.X += dX;
            tile.Y += dY;
        }
    }

    // let mut min_density = f32::INFINITY;
    let mut max_density = f32::NEG_INFINITY;

    // second pass: calculating densities, and min-max
    for i in 0..t {
        let tile = &mut buffer[i];

        let density = tile.X.powi(2) + tile.Y.powi(2);
        let density = (1.0 + density * 0.0005).ln();

        max_density = max_density.max(density);

        tile.density = density;
    }

    // third pass: normalizing density between 0 and 1
    for i in 0..t {
        let tile = &mut buffer[i];
        
        if max_density > 0.0 {
            tile.density /= max_density;
        }
        else {
            tile.density = 0.0;
        }
    }
}

pub fn draw_tile_buffer(buffer: &Vec<HistographicTile>, t: u32, canvas: &mut CanvasHandler) {
    let width  = canvas.width;
    let height = canvas.height;

    let min = width.min(height);
    let tile_size = min / t;
    let tile_radius = tile_size / 2;

    canvas.clear();

    for tile in buffer {
        let alpha_byte = (tile.density * 255.0).round() as u32;
        let color = alpha_byte << 24;

        canvas.draw_square(
            tile.x as u32,
            tile.y as u32,
            tile_radius,
            color,
        );
    }
}

pub fn init_tile_buffer_left(buffer: &mut Vec<HistographicTile>, canvas: &CanvasHandler, t: u32) {
    let width  = canvas.width / 2;
    let height = canvas.height;

    let min = width.min(height);
    let tile_size = min / t;

    let tile_count = t * t;

    buffer.clear();
    buffer.reserve(tile_count as usize);

    let X:       f32 = 0.0;
    let Y:       f32 = 0.0;
    let density: f32 = 0.0;

    for ix in 0..t {
        let x = (ix * tile_size + (tile_size / 2)) as u16;

        for iy in 0..t {
            let y = (iy * tile_size + (tile_size / 2)) as u16;
            
            let tile = HistographicTile { x, y, X, Y, density };
            buffer.push(tile);
        }
    }
}

pub fn init_gratings(buffer: &mut Vec<(u16, u16, u16, u16)>, canvas: &CanvasHandler, scalar: u32, c: u16, h: u16, s: u16) {
    const WIDTH: u16 = 5;

    let width  = (canvas.width  / scalar) as u16;
    let height = (canvas.height / scalar) as u16;

    buffer.clear();

    let x1 = width / 3 - WIDTH / 2;
    let x2 = width / 3 + WIDTH / 2;

    let total_spacing = if c > 1 { (c - 1) * s } else { 0 };
    let total_height  = c * h + total_spacing;
    let y_offset      = (height - total_height) / 2;

    let mut gap_positions: Vec<(u16, u16)> = Vec::new();

    for i in 0..c {
        let gy1 = y_offset + i * (h + s);
        let gy2 = gy1 + h;
        gap_positions.push((gy1, gy2));
    }

    let mut cursor: u16 = 0;

    for (gy1, gy2) in &gap_positions {
        if cursor < *gy1 {
            buffer.push((x1, cursor, x2, *gy1));
        }
        cursor = *gy2;
    }

    if cursor < height {
        buffer.push((x1, cursor, x2, height));
    }
}

pub fn draw_gratings(buffer: &Vec<(u16, u16, u16, u16)>, canvas: &mut CanvasHandler, scalar: u32) {
    let n = buffer.len();

    for i in 0..n {
        let (x1, y1, x2, y2) = buffer[i];

        let x1 = (x1 as u32) * scalar;
        let x2 = (x2 as u32) * scalar;
        let y1 = (y1 as u32) * scalar;
        let y2 = (y2 as u32) * scalar;

        canvas.draw_rectangle(x1, y1, x2, y2, true);
    }
}

pub fn step_electron_buffer_gratings(buffer: &mut Vec<ElectronNode>, gratings: &Vec<(u16, u16, u16, u16)>, m: u32, canvas: &CanvasHandler, scalar: u32) {
    const ELECTRON_STEP_SIZE: f32 = 4.0;
    const PHASE_CONSTANT: f32 = 0.1;

    let mut rng: SmallRng = rand::make_rng();

    let width  = (canvas.width  / scalar) as f32;
    let height = (canvas.height / scalar) as f32;

    let mean = 0.0;
    let std_dev = 0.2;

    let dist = Normal::new(mean, std_dev).unwrap();
    let approx_inverse_variance = 1.0 / (2.0 * std_dev.powi(2));

    let n = buffer.len();
    buffer.reserve(n * m as usize);

    for i in 0..n {
        let electron = buffer[i];

        for _ in 0..m {
            let delta_theta = dist.sample(&mut rng);
            let prob = (-delta_theta.powi(2) * approx_inverse_variance).exp();

            let theta0 = electron.theta0;
            
            let mut theta = theta0 + delta_theta;
                    
            let amplitude = if prob > 0.99989 { electron.amplitude } else { (electron.amplitude * prob * 1.45) / m as f32 };
            if amplitude < 7.5e-5 { continue }
            
            let probability = electron.probability * prob;

            let mut delta_x = ELECTRON_STEP_SIZE * theta.cos();
            let mut delta_y = ELECTRON_STEP_SIZE * theta.sin();

            let tx = electron.x + delta_x;
            let ty = electron.y + delta_y;

            let mut phase = (electron.phase + (ELECTRON_STEP_SIZE as f32) * PHASE_CONSTANT) % (2.0 * PI);

            if tx >= width    { theta = PI - theta; delta_x = -delta_x; phase = (phase + PI) % (2.0 * PI) }
            else if tx <= 0.0 { theta = PI - theta; delta_x = -delta_x; phase = (phase + PI) % (2.0 * PI) }

            if ty >= height   { theta = 2.0 * PI - theta; delta_y = -delta_y; phase = (phase + PI) % (2.0 * PI) }
            else if ty <= 0.0 { theta = 2.0 * PI - theta; delta_y = -delta_y; phase = (phase + PI) % (2.0 * PI) }

            if !gratings.is_empty() {
                let barrier_x = gratings[0].0 as f32;

                let crossing_right = electron.x < barrier_x && tx >= barrier_x;
                let crossing_left  = electron.x > barrier_x && tx <= barrier_x;

                if crossing_right || crossing_left {
                    let blocked = gratings.iter().any(|&(_, gy1, _, gy2)| {
                        ty >= gy1 as f32 && ty <= gy2 as f32
                    });

                    if blocked { continue; }

                    let add = if crossing_left { 0.5 } else { -0.5 };
                    let new_theta: f32 = (rng.random::<f32>() + add) * PI;

                    let x = barrier_x;
                    let y = ty;
                    let theta0 = new_theta;
                    let theta  = new_theta;
                    let amplitude = amplitude + 1.5;

                    let phase = ((barrier_x + ty) * PHASE_CONSTANT).rem_euclid(2.0 * PI);

                    let new_electron = ElectronNode { x, y, theta0, theta, phase, amplitude, probability };
                    buffer.push(new_electron);
                    continue;
                }
            }

            let mut survives = true;

            for grating in gratings {
                let (x1, y1, x2, y2) = *grating;

                let x1 = x1 as f32;
                let y1 = y1 as f32;
                let x2 = x2 as f32;
                let y2 = y2 as f32;

                if tx < x1 { continue }
                if tx > x2 { continue }
                if ty < y1 { continue }
                if ty > y2 { continue }

                survives = false;
                break;
            }

            if !survives { continue }

            let x = electron.x + delta_x;
            let y = electron.y + delta_y;

            let new_electron = ElectronNode { x, y, theta0, theta, phase, amplitude, probability };
            buffer.push(new_electron);
        }
    }

    buffer.drain(0..n);

    prune_electron_buffer(buffer, canvas, scalar);
}