import type { Shape } from "../shape";
import { Board } from "./Board";

export interface IShapeDecoration {
  board: Board;
  ghost?: (shape: Shape, ctx: CanvasRenderingContext2D) => void;
  locked?: (shape: Shape, ctx: CanvasRenderingContext2D) => void;
  selected?: (shape: Shape, ctx: CanvasRenderingContext2D) => void;
  resizable?: (shape: Shape, ctx: CanvasRenderingContext2D) => void;
  debug?: (shape: Shape, ctx: CanvasRenderingContext2D) => void;
}
