import { Layer } from "../board";
import { Shape, ShapeType } from "../shape";
import { IShapeData } from "../shape/base/Data";
import { ToolType } from "../tools/ToolEnum";
import { EventEnum } from "./EventType";

export namespace Events {
  export interface IFullDetail {
    operator?: string;
    shapeDatas?: IShapeData[];
  }
  export interface IPartDetail<T extends Partial<IShapeData>> {
    shapeType?: ShapeType;
    operator?: string;
    shapeDatas: [T, T][];
  }
  export interface IShapeGeoData {
    i: string;
    x?: number;
    y?: number;
    w?: number;
    h?: number;
  }
  export function pickShapePosData(data: IShapeData): IShapeGeoData {
    return {
      i: data.i,
      x: data.x,
      y: data.y,
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
  export interface EventDetailMap {
    [EventEnum.ShapesAdded]: IFullDetail;
    [EventEnum.ShapesRemoved]: IFullDetail;
    [EventEnum.ShapesChanging]: IPartDetail<IShapeData>;
    [EventEnum.ShapesGeoChanging]: IPartDetail<IShapeGeoData>;
    [EventEnum.ShapesGeoChanged]: IPartDetail<IShapeGeoData>;
    [EventEnum.ToolChanged]: IToolChangedDetail;
    [EventEnum.LayerAdded]: Layer;
    [EventEnum.LayerRemoved]: Layer;
    [EventEnum.ShapesSelected]: IShapeData[];
    [EventEnum.ShapesDeselected]: IShapeData[];
  }
  export interface EventMap extends HTMLElementEventMap {
    [EventEnum.ShapesAdded]: CustomEvent<IFullDetail>;
    [EventEnum.ShapesRemoved]: CustomEvent<IFullDetail>;
    [EventEnum.ShapesChanging]: CustomEvent<IPartDetail<IShapeData>>;
    [EventEnum.ShapesGeoChanging]: CustomEvent<IPartDetail<IShapeGeoData>>;
    [EventEnum.ShapesGeoChanged]: CustomEvent<IPartDetail<IShapeGeoData>>;
    [EventEnum.ToolChanged]: CustomEvent<IToolChangedDetail>;
    [EventEnum.LayerAdded]: CustomEvent<Layer>;
    [EventEnum.LayerRemoved]: CustomEvent<Layer>;
    [EventEnum.ShapesSelected]: CustomEvent<IShapeData[]>;
    [EventEnum.ShapesDeselected]: CustomEvent<IShapeData[]>;
  }
}

