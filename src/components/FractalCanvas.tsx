import React, { useRef, useEffect, useCallback } from 'react';
import { 
  KochCurve, 
  SierpinskiTriangle, 
  MandelbrotSet, 
  JuliaSet, 
  FractalTree,
  Point,
  FractalConfig 
} from '@/utils/fractalAlgorithms';

export type FractalType = 'koch' | 'sierpinski' | 'mandelbrot' | 'julia' | 'tree';

interface FractalCanvasProps {
  fractalType: FractalType;
  config: FractalConfig;
  width: number;
  height: number;
  onSave?: () => void;
}

export const FractalCanvas: React.FC<FractalCanvasProps> = ({
  fractalType,
  config,
  width,
  height,
  onSave
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawFractal = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Limpiar canvas
    ctx.clearRect(0, 0, width, height);
    
    // Aplicar transformaciones
    ctx.save();
    ctx.translate(width / 2 + config.offsetX, height / 2 + config.offsetY);
    ctx.scale(config.zoom, config.zoom);
    ctx.rotate(config.rotation);
    ctx.translate(-width / 2, -height / 2);

    // Configurar estilo
    ctx.strokeStyle = config.color;
    ctx.fillStyle = config.color;
    ctx.lineWidth = 2 / config.zoom;

    switch (fractalType) {
      case 'koch':
        drawKochSnowflake(ctx, width, height, config.iterations);
        break;
      case 'sierpinski':
        drawSierpinskiTriangle(ctx, width, height, config.iterations);
        break;
      case 'mandelbrot':
        drawMandelbrotSet(ctx, width, height, config);
        break;
      case 'julia':
        drawJuliaSet(ctx, width, height, config);
        break;
      case 'tree':
        drawFractalTree(ctx, width, height, config.iterations);
        break;
    }

    ctx.restore();
  }, [fractalType, config, width, height]);

  const drawKochSnowflake = (ctx: CanvasRenderingContext2D, w: number, h: number, iterations: number) => {
    const center: Point = { x: w / 2, y: h / 2 };
    const radius = Math.min(w, h) * 0.3;
    
    const sides = KochCurve.generateSnowflake(center, radius, iterations);
    
    ctx.beginPath();
    sides.forEach(side => {
      if (side.length > 0) {
        ctx.moveTo(side[0].x, side[0].y);
        side.forEach(point => ctx.lineTo(point.x, point.y));
      }
    });
    ctx.stroke();
  };

  const drawSierpinskiTriangle = (ctx: CanvasRenderingContext2D, w: number, h: number, iterations: number) => {
    const size = Math.min(w, h) * 0.6;
    const height = (size * Math.sqrt(3)) / 2;
    
    const p1: Point = { x: w / 2, y: (h - height) / 2 };
    const p2: Point = { x: (w - size) / 2, y: (h + height) / 2 };
    const p3: Point = { x: (w + size) / 2, y: (h + height) / 2 };

    const triangles = SierpinskiTriangle.generate(p1, p2, p3, iterations);
    
    triangles.forEach(triangle => {
      ctx.beginPath();
      ctx.moveTo(triangle[0].x, triangle[0].y);
      ctx.lineTo(triangle[1].x, triangle[1].y);
      ctx.lineTo(triangle[2].x, triangle[2].y);
      ctx.closePath();
      ctx.stroke();
    });
  };

  const drawMandelbrotSet = (ctx: CanvasRenderingContext2D, w: number, h: number, config: FractalConfig) => {
    const imageData = MandelbrotSet.generate(
      w, h, config.zoom, config.offsetX / 100, config.offsetY / 100, config.iterations
    );
    ctx.putImageData(imageData, 0, 0);
  };

  const drawJuliaSet = (ctx: CanvasRenderingContext2D, w: number, h: number, config: FractalConfig) => {
    // Parámetros del conjunto de Julia
    const c = { real: -0.7, imag: 0.27015 };
    const imageData = JuliaSet.generate(
      w, h, config.zoom, config.offsetX / 100, config.offsetY / 100, c, config.iterations
    );
    ctx.putImageData(imageData, 0, 0);
  };

  const drawFractalTree = (ctx: CanvasRenderingContext2D, w: number, h: number, iterations: number) => {
    const startPoint: Point = { x: w / 2, y: h * 0.9 };
    const initialLength = Math.min(w, h) * 0.25;
    const branches = FractalTree.generate(startPoint, -Math.PI / 2, initialLength, iterations);
    
    branches.forEach(branch => {
      ctx.beginPath();
      ctx.moveTo(branch[0].x, branch[0].y);
      ctx.lineTo(branch[1].x, branch[1].y);
      ctx.stroke();
    });
  };

  const saveCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `fractal-${fractalType}-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
    
    onSave?.();
  }, [fractalType, onSave]);

  // Exponer función de guardado
  React.useImperativeHandle(onSave, () => ({
    save: saveCanvas
  }), [saveCanvas]);

  useEffect(() => {
    drawFractal();
  }, [drawFractal]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-border rounded-lg bg-gradient-canvas shadow-2xl"
      />
    </div>
  );
};