export interface ProductState {
  /** Continuous narrative chapter, from 0 to 11. */
  progress: number;
  /** Actual mechanical separation: 0 assembled, 1 fully exploded. */
  explode: number;
  power: boolean;
  /** Simulated signed optical adjustment, from -1.5 to +1.5 diopters. */
  focus: number;
  gazeX: number;
  gazeY: number;
  selected: string | null;
  labels: boolean;
  modular: number;
}

export interface ComponentInfo {
  id: string;
  name: string;
  description: string;
  material: string;
}

export interface ProductSceneOptions {
  interactive?: boolean;
  onSelect?: (id: string) => void;
  onReady?: () => void;
  onError?: () => void;
}

export interface ProductScene {
  setState(state: Partial<ProductState>): void;
  setView(view: string): void;
  zoom(delta: number): void;
  reset(): void;
  capture(): string;
  dispose(): void;
  getStats(): { drawCalls: number; triangles: number };
}

export const initialProductState: ProductState = {
  progress: 0,
  explode: 0,
  power: true,
  focus: 0,
  gazeX: 0,
  gazeY: 0,
  selected: null,
  labels: false,
  modular: 0,
};
