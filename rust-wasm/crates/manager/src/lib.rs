use shared::CanvasHandler;
use task_6::{ElectronNode, HistographicTile};
use task_10::{CloudNode, Orbital};
use wasm_bindgen::prelude::*;

// cargo new --lib shared
// cargo watch -w crates/ -i ".gitignore" -i "pkg/*" -s "wasm-pack build crates/manager --target bundler --out-dir ../../pkg --release"

#[wasm_bindgen]
pub struct WasmManager {
    canvas: CanvasHandler,

    task_2_0_vars: (u32, u32),
    task_2_0_buffer: Vec<(u32, u32, f64, f64)>,

    task_4_0_buffer: Vec<(u32, u32, f64, f64)>,
    task_4_0_buffer2: Vec<(u32, u32, f64, f64)>,

    task_6_0_electron_buffer: Vec<ElectronNode>,
    task_6_0_scalar: u32,
    task_6_0_branch_count: u32,
    task_6_1_tile_buffer: Vec<HistographicTile>,
    task_6_2_gratings: Vec<(u16, u16, u16, u16)>,
    task_6_2_height: u32,
    task_6_2_count: u32,
    task_6_2_spacing: u32,

    task_10_0_orbital: Option<Orbital>,
    task_10_0_cloud: Vec<CloudNode>,
    task_10_0_half: f64,
    task_10_0_points: usize,
    task_10_0_zoom: f64,

    task_10_1_a: Option<Orbital>,
    task_10_1_b: Option<Orbital>,
    task_10_1_peak: f64,
    task_10_1_zoom: f64,
}

#[wasm_bindgen]
impl WasmManager {
    pub fn new() -> Self {
        return Self {
            canvas: CanvasHandler::new(),

            task_2_0_vars: (0, 0),
            task_2_0_buffer: vec![],

            task_4_0_buffer: vec![],
            task_4_0_buffer2: vec![],

            task_6_0_electron_buffer: vec![],
            task_6_0_scalar: 0,
            task_6_0_branch_count: 0,
            task_6_1_tile_buffer: vec![],
            task_6_2_gratings: vec![],
            task_6_2_height: 0,
            task_6_2_count: 0,
            task_6_2_spacing: 0,

            task_10_0_orbital: None,
            task_10_0_cloud: vec![],
            task_10_0_half: 0.0,
            task_10_0_points: 0,
            task_10_0_zoom: 0.0,

            task_10_1_a: None,
            task_10_1_b: None,
            task_10_1_peak: 0.0,
            task_10_1_zoom: 0.0,
        };
    }

    pub fn define_canvas(&mut self, width: u32, height: u32, bg: u32) {
        self.canvas.define_canvas(width, height, bg);
    }

    pub fn get_pixels_ptr(&self) -> *const u32 {
        return self.canvas.pixels.as_ptr();
    }

    pub fn task_1_0(&mut self, seed: u64, N: u32, s: u32) {
        task_1::random_walk(&mut self.canvas, seed, N, s);
    }
    pub fn task_1_1(&mut self, seed: u64, n: u32, N: u32, s: u32) {
        task_1::random_multi_walk(&mut self.canvas, seed, n, N, s);
    }
    pub fn task_1_2(&mut self, seed: u64, Rx: f32, Ry: f32, Rz: f32, n: u32, N: u32, s: u32) {
        task_1::random_multi_walk_3d(&mut self.canvas, seed, Rx, Ry, Rz, n, N, s);
    }

