use std::collections::HashSet;

use rand::{RngExt, SeedableRng, rngs::StdRng};

pub struct CanvasHandler {
    pub width:  u32,
    pub height: u32,
    pub pixels: Vec<u32>,
}
impl CanvasHandler {
    pub fn new() -> Self {
        return Self {
            width:  0,
            height: 0,
            pixels: vec![],
        };
    }

    pub fn define_canvas(&mut self, width: u32, height: u32, bg: u32) {
        self.width = width;
        self.height = height;
        
        let size = (width * height) as usize;
        self.pixels = vec![bg; size];
    }

    pub fn clear(&mut self) {
        self.pixels.fill(0xffffffff);
    }

    pub fn draw_dot(&mut self, x: u32, y: u32) {
        let index = (y * self.width + x) as usize;
        self.pixels[index] = 0xff000000;
    }

    pub fn draw_dot_color(&mut self, x: u32, y: u32, color: u32) {
        let index = (y * self.width + x) as usize;
        self.pixels[index] = color;
    }

    pub fn draw_square(&mut self, cx: u32, cy: u32, r: u32, color: u32) {
        let tlx = cx - r;
        let tly = cy - r;

        let brx = cx + r;
        let bry = cy + r;

        for x in tlx..brx {
            for y in tly..bry {
                if x > self.width  - 1 { continue };
                if y > self.height - 1 { continue };

                self.draw_dot_color(x, y, color);
            }
        }
    }

    pub fn decrease_alpha(&mut self, n: u8) {
        let n_u32 = n as u32;
        
        for pixel in self.pixels.iter_mut() {
            let current_alpha = (*pixel >> 24) & 0xFF;
            let new_alpha = current_alpha.saturating_sub(n_u32);
            *pixel = (new_alpha << 24) | (*pixel & 0x00FFFFFF);
        }
    }

    pub fn draw_rectangle(&mut self, x1: u32, y1: u32, x2: u32, y2: u32, filled: bool) {
        let x1 = x1 as i32;
        let x2 = x2 as i32;
        let y1 = y1 as i32;
        let y2 = y2 as i32;

        let mut start_x = x1.min(x2);
        let mut end_x = x1.max(x2);
        let mut start_y = y1.min(y2);
        let mut end_y = y1.max(y2);

        start_x = start_x.max(0).min(self.width as i32);
        end_x = end_x.max(0).min(self.width as i32);
        start_y = start_y.max(0).min(self.height as i32);
        end_y = end_y.max(0).min(self.height as i32);

        if filled {
            for y in start_y..end_y {
                self.draw_line_h_color(start_x as u32, end_x as u32, y as u32, 0xff000000);
            }
        }
        else {
            self.draw_line_h_color(start_x as u32, end_x as u32, start_y as u32, 0xff000000);
            if end_y > start_y {
                self.draw_line_h_color(start_x as u32, end_x as u32, (end_y - 1) as u32, 0xff000000);
            }
            
            for y in start_y..end_y {
                self.safe_dot(start_x, y, 0xff000000);
                if end_x > start_x {
                    self.safe_dot(end_x - 1, y, 0xff000000);
                }
            }
        }
    }

    pub fn draw_circle(&mut self, cx: u32, cy: u32, r: u32, filled: bool) {
        let cx_i = cx as i32;
        let cy_i = cy as i32;
        let r_i = r as i32;

        let mut x = r_i;
        let mut y = 0;
        let mut d = 1 - r_i;

        while x >= y {
            if filled {
                self.clipped_hline_default(cx_i - x, cx_i + x, cy_i + y);
                self.clipped_hline_default(cx_i - x, cx_i + x, cy_i - y);
                self.clipped_hline_default(cx_i - y, cx_i + y, cy_i + x);
                self.clipped_hline_default(cx_i - y, cx_i + y, cy_i - x);
            } else {
                self.safe_dot_default(cx_i + x, cy_i + y);
                self.safe_dot_default(cx_i + y, cy_i + x);
                self.safe_dot_default(cx_i - y, cy_i + x);
                self.safe_dot_default(cx_i - x, cy_i + y);
                self.safe_dot_default(cx_i - x, cy_i - y);
                self.safe_dot_default(cx_i - y, cy_i - x);
                self.safe_dot_default(cx_i + y, cy_i - x);
                self.safe_dot_default(cx_i + x, cy_i - y);
            }

            y += 1;
            if d < 0 {
                d += 2 * y + 1;
            } else {
                x -= 1;
                d += 2 * (y - x) + 1;
            }
        }
    }

