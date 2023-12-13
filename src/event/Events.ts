import { Layer } from "../board";
import { Shape, ShapeType } from "../shape";
import { IShapeData } from "../shape/base/Data";
import { ToolType } from "../tools/ToolEnum";
import { EventEnum } from "./EventType";

export namespace Events {
  export interface IOperatorDetail {
    operator: string;
  }
  export interface IShapesDetail extends IOperatorDetail {
    shapeDatas: IShapeData[];
  }
  export interface IShagesDetail<T extends Partial<IShapeData>> extends IOperatorDetail {
    shapeType: ShapeType;
    shapeDatas: [T, T][];
  }
  export interface IAnyShagesDetail extends IOperatorDetail {
    tool: ToolType,
    shapeDatas: (readonly [Partial<IShapeData>, Partial<IShapeData>])[];
  }
  export interface ILayerDetail extends IOperatorDetail {
    layer: Layer
  }
  export interface IShapeGeoData {
    i: string;
    x?: number;
    y?: number;
    w?: number;
    h?: number;
    r?: number;
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
      h: data.h,
      r: data.r
    }
  }
  export interface IToolChangedDetail {
    operator: string;
    from: ToolType;
    to: ToolType;
  }
  export interface EventDetailMap {
    [EventEnum.ShapesAdded]: IShapesDetail;
    [EventEnum.ShapesRemoved]: IShapesDetail;
    [EventEnum.ShapesChanging]: IShagesDetail<IShapeData>;
    [EventEnum.ShapesChanged]: IShagesDetail<IShapeData>;
    [EventEnum.ShapesDone]: IShapesDetail;
    [EventEnum.ShapesGeoChanging]: IAnyShagesDetail;
    [EventEnum.ShapesGeoChanged]: IAnyShagesDetail;
    [EventEnum.ToolChanged]: IToolChangedDetail;
    [EventEnum.LayerAdded]: ILayerDetail;
    [EventEnum.LayerRemoved]: ILayerDetail;
    [EventEnum.ShapesSelected]: IShapesDetail;
    [EventEnum.ShapesDeselected]: IShapesDetail;
  }
  export interface EventMap extends HTMLElementEventMap {
    [EventEnum.ShapesAdded]: CustomEvent<EventDetailMap[EventEnum.ShapesAdded]>;
    [EventEnum.ShapesRemoved]: CustomEvent<EventDetailMap[EventEnum.ShapesRemoved]>;
    [EventEnum.ShapesChanging]: CustomEvent<EventDetailMap[EventEnum.ShapesChanging]>;
    [EventEnum.ShapesChanged]: CustomEvent<EventDetailMap[EventEnum.ShapesChanged]>;
    [EventEnum.ShapesDone]: CustomEvent<EventDetailMap[EventEnum.ShapesDone]>;
    [EventEnum.ShapesGeoChanging]: CustomEvent<EventDetailMap[EventEnum.ShapesGeoChanging]>;
    [EventEnum.ShapesGeoChanged]: CustomEvent<EventDetailMap[EventEnum.ShapesGeoChanged]>;
    [EventEnum.ToolChanged]: CustomEvent<EventDetailMap[EventEnum.ToolChanged]>;
    [EventEnum.LayerAdded]: CustomEvent<EventDetailMap[EventEnum.LayerAdded]>;
    [EventEnum.LayerRemoved]: CustomEvent<EventDetailMap[EventEnum.LayerRemoved]>;
    [EventEnum.ShapesSelected]: CustomEvent<EventDetailMap[EventEnum.ShapesSelected]>;
    [EventEnum.ShapesDeselected]: CustomEvent<EventDetailMap[EventEnum.ShapesDeselected]>;
  }
}

