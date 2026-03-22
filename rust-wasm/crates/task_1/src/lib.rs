use std::{default, f64::consts::PI};

use rand::{self, RngExt, SeedableRng, rngs::StdRng};
use shared::{CanvasHandler, generate_colors, rotate_3d_x, rotate_3d_y, rotate_3d_z};

fn generate_walk_data(canvas: &CanvasHandler, seed: u64, N: u32, s: u32) -> Vec<[i32; 2]> {
    let mut rng = StdRng::seed_from_u64(seed);
    let mut walk_data = vec![[0 as i32; 2]; N as usize];

    walk_data[0] = [
        canvas.width  as i32 / 2,
        canvas.height as i32 / 2,
    ];

    let float_s = s as f64;
    for step in 1..N {
        let index = step as usize;

        let float: f64 = rng.random();
        let theta = float * 2.0 * PI;

        let x = walk_data[index-1][0];
        let y = walk_data[index-1][1];

        let delta_x = float_s * theta.cos();
        let delta_y = float_s * theta.sin();

        walk_data[index] = [
            x + delta_x as i32,
            y + delta_y as i32,
        ];
    }

    return walk_data;
}

fn generate_walk_data_3d(canvas: &CanvasHandler, seed: u64, N: u32, s: u32) -> Vec<[i32; 3]> {
    let mut rng = StdRng::seed_from_u64(seed);
    let mut walk_data_3d = vec![[0 as i32; 3]; N as usize];

    let depth = canvas.width + canvas.height / 2;
    walk_data_3d[0] = [
        canvas.width  as i32 / 2,
        canvas.height as i32 / 2,
        depth as i32 / 2,
    ];

    let pi_over_2 = PI / 2.0;

    let float_s = s as f64;
    for step in 1..N {
        let index = step as usize;

        let u1 = rng.random_range(0.0..=1.0);
        let u2 = rng.random_range(0.0..=1.0);

        let mapped_u1 = (2.0 * u1 - 1.0) as f64;
        let phi = mapped_u1.acos() - pi_over_2;

        let lambda = 2.0 * PI  * u2;

        let sin_phi = phi.sin();
        let cos_phi = phi.cos();

        let sin_lambda = lambda.sin();
        let cos_lambda = lambda.cos();

        let dx = float_s * cos_phi * cos_lambda;
        let dy = float_s * cos_phi * sin_lambda;
        let dz = float_s * sin_phi;

        let x = walk_data_3d[index-1][0];
        let y = walk_data_3d[index-1][1];
        let z = walk_data_3d[index-1][2];

        walk_data_3d[index] = [
            x + dx as i32,
            y + dy as i32,
            z + dz as i32,
        ];
    }

    return walk_data_3d;
}

pub fn random_walk(canvas: &mut CanvasHandler, seed: u64, N: u32, s: u32) {
    canvas.clear();

    let walk_data = generate_walk_data(canvas, seed, N, s);

    for step in 1..N {
        let index = step as usize;
        
        let x0 = walk_data[index - 1][0] as i32;
        let y0 = walk_data[index - 1][1] as i32;

        let x1 = walk_data[index][0] as i32;
        let y1 = walk_data[index][1] as i32;

        canvas.draw_line_old(
            x0, y0,
            x1, y1,
            0xff000000,
        );
    }
}

pub fn random_multi_walk(canvas: &mut CanvasHandler, seed: u64, n: u32, N: u32, s: u32) {
    let mut rng = StdRng::seed_from_u64(seed);
    canvas.clear();

    let mut multi_walk_data: Vec<Vec<[i32; 2]>> = Vec::new();
    for _ in 0..n {
        let walk_seed: u64 = rng.random();
        let walk_data = generate_walk_data(canvas, walk_seed, N, s);
        multi_walk_data.push(walk_data);
    }

    let random_colors = generate_colors(seed, n as usize, true);

    for walk in 0..n {
        let index = walk as usize;

        let walk_data = multi_walk_data.get(index)
            .expect("walk not found");
        let color = random_colors[index];

        for step in 1..N {
            let index = step as usize;
            
            let x0 = walk_data[index - 1][0] as i32;
            let y0 = walk_data[index - 1][1] as i32;

            let x1 = walk_data[index][0] as i32;
            let y1 = walk_data[index][1] as i32;

            canvas.draw_line_old(
                x0, y0,
                x1, y1,
                color,
            );
        }
    }
}


pub fn random_multi_walk_3d(canvas: &mut CanvasHandler, seed: u64, Rx: f32, Ry: f32, Rz: f32, n: u32, N: u32, s: u32) {
    let mut rng = StdRng::seed_from_u64(seed);
    canvas.clear();

    let mut multi_walk_data_3d: Vec<Vec<[i32; 3]>> = Vec::new();
    for _ in 0..n {
        let walk_seed: u64 = rng.random();
        let walk_data_3d = generate_walk_data_3d(canvas, walk_seed, N, s);
        multi_walk_data_3d.push(walk_data_3d);
    }

    let random_colors = generate_colors(seed, n as usize, true);

    for walk in 0..n {
        let index = walk as usize;

        let walk_data = multi_walk_data_3d.get(index)
            .expect("walk not found");
        let color = random_colors[index];

        for step in 1..N {
            let index = step as usize;

            let x0 = walk_data[index - 1][0];
            let y0 = walk_data[index - 1][1];
            let z0 = walk_data[index - 1][2];

            let x1 = walk_data[index][0];
            let y1 = walk_data[index][1];
            let z1 = walk_data[index][2];

            let [x0, y0, z0] = rotate_3d_x(x0, y0, z0, Rx as f64);
            let [x1, y1, z1] = rotate_3d_x(x1, y1, z1, Rx as f64);

            let [x0, y0, z0] = rotate_3d_y(x0, y0, z0, Ry as f64);
            let [x1, y1, z1] = rotate_3d_y(x1, y1, z1, Ry as f64);

            let [x0, y0, z0] = rotate_3d_z(x0, y0, z0, Rz as f64);
            let [x1, y1, z1] = rotate_3d_z(x1, y1, z1, Rz as f64);

            let x0 = x0 as f64;
            let y0 = y0 as f64;
            let z0 = z0 as f64;

            let x1 = x1 as f64;
            let y1 = y1 as f64;
            let z1 = z1 as f64;

            let near_plane = 1.0;
            if z0 < near_plane || z1 < near_plane  { continue; }

            let cx = canvas.height as f64 / 2.0;
            let cy = canvas.width  as f64 / 2.0;

            let f = 90 as f64;

            let px0 = ((x0 - cx) * (f / z0)) + cx;
            let py0 = ((y0 - cy) * (f / z0)) + cy;

            let px1 = ((x1 - cx) * (f / z1)) + cx;
            let py1 = ((y1 - cy) * (f / z1)) + cy;

            canvas.draw_line_old(
                px0 as i32, py0 as i32,
                px1 as i32, py1 as i32,
                color,
            );
        }
    }
}