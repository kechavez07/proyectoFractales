import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Download, RotateCcw, ZoomIn, ZoomOut, Move } from 'lucide-react';
import { FractalType } from './FractalCanvas';
import { FractalConfig } from '@/utils/fractalAlgorithms';

interface FractalControlsProps {
  fractalType: FractalType;
  config: FractalConfig;
  onFractalTypeChange: (type: FractalType) => void;
  onConfigChange: (config: Partial<FractalConfig>) => void;
  onSave: () => void;
  onReset: () => void;
}

const fractalOptions = [
  { value: 'koch' as FractalType, label: 'Curva de Koch', description: 'Copo de nieve fractal' },
  { value: 'sierpinski' as FractalType, label: 'Triángulo de Sierpinski', description: 'Triángulo recursivo' },
  { value: 'mandelbrot' as FractalType, label: 'Conjunto de Mandelbrot', description: 'Fractal complejo clásico' },
  { value: 'julia' as FractalType, label: 'Conjunto de Julia', description: 'Fractal complejo dinámico' },
  { value: 'tree' as FractalType, label: 'Árbol Fractal', description: 'Árbol recursivo natural' }
];

export const FractalControls: React.FC<FractalControlsProps> = ({
  fractalType,
  config,
  onFractalTypeChange,
  onConfigChange,
  onSave,
  onReset
}) => {
  const currentFractal = fractalOptions.find(f => f.value === fractalType);

  const getMaxIterations = () => {
    switch (fractalType) {
      case 'koch':
      case 'sierpinski':
      case 'tree':
        return 8;
      case 'mandelbrot':
      case 'julia':
        return 100;
      default:
        return 10;
    }
  };

  return (
    <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm border-border">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
          Controles de Fractal
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {currentFractal?.description}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Selector de Fractal */}
        <div className="space-y-2">
          <Label htmlFor="fractal-select" className="text-sm font-medium">
            Tipo de Fractal
          </Label>
          <Select value={fractalType} onValueChange={onFractalTypeChange}>
            <SelectTrigger id="fractal-select" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fractalOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Control de Iteraciones */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-medium">
              Iteraciones / Profundidad
            </Label>
            <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
              {config.iterations}
            </span>
          </div>
          <Slider
            value={[config.iterations]}
            onValueChange={([value]) => onConfigChange({ iterations: value })}
            max={getMaxIterations()}
            min={1}
            step={1}
            className="w-full"
          />
        </div>

        {/* Control de Zoom */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-medium flex items-center gap-2">
              <ZoomIn className="w-4 h-4" />
              Zoom
            </Label>
            <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
              {config.zoom.toFixed(2)}x
            </span>
          </div>
          <Slider
            value={[config.zoom]}
            onValueChange={([value]) => onConfigChange({ zoom: value })}
            max={5}
            min={0.1}
            step={0.1}
            className="w-full"
          />
        </div>

        {/* Control de Rotación */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-medium flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Rotación
            </Label>
            <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
              {Math.round((config.rotation * 180) / Math.PI)}°
            </span>
          </div>
          <Slider
            value={[config.rotation]}
            onValueChange={([value]) => onConfigChange({ rotation: value })}
            max={Math.PI * 2}
            min={0}
            step={0.1}
            className="w-full"
          />
        </div>

        {/* Controles de Traslación */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Move className="w-4 h-4" />
            Posición
          </Label>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Horizontal</Label>
              <Slider
                value={[config.offsetX]}
                onValueChange={([value]) => onConfigChange({ offsetX: value })}
                max={200}
                min={-200}
                step={5}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Vertical</Label>
              <Slider
                value={[config.offsetY]}
                onValueChange={([value]) => onConfigChange({ offsetY: value })}
                max={200}
                min={-200}
                step={5}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex gap-2 pt-4">
          <Button 
            onClick={onSave}
            className="flex-1 bg-gradient-primary hover:opacity-90 transition-opacity"
            size="sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Guardar
          </Button>
          
          <Button 
            onClick={onReset}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Resetear
          </Button>
        </div>

        {/* Información adicional */}
        <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
          <p className="font-medium mb-1">💡 Consejos:</p>
          <ul className="space-y-1">
            <li>• Usa el mouse para interacciones rápidas</li>
            <li>• Aumenta iteraciones gradualmente</li>
            <li>• Combina zoom y rotación para efectos únicos</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};