    pub fn task_2_0(&mut self, N: u32, r: u32, R: u32) {
        if self.task_2_0_buffer.len() != (N + 1) as usize {
            task_2::init_state_buffer(&mut self.task_2_0_buffer, &self.canvas, N, r, R);
            task_2::rinse_particle(&mut self.task_2_0_buffer, N, r, R);
        }

        if self.task_2_0_vars.0 != r || self.task_2_0_vars.1 != R {
            self.task_2_0_vars = (r, R);
            task_2::rinse_particle(&mut self.task_2_0_buffer, N, r, R);
        }

        task_2::step_buffer_beta(&mut self.task_2_0_buffer);
        task_2::render_state_buffer(&self.task_2_0_buffer, &mut self.canvas, r, R);
    }
    pub fn task_2_1(&mut self, N: u32, m: u32, r: u32, M: u32, R: u32) {
        if self.task_2_0_buffer.len() != (N + 1) as usize {
            task_2::init_state_buffer(&mut self.task_2_0_buffer, &self.canvas, N, r, R);
        }

        if self.task_2_0_vars.0 != r || self.task_2_0_vars.1 != R {
            self.task_2_0_vars = (r, R);
            task_2::rinse_particle(&mut self.task_2_0_buffer, N, r, R);
        }

        task_2::step_buffer(&mut self.task_2_0_buffer, &self.canvas, r, m, R, M);
        task_2::rinse_particle(&mut self.task_2_0_buffer, N, r, R);
        task_2::render_state_buffer(&self.task_2_0_buffer, &mut self.canvas, r, R);
    }
    pub fn task_2_2(&mut self, N: u32, m: u32, r: u32, M: u32, R: u32) {
        if self.task_2_0_buffer.len() != (N + 1) as usize {
            task_2::init_state_buffer(&mut self.task_2_0_buffer, &self.canvas, N, r, R);
        }

        if self.task_2_0_vars.0 != r || self.task_2_0_vars.1 != R {
            self.task_2_0_vars = (r, R);
            task_2::rinse_particle(&mut self.task_2_0_buffer, N, r, R);
        }

        task_2::step_buffer_bouncy(&mut self.task_2_0_buffer, &self.canvas, r, m, R, M);
        task_2::rinse_particle(&mut self.task_2_0_buffer, N, r, R);
        task_2::render_state_buffer(&self.task_2_0_buffer, &mut self.canvas, r, R);
    }

    pub fn task_4_0_0(&mut self, N: u32) {
        if self.task_4_0_buffer.len() != N as usize {
            task_4::init_state_buffer_beta(&mut self.task_4_0_buffer, &self.canvas, N);
        }

        task_4::step_buffer_beta_walk(&mut self.task_4_0_buffer, &self.canvas);
        task_4::render_state_buffer_beta(
            &self.task_4_0_buffer,
            &self.task_4_0_buffer2,
            &mut self.canvas,
        );
    }
    pub fn task_4_0_1(&mut self, N: u32) {
        if self.task_4_0_buffer.len() != N as usize {
            task_4::init_state_buffer_beta(&mut self.task_4_0_buffer, &self.canvas, N);
        }

        task_4::step_buffer_beta(&mut self.task_4_0_buffer, &self.canvas);
        task_4::render_state_buffer_beta(
            &self.task_4_0_buffer,
            &self.task_4_0_buffer2,
            &mut self.canvas,
        );
    }
    pub fn task_4_1(&mut self, N: u32, f: f32, I: u32) -> u32 {
        if self.task_4_0_buffer.len() != N as usize {
            task_4::init_state_buffer(&mut self.task_4_0_buffer, &self.canvas, N);
        }
        if self.task_4_0_buffer2.len() != I as usize {
            task_4::init_state_buffer_packets_beta(&mut self.task_4_0_buffer2, &self.canvas, I);
        }

        let escaped_electron_count = task_4::step_buffer(
            &mut self.task_4_0_buffer,
            &mut self.task_4_0_buffer2,
            &self.canvas,
            f,
        );
        task_4::render_state_buffer(
            &self.task_4_0_buffer,
            &self.task_4_0_buffer2,
            &mut self.canvas,
            f,
        );

        escaped_electron_count
    }
    pub fn task_4_2(&mut self, N: u32, f: f32, I: u32) -> f32 {
        if self.task_4_0_buffer.len() != N as usize {
            task_4::init_state_buffer(&mut self.task_4_0_buffer, &self.canvas, N);
        }
        if self.task_4_0_buffer2.len() != I as usize {
            task_4::init_state_buffer_packets_beta(&mut self.task_4_0_buffer2, &self.canvas, I);
        }

        let max_k = task_4::step_buffer_energy(
            &mut self.task_4_0_buffer,
            &mut self.task_4_0_buffer2,
            &self.canvas,
            f,
        );
        task_4::render_state_buffer(
            &self.task_4_0_buffer,
            &self.task_4_0_buffer2,
            &mut self.canvas,
            f,
        );

        max_k
    }

