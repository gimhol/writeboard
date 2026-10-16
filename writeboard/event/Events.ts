import type { ILayerInfo } from "../board/Layer";
import type { IShapeData } from "../shape/base/IShapeData";
import type { ToolType } from "../tools/ToolEnum";
import type { ITool } from "../tools/base/Tool";
import type { IRect } from "../utils";
import type { EventEnum } from "./EventType";

export namespace Events {
  export type IEmit<T extends IBaseDetail> = Omit<T, 'type' | 'timestamp'>
  export interface IBaseDetail {
    type: string;
    timestamp: number;
    operator: string;
    /**
     * 事务 id：同一次连续手势（例如一次擦除拖拽）里产生的事件共用它，
     * ActionQueue 会把同一事务的动作合并成一条记录（一次撤回 / 重做走完整段手势）
     */
    tx?: string;
  }
  export interface IShapesDetail extends IBaseDetail {
    shapeDatas: IShapeData[];
  }
  export interface IShapesChangeDetail<T extends IShapeData = IShapeData> extends IBaseDetail {
    shapeDatas: [Readonly<Partial<T>>, Readonly<Partial<T>>][];
  }
  export interface IAnyShapesDetail extends IBaseDetail {
    tool: ToolType,
    shapeDatas: (readonly [Partial<IShapeData>, Partial<IShapeData>])[];
  }
  export interface ILayerDetail extends IBaseDetail {
    layer: ILayerInfo
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
  export interface IToolChangedDetail extends IBaseDetail {
    from?: ToolType;
    to?: ToolType;
  }
  export interface IRectChangeDetail extends IBaseDetail {
    form: IRect;
    to: IRect;
  }
  export interface IToolDetail extends IBaseDetail {
    tool: ITool;
    x: number;
    y: number;
  }
  export interface IDetailMap {
    [EventEnum.ShapesAdded]: IShapesDetail;
    [EventEnum.ShapesRemoved]: IShapesDetail;
    [EventEnum.ShapesChanging]: IShapesChangeDetail<IShapeData>;
    [EventEnum.ShapesChanged]: IShapesChangeDetail<IShapeData>;
    [EventEnum.ShapesDone]: IShapesDetail;
    [EventEnum.ShapesGeoChanging]: IAnyShapesDetail;
    [EventEnum.ShapesGeoChanged]: IAnyShapesDetail;
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
}

