/**
 * Algoritmos de generación de fractales
 * Implementa los fractales clásicos: Koch, Sierpinski, Mandelbrot, Julia y Árbol recursivo
 */

export interface Point {
  x: number;
  y: number;
}

export interface FractalConfig {
  iterations: number;
  zoom: number;
  rotation: number;
  offsetX: number;
  offsetY: number;
  color: string;
}

/**
 * Curva de Koch
 */
export class KochCurve {
  static generate(p1: Point, p2: Point, iterations: number): Point[] {
    if (iterations === 0) {
      return [p1, p2];
    }

    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;

    // Calcular los puntos de la curva de Koch
    const p3: Point = {
      x: p1.x + dx / 3,
      y: p1.y + dy / 3
    };

    const p5: Point = {
      x: p1.x + (2 * dx) / 3,
      y: p1.y + (2 * dy) / 3
    };

    // Calcular el punto superior del triángulo
    const angle = Math.PI / 3; // 60 grados
    const length = Math.sqrt((dx / 3) ** 2 + (dy / 3) ** 2);
    const baseAngle = Math.atan2(dy, dx);

    const p4: Point = {
      x: p3.x + length * Math.cos(baseAngle - angle),
      y: p3.y + length * Math.sin(baseAngle - angle)
    };

    // Recursión para cada segmento
    const seg1 = this.generate(p1, p3, iterations - 1);
    const seg2 = this.generate(p3, p4, iterations - 1);
    const seg3 = this.generate(p4, p5, iterations - 1);
    const seg4 = this.generate(p5, p2, iterations - 1);

    return [...seg1.slice(0, -1), ...seg2.slice(0, -1), ...seg3.slice(0, -1), ...seg4];
  }

  static generateSnowflake(center: Point, radius: number, iterations: number): Point[][] {
    const angles = [0, 2 * Math.PI / 3, 4 * Math.PI / 3];
    const sides: Point[][] = [];

    for (let i = 0; i < 3; i++) {
      const angle1 = angles[i];
      const angle2 = angles[(i + 1) % 3];

      const p1: Point = {
        x: center.x + radius * Math.cos(angle1),
        y: center.y + radius * Math.sin(angle1)
      };

      const p2: Point = {
        x: center.x + radius * Math.cos(angle2),
        y: center.y + radius * Math.sin(angle2)
      };

      sides.push(this.generate(p1, p2, iterations));
    }

    return sides;
  }
}

/**
 * Triángulo de Sierpinski
 */
export class SierpinskiTriangle {
  static generate(p1: Point, p2: Point, p3: Point, iterations: number): Point[][] {
    if (iterations === 0) {
      return [[p1, p2, p3]];
    }

    // Calcular puntos medios
    const mid1: Point = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
    const mid2: Point = { x: (p2.x + p3.x) / 2, y: (p2.y + p3.y) / 2 };
    const mid3: Point = { x: (p3.x + p1.x) / 2, y: (p3.y + p1.y) / 2 };

    // Recursión en los tres triángulos
    const triangles1 = this.generate(p1, mid1, mid3, iterations - 1);
    const triangles2 = this.generate(mid1, p2, mid2, iterations - 1);
    const triangles3 = this.generate(mid3, mid2, p3, iterations - 1);

    return [...triangles1, ...triangles2, ...triangles3];
  }
}

/**
 * Conjunto de Mandelbrot
 */
export class MandelbrotSet {
  static isInSet(c: { real: number; imag: number }, maxIterations: number): number {
    let z = { real: 0, imag: 0 };
    let iterations = 0;

    while (iterations < maxIterations && (z.real * z.real + z.imag * z.imag) < 4) {
      const zReal = z.real * z.real - z.imag * z.imag + c.real;
      const zImag = 2 * z.real * z.imag + c.imag;
      z = { real: zReal, imag: zImag };
      iterations++;
    }

    return iterations;
  }

