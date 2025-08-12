import React, { useState, useCallback } from 'react';
import { FractalCanvas, FractalType } from './FractalCanvas';
import { FractalControls } from './FractalControls';
import { FractalConfig } from '@/utils/fractalAlgorithms';
import { toast } from 'sonner';

const defaultConfig: FractalConfig = {
  iterations: 3,
  zoom: 1,
  rotation: 0,
  offsetX: 0,
  offsetY: 0,
  color: '#FF4DDBFF'
};

export const FractalViewer: React.FC = () => {
  const [fractalType, setFractalType] = useState<FractalType>('koch');
  const [config, setConfig] = useState<FractalConfig>(defaultConfig);

  const handleConfigChange = useCallback((newConfig: Partial<FractalConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  const handleFractalTypeChange = useCallback((type: FractalType) => {
    setFractalType(type);
    // Resetear configuración al cambiar de fractal
    setConfig(defaultConfig);
    toast.success(`Fractal cambiado a: ${type}`);
  }, []);

  const handleSave = useCallback(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) {
      toast.error('No se pudo acceder al canvas');
      return;
    }

    const link = document.createElement('a');
    link.download = `fractal-${fractalType}-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
    
    toast.success('¡Fractal guardado exitosamente!');
  }, [fractalType]);

  const handleReset = useCallback(() => {
    setConfig(defaultConfig);
    toast.info('Configuración reseteada');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-secondary p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Visualizador Interactivo de Fractales
          </h1>
          <p className="text-foreground/80 text-lg">
            Explora la belleza matemática de los fractales clásicos
          </p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Controls Panel */}
          <div className="lg:w-80 flex-shrink-0">
            <FractalControls
              fractalType={fractalType}
              config={config}
              onFractalTypeChange={handleFractalTypeChange}
              onConfigChange={handleConfigChange}
              onSave={handleSave}
              onReset={handleReset}
            />
          </div>

          {/* Canvas Area */}
          <div className="flex-1 flex justify-center items-center">
            <div className="relative">
              <FractalCanvas
                fractalType={fractalType}
                config={config}
                width={800}
                height={600}
              />
              
              {/* Overlay Info */}
              <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 border border-border">
                <div className="text-sm space-y-1">
                  <div className="font-medium text-foreground">
                    {fractalType.charAt(0).toUpperCase() + fractalType.slice(1)}
                  </div>
                  <div className="text-muted-foreground text-xs">
                    Iteraciones: {config.iterations}
                  </div>
                  <div className="text-muted-foreground text-xs">
                    Zoom: {config.zoom.toFixed(1)}x
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <div className="bg-card/50 backdrop-blur-sm rounded-lg p-6 border border-border max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              Acerca de los Fractales
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-muted-foreground">
              <div>
                <strong className="text-foreground">Curva de Koch:</strong> 
                <p>Un fractal geométrico que se construye dividiendo una línea en tres partes y reemplazando la parte central con dos lados de un triángulo equilátero.</p>
              </div>
              <div>
                <strong className="text-foreground">Triángulo de Sierpinski:</strong>
                <p>Se obtiene dividiendo recursivamente un triángulo en triángulos más pequeños, creando un patrón autosimilar infinito.</p>
              </div>
              <div>
                <strong className="text-foreground">Conjunto de Mandelbrot:</strong>
                <p>Un fractal matemático definido en el plano complejo, famoso por su frontera fractal infinitamente compleja.</p>
              </div>
              <div>
                <strong className="text-foreground">Conjunto de Julia:</strong>
                <p>Una familia de fractales relacionados con el conjunto de Mandelbrot, cada uno con su propia estructura única.</p>
              </div>
              <div>
                <strong className="text-foreground">Árbol Fractal:</strong>
                <p>Simula el crecimiento natural de un árbol mediante ramificación recursiva, común en la naturaleza.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};