    pub fn task_6_0(&mut self, m: u32, scalar: u32) {
        if self.task_6_0_electron_buffer.len() == 0 {
            task_6::init_electron_buffer(&mut self.task_6_0_electron_buffer, &self.canvas, scalar);
            self.canvas.clear();
        }

        if m != self.task_6_0_branch_count {
            self.task_6_0_branch_count = m;
            task_6::init_electron_buffer(&mut self.task_6_0_electron_buffer, &self.canvas, scalar);

            self.canvas.clear();
        }

        if scalar != self.task_6_0_scalar {
            self.task_6_0_scalar = scalar;
            task_6::init_electron_buffer(&mut self.task_6_0_electron_buffer, &self.canvas, scalar);

            self.canvas.clear();
        }

        task_6::step_electron_buffer(&mut self.task_6_0_electron_buffer, m, &self.canvas, scalar);
        task_6::draw_electron_buffer(&self.task_6_0_electron_buffer, &mut self.canvas, scalar);
    }
    pub fn task_6_1(&mut self, m: u32, t: u32, scalar: u32, overlay: bool) {
        if self.task_6_0_electron_buffer.len() == 0 {
            task_6::init_electron_buffer(&mut self.task_6_0_electron_buffer, &self.canvas, scalar);
            self.canvas.clear();
        }

        if m != self.task_6_0_branch_count {
            self.task_6_0_branch_count = m;
            task_6::init_electron_buffer(&mut self.task_6_0_electron_buffer, &self.canvas, scalar);

            self.canvas.clear();
        }

        if scalar != self.task_6_0_scalar {
            self.task_6_0_scalar = scalar;
            task_6::init_electron_buffer(&mut self.task_6_0_electron_buffer, &self.canvas, scalar);

            self.canvas.clear();
        }

        let tile_count = (t * t) as usize;
        if tile_count != self.task_6_1_tile_buffer.len() {
            task_6::init_electron_buffer(&mut self.task_6_0_electron_buffer, &self.canvas, scalar);
            task_6::init_tile_buffer(&mut self.task_6_1_tile_buffer, &self.canvas, t);
            self.canvas.clear();
        }

        task_6::step_electron_buffer(&mut self.task_6_0_electron_buffer, m, &self.canvas, scalar);
        task_6::step_tile_buffer(
            &mut self.task_6_1_tile_buffer,
            &self.task_6_0_electron_buffer,
            scalar,
        );

        task_6::draw_tile_buffer(&self.task_6_1_tile_buffer, t, &mut self.canvas);
        if overlay {
            task_6::draw_electron_buffer(&self.task_6_0_electron_buffer, &mut self.canvas, scalar)
        }
    }
    pub fn task_6_2(&mut self, m: u32, t: u32, c: u32, h: u32, s: u32, scalar: u32, overlay: bool) {
        if self.task_6_2_gratings.len() == 0 {
            task_6::init_gratings(
                &mut self.task_6_2_gratings,
                &self.canvas,
                scalar,
                c as u16,
                h as u16,
                s as u16,
            );
            self.canvas.clear();
        }

        if self.task_6_0_electron_buffer.len() == 0 {
            task_6::init_electron_buffer(&mut self.task_6_0_electron_buffer, &self.canvas, scalar);
            self.canvas.clear();
        }

        if m != self.task_6_0_branch_count {
            self.task_6_0_branch_count = m;
            task_6::init_electron_buffer(&mut self.task_6_0_electron_buffer, &self.canvas, scalar);

            self.canvas.clear();
        }

        if scalar != self.task_6_0_scalar {
            self.task_6_0_scalar = scalar;
            task_6::init_electron_buffer(&mut self.task_6_0_electron_buffer, &self.canvas, scalar);
            task_6::init_gratings(
                &mut self.task_6_2_gratings,
                &self.canvas,
                scalar,
                c as u16,
                h as u16,
                s as u16,
            );

            self.canvas.clear();
        }

        let tile_count = (t * t) as usize;
        if tile_count != self.task_6_1_tile_buffer.len() {
            task_6::init_electron_buffer(&mut self.task_6_0_electron_buffer, &self.canvas, scalar);
            task_6::init_tile_buffer(&mut self.task_6_1_tile_buffer, &self.canvas, t);
            self.canvas.clear();
        }

        if c != self.task_6_2_count {
            self.task_6_2_count = c;
            task_6::init_electron_buffer(&mut self.task_6_0_electron_buffer, &self.canvas, scalar);
            task_6::init_gratings(
                &mut self.task_6_2_gratings,
                &self.canvas,
                scalar,
                c as u16,
                h as u16,
                s as u16,
            );
            self.canvas.clear();
        }

        if h != self.task_6_2_height {
            self.task_6_2_height = h;
            task_6::init_electron_buffer(&mut self.task_6_0_electron_buffer, &self.canvas, scalar);
            task_6::init_gratings(
                &mut self.task_6_2_gratings,
                &self.canvas,
                scalar,
                c as u16,
                h as u16,
                s as u16,
            );
            self.canvas.clear();
        }

        if s != self.task_6_2_spacing {
            self.task_6_2_spacing = s;
            task_6::init_electron_buffer(&mut self.task_6_0_electron_buffer, &self.canvas, scalar);
            task_6::init_gratings(
                &mut self.task_6_2_gratings,
                &self.canvas,
                scalar,
                c as u16,
                h as u16,
                s as u16,
            );
            self.canvas.clear();
        }

        task_6::step_electron_buffer_gratings(
            &mut self.task_6_0_electron_buffer,
            &self.task_6_2_gratings,
            m,
            &self.canvas,
            scalar,
        );
        task_6::step_tile_buffer(
            &mut self.task_6_1_tile_buffer,
            &self.task_6_0_electron_buffer,
            scalar,
        );

        task_6::draw_tile_buffer(&self.task_6_1_tile_buffer, t, &mut self.canvas);
        task_6::draw_gratings(&self.task_6_2_gratings, &mut self.canvas, scalar);
        if overlay {
            task_6::draw_electron_buffer(&self.task_6_0_electron_buffer, &mut self.canvas, scalar)
        }
    }

