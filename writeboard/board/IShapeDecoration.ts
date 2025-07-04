import type { Shape } from "../shape";

export interface IShapeDecoration {
  ghost?: (shape: Shape, ctx: CanvasRenderingContext2D) => void;
  locked?: (shape: Shape, ctx: CanvasRenderingContext2D) => void;
  selected?: (shape: Shape, ctx: CanvasRenderingContext2D) => void;
  resizable?: (shape: Shape, ctx: CanvasRenderingContext2D) => void;
  debug?: (shape: Shape, ctx: CanvasRenderingContext2D) => void;
}