  static generate(
    width: number,
    height: number,
    zoom: number,
    offsetX: number,
    offsetY: number,
    maxIterations: number
  ): ImageData {
    const imageData = new ImageData(width, height);
    const data = imageData.data;

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const real = (x - width / 2) / (zoom * width / 4) + offsetX;
        const imag = (y - height / 2) / (zoom * height / 4) + offsetY;

        const iterations = this.isInSet({ real, imag }, maxIterations);
        const index = (y * width + x) * 4;

        if (iterations === maxIterations) {
          // Punto en el conjunto (negro)
          data[index] = 0;
          data[index + 1] = 0;
          data[index + 2] = 0;
          data[index + 3] = 255;
        } else {
          // Colorear según iteraciones
          const ratio = iterations / maxIterations;
          const hue = (ratio * 360) % 360;
          const color = this.hslToRgb(hue, 70, 50);
          
          data[index] = color.r;
          data[index + 1] = color.g;
          data[index + 2] = color.b;
          data[index + 3] = 255;
        }
      }
    }

    return imageData;
  }

  private static hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
    h /= 360;
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h * 6) % 2 - 1));
    const m = l - c / 2;

    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 1/6) {
      r = c; g = x; b = 0;
    } else if (1/6 <= h && h < 1/3) {
      r = x; g = c; b = 0;
    } else if (1/3 <= h && h < 1/2) {
      r = 0; g = c; b = x;
    } else if (1/2 <= h && h < 2/3) {
      r = 0; g = x; b = c;
    } else if (2/3 <= h && h < 5/6) {
      r = x; g = 0; b = c;
    } else if (5/6 <= h && h < 1) {
      r = c; g = 0; b = x;
    }

    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255)
    };
  }
}

/**
 * Conjunto de Julia
 */
export class JuliaSet {
  static generate(
    width: number,
    height: number,
    zoom: number,
    offsetX: number,
    offsetY: number,
    c: { real: number; imag: number },
    maxIterations: number
  ): ImageData {
    const imageData = new ImageData(width, height);
    const data = imageData.data;

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const real = (x - width / 2) / (zoom * width / 4) + offsetX;
        const imag = (y - height / 2) / (zoom * height / 4) + offsetY;

        const iterations = this.isInSet({ real, imag }, c, maxIterations);
        const index = (y * width + x) * 4;

        if (iterations === maxIterations) {
          data[index] = 0;
          data[index + 1] = 0;
          data[index + 2] = 0;
          data[index + 3] = 255;
        } else {
          const ratio = iterations / maxIterations;
          const hue = (ratio * 360 + 180) % 360;
          const color = MandelbrotSet['hslToRgb'](hue, 80, 60);
          
          data[index] = color.r;
          data[index + 1] = color.g;
          data[index + 2] = color.b;
          data[index + 3] = 255;
        }
      }
    }

    return imageData;
  }

  private static isInSet(
    z: { real: number; imag: number },
    c: { real: number; imag: number },
    maxIterations: number
  ): number {
    let iterations = 0;

    while (iterations < maxIterations && (z.real * z.real + z.imag * z.imag) < 4) {
      const zReal = z.real * z.real - z.imag * z.imag + c.real;
      const zImag = 2 * z.real * z.imag + c.imag;
      z = { real: zReal, imag: zImag };
      iterations++;
    }

    return iterations;
  }
}

/**
 * Árbol fractal recursivo
 */
export class FractalTree {
  static generate(
    startPoint: Point,
    angle: number,
    length: number,
    iterations: number,
    branchAngle: number = Math.PI / 6
  ): Point[][] {
    if (iterations === 0 || length < 1) {
      return [];
    }

    const endPoint: Point = {
      x: startPoint.x + length * Math.cos(angle),
      y: startPoint.y + length * Math.sin(angle)
    };

    const branches: Point[][] = [[startPoint, endPoint]];

    // Recursión para las ramas
    const newLength = length * 0.7;
    const leftBranches = this.generate(endPoint, angle - branchAngle, newLength, iterations - 1, branchAngle);
    const rightBranches = this.generate(endPoint, angle + branchAngle, newLength, iterations - 1, branchAngle);

    return [...branches, ...leftBranches, ...rightBranches];
  }
}