    pub fn task_10_energy(&self, n: u32, z: f64, a: f64) -> f64 {
        return task_10::energy(&task_10::make_orbital(n, 0, 0, z, a));
    }

    pub fn task_10_mean_radius(&self, n: u32, l: u32, z: f64, a: f64) -> f64 {
        return task_10::mean_radius(&task_10::make_orbital(n, l, 0, z, a));
    }

    pub fn task_10_0(
        &mut self,
        n: u32,
        l: u32,
        m: i32,
        z: f64,
        a: f64,
        plane: u32,
        zoom: f64,
    ) -> f64 {
        let orb = task_10::make_orbital(n, l, m, z, a);

        return task_10::draw_slice(&mut self.canvas, &orb, plane, zoom);
    }

    pub fn task_10_1(
        &mut self,
        n: u32,
        l: u32,
        m: i32,
        z: f64,
        a: f64,
        points: u32,
        zoom: f64,
        yaw: f64,
        pitch: f64,
        gain: f64,
    ) {
        let orb = task_10::make_orbital(n, l, m, z, a);
        let points = points as usize;

        if self.task_10_0_orbital != Some(orb)
            || self.task_10_0_points != points
            || self.task_10_0_zoom != zoom
        {
            self.task_10_0_half = task_10::init_cloud_buffer(
                &mut self.task_10_0_cloud,
                &orb,
                points,
                zoom,
                0x9E37_79B9,
            );

            self.task_10_0_orbital = Some(orb);
            self.task_10_0_points = points;
            self.task_10_0_zoom = zoom;
        }

        task_10::draw_cloud_buffer(
            &self.task_10_0_cloud,
            &mut self.canvas,
            self.task_10_0_half,
            yaw,
            pitch,
            gain,
        );
    }
}