    fn clipped_hline_default(&mut self, x1: i32, x2: i32, y: i32) {
        if y < 0 || y >= self.height as i32 {
            return;
        }

        let mut start = x1;
        let mut end = x2;
        if start > end {
            std::mem::swap(&mut start, &mut end);
        }

        if start >= self.width as i32 || end < 0 {
            return;
        }

        let final_start = start.max(0) as u32;
        let final_end = end.min(self.width as i32 - 1) as u32;

        if final_start <= final_end {
            self.draw_line_h(final_start, final_end, y as u32);
        }
    }

    fn safe_dot_default(&mut self, x: i32, y: i32) {
        if x >= 0 && x < self.width as i32 && y >= 0 && y < self.height as i32 {
            self.draw_dot(x as u32, y as u32);
        }
    }

    pub fn draw_line(&mut self, x1: u32, y1: u32, x2: u32, y2: u32) {
        let mut x = x1 as i32;
        let mut y = y1 as i32;
        let x2 = x2 as i32;
        let y2 = y2 as i32;

        let dx = (x2 - x).abs();
        let dy = -(y2 - y).abs();

        let sx = if x < x2 { 1 } else { -1 };
        let sy = if y < y2 { 1 } else { -1 };

        let mut err = dx + dy;

        loop {
            self.draw_dot(x as u32, y as u32);
            if x == x2 && y == y2 { break; }
            let e2 = 2 * err;
            if e2 >= dy {
                err += dy;
                x += sx;
            }
            if e2 <= dx {
                err += dx;
                y += sy;
            }
        }
    }

    pub fn draw_line_h(&mut self, x1: u32, x2: u32, y: u32) {
        let row_offset = (y * self.width) as usize;
        let start = row_offset + x1 as usize;
        let end = row_offset + x2 as usize;
        
        for i in start..=end {
            self.pixels[i] = 0xff000000;
        }
    }

    pub fn draw_circle_color(&mut self, cx: u32, cy: u32, r: u32, filled: bool, color: u32) {
        let cx_i = cx as i32;
        let cy_i = cy as i32;
        let r_i = r as i32;

        let mut x = r_i;
        let mut y = 0;
        let mut d = 1 - r_i;

        while x >= y {
            if filled {
                self.clipped_hline(cx_i - x, cx_i + x, cy_i + y, color);
                self.clipped_hline(cx_i - x, cx_i + x, cy_i - y, color);
                self.clipped_hline(cx_i - y, cx_i + y, cy_i + x, color);
                self.clipped_hline(cx_i - y, cx_i + y, cy_i - x, color);
            } else {
                self.safe_dot(cx_i + x, cy_i + y, color);
                self.safe_dot(cx_i + y, cy_i + x, color);
                self.safe_dot(cx_i - y, cy_i + x, color);
                self.safe_dot(cx_i - x, cy_i + y, color);
                self.safe_dot(cx_i - x, cy_i - y, color);
                self.safe_dot(cx_i - y, cy_i - x, color);
                self.safe_dot(cx_i + y, cy_i - x, color);
                self.safe_dot(cx_i + x, cy_i - y, color);
            }

            y += 1;
            if d < 0 {
                d += 2 * y + 1;
            } else {
                x -= 1;
                d += 2 * (y - x) + 1;
            }
        }
    }

