import type { Layer } from "../board/Layer";
import type { ShapeType } from "../shape/ShapeEnum";
import type { IShapeData } from "../shape/base/IShapeData";
import type { ToolType } from "../tools/ToolEnum";
import type { ITool } from "../tools/base/Tool";
import type { IRect } from "../utils";
import type { EventEnum } from "./EventType";

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
    from?: ToolType;
    to?: ToolType;
  }
  export interface IRectChangeDetail {
    form: IRect;
    to: IRect;
  }
  export interface IToolDetail {
    operator: string;
    tool: ITool;
    x: number;
    y: number;
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
    [EventEnum.WorldRectChanged]: IRectChangeDetail;
    [EventEnum.ViewportChanged]: IRectChangeDetail;
    [EventEnum.ToolDown]: IToolDetail;
    [EventEnum.ToolDraw]: IToolDetail;
    [EventEnum.ToolMove]: IToolDetail;
    [EventEnum.ToolUp]: IToolDetail;
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
    [EventEnum.WorldRectChanged]: CustomEvent<EventDetailMap[EventEnum.WorldRectChanged]>;
    [EventEnum.ViewportChanged]: CustomEvent<EventDetailMap[EventEnum.ViewportChanged]>;
    [EventEnum.ToolDown]: CustomEvent<EventDetailMap[EventEnum.ToolDown]>;
    [EventEnum.ToolDraw]: CustomEvent<EventDetailMap[EventEnum.ToolDraw]>;
    [EventEnum.ToolMove]: CustomEvent<EventDetailMap[EventEnum.ToolMove]>;
    [EventEnum.ToolUp]: CustomEvent<EventDetailMap[EventEnum.ToolUp]>;
  }
}

