import { Shape } from "./Shape";
import { Board } from "../../board";
import { IShapeData } from "./Data";

export enum ShapeEventEnum {
  StartDirty = 'start_dirty',
  EndDirty = 'end_dirty',
  BoardChanged = 'board_changed'
}

export interface ShapeEventMap {
  [ShapeEventEnum.StartDirty]: CustomEvent<{ shape: Shape; prev?: Partial<IShapeData>; }>;
  [ShapeEventEnum.EndDirty]: CustomEvent<{ shape: Shape; prev?: Partial<IShapeData>; }>;
  [ShapeEventEnum.BoardChanged]: CustomEvent<{ shape: Shape; prev?: Board; }>;
}

export type ShapeEventListener<K extends keyof ShapeEventMap> = (this: HTMLObjectElement, ev: ShapeEventMap[K]) => any;

