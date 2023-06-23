import { Layer } from "../board";
import { ShapeType } from "../shape";
import { IShapeData } from "../shape/base/Data";
import { ToolType } from "../tools/ToolEnum";
import { EventEnum } from "./EventType";
export namespace WhiteBoardEvent {
  export interface IFullDetail {
    operator?: string;
    shapeDatas?: IShapeData[];
  }
  export function shapesAdded(detail: IFullDetail): CustomEvent<IFullDetail> {
    return new CustomEvent(EventEnum.ShapesAdded, { detail });
  }
  export function shapesRemoved(detail: IFullDetail): CustomEvent<IFullDetail> {
    return new CustomEvent(EventEnum.ShapesRemoved, { detail });
  }

  export function shapesChanged(detail: IPartDetail<IShapeData>) {
    return new CustomEvent(EventEnum.ShapesChanged, { detail });
  }

  export interface IPartDetail<T extends Partial<IShapeData>> {
    shapeType?: ShapeType;
    operator?: string;
    shapeDatas: [T, T][];
  }
  export interface IShapePositionData extends Pick<IShapeData, 'i' | 'x' | 'y'> { }
  export function shapesMoved(detail: IPartDetail<IShapePositionData>) {
    return new CustomEvent(EventEnum.ShapesMoved, { detail });
  }

  export interface IShapeGeoData extends Pick<IShapeData, 'i' | 'x' | 'y' | 'w' | 'h'> { }
  export function shapesResized(detail: IPartDetail<IShapeGeoData>) {
    return new CustomEvent(EventEnum.ShapesResized, { detail });
  }
  export function pickShapePositionData(data: IShapeData): IShapePositionData {
    return {
      i: data.i,
      x: data.x,
      y: data.y
    }
  }
  export function pickShapeGeoData(data: IShapeData): IShapeGeoData {
    return {
      i: data.i,
      x: data.x,
      y: data.y,
      w: data.w,
      h: data.h
    }
  }
  export interface IToolChangedDetail {
    operator: string;
    from: ToolType;
    to: ToolType;
  }
  export function toolChanged(detail: IToolChangedDetail) {
    return new CustomEvent(EventEnum.ToolChanged, { detail });
  }
  export interface EventMap extends HTMLElementEventMap {
    [EventEnum.ShapesAdded]: CustomEvent<IFullDetail>;
    [EventEnum.ShapesRemoved]: CustomEvent<IFullDetail>;
    [EventEnum.ShapesChanged]: CustomEvent<IPartDetail<IShapeData>>;
    [EventEnum.ShapesMoved]: CustomEvent<IPartDetail<IShapePositionData>>;
    [EventEnum.ShapesResized]: CustomEvent<IPartDetail<IShapePositionData>>;
    [EventEnum.ToolChanged]: CustomEvent<IToolChangedDetail>;
    [EventEnum.LayerAdded]: CustomEvent<Layer>;
    [EventEnum.LayerRemoved]: CustomEvent<Layer>;
  }
}

