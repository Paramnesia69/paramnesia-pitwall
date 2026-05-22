const CIRCUIT_IMAGES: Record<string, string> = {
  'Circuit de Monaco': '/circuits/circuit_monaco.jpg',
  'Circuit de Spa-Francorchamps': '/circuits/circuit_spa.jpg',
  'Circuit de la Sarthe': '/circuits/circuit_lemans.jpg',
  'Daytona International Speedway': '/circuits/circuit_daytona.jpg',
};

export function getCircuitImage(circuitName: string): string | undefined {
  return CIRCUIT_IMAGES[circuitName];
}
