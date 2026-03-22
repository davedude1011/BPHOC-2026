use wasm_bindgen::prelude::*;
use shared::CanvasHandler;
use task_1;

// cargo new --lib shared
// cargo watch -i ".gitignore" -i "pkg/*" -s "wasm-pack build crates/manager --target bundler --out-dir ../../pkg"

#[wasm_bindgen]
pub struct WasmManager {
    canvas: CanvasHandler,

    task_2_0_vars: (u32, u32),
    task_2_0_buffer: Vec<(u32, u32, f64, f64)>
}

#[wasm_bindgen]
impl WasmManager {
    pub fn new() -> Self {
        return Self {
            canvas: CanvasHandler::new(),

            task_2_0_vars: (0, 0),
            task_2_0_buffer: vec![],
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
}