    fn clipped_hline(&mut self, x1: i32, x2: i32, y: i32, color: u32) {
        if y < 0 || y >= self.height as i32 {
            return;
        }

        let mut start = x1;
        let mut end = x2;
        if start > end {
            std::mem::swap(&mut start, &mut end);
        }

        if start >= self.width as i32 || end < 0 {
            return;
        }

        let final_start = start.max(0) as u32;
        let final_end = end.min(self.width as i32 - 1) as u32;

        if final_start <= final_end {
            self.draw_line_h_color(final_start, final_end, y as u32, color);
        }
    }

    fn safe_dot(&mut self, x: i32, y: i32, color: u32) {
        if x >= 0 && x < self.width as i32 && y >= 0 && y < self.height as i32 {
            self.draw_dot_color(x as u32, y as u32, color);
        }
    }

    pub fn draw_line_h_color(&mut self, x1: u32, x2: u32, y: u32, color: u32) {
        if y >= self.height { return; }
        let start = x1.min(x2).min(self.width);
        let end = x1.max(x2).min(self.width);
        for x in start..end {
            self.draw_dot_color(x, y, color);
        }
    }

    pub fn draw_line_old(&mut self, x0: i32, y0: i32, x1: i32, y1: i32, color: u32) {
        let dx =  (x1 - x0).abs();
        let dy = -(y1 - y0).abs();

        let sx = if x0 < x1 { 1 } else { -1 };
        let sy = if y0 < y1 { 1 } else { -1 };

        let mut err = dx + dy;

        let mut cx = x0;
        let mut cy = y0;

        loop {
            if cx >= 0 && cx < self.width as i32 && cy >= 0 && cy < self.height as i32 {
                let index = (cy * self.width as i32 + cx) as usize;
                self.pixels[index] = color;
            }

            if cx == x1 && cy == y1 { break; }

            let e2 = 2 * err;
            if e2 >= dy {
                err += dy;
                cx += sx;
            }
            if e2 <= dx {
                err += dx;
                cy += sy;
            }
        }
    }
}

pub fn generate_colors(seed: u64, len: usize, unique: bool) -> Vec<u32> {
    let mut rng = StdRng::seed_from_u64(seed);

    let mut colors = Vec::with_capacity(len);
    let mut seen = HashSet::new();

    while colors.len() < len {
        let rgba = rng.random::<u32>() | 0xff000000;

        if unique {
            if seen.insert(rgba) { colors.push(rgba); }
        }
        else { colors.push(rgba); }

        if unique && colors.len() > 0xffffff { break; }
    }

    return colors;
}

pub fn rotate_3d_x(x: i32, y: i32, z: i32, theta: f64) -> [i32; 3] {
    /*
        [ x ][ 1   0     0  ]
        [ y ][ 0 cosA -sinA ]
        [ z ][ 0 sinA  cosA ]
    */

    let cos = theta.cos();
    let sin = theta.sin();

    let fy = y as f64;
    let fz = z as f64;

    let fpy = fy*cos - fz*sin;
    let fpz = fy*sin + fz*cos;

    let py = fpy as i32;
    let pz = fpz as i32;

    return [x, py, pz];
}


pub fn rotate_3d_y(x: i32, y: i32, z: i32, theta: f64) -> [i32; 3] {
    /*
        [ x ][  cos 0  sin ]
        [ y ][   0  1   0  ]
        [ z ][ -sin 0  cos ]
    */

    let cos = theta.cos();
    let sin = theta.sin();

    let fx = x as f64;
    let fz = z as f64;

    let fpx = fx*cos + fz*sin;
    let fpz = fz*cos - fx*sin;

    let px = fpx as i32;
    let pz = fpz as i32;

    return [px, y, pz];
}


pub fn rotate_3d_z(x: i32, y: i32, z: i32, theta: f64) -> [i32; 3] {
    /*
        [ x ][ cos -sin 0 ]
        [ y ][ sin  cos 0 ]
        [ z ][  0    0  1 ]
    */

    let cos = theta.cos();
    let sin = theta.sin();

    let fx = x as f64;
    let fy = y as f64;

    let fpx = fx*cos - fy*sin;
    let fpy = fx*sin + fy*cos;

    let px = fpx as i32;
    let py = fpy as i32;

    return [px, py, z];
}