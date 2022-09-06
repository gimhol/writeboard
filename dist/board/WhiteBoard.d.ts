import { Shape, ShapeData } from "../shape/base";
import { IObserver, Listener, Callback, IEmitter, Options, EventMap, BaseEvent } from "../event";
import { ToolType, ITool } from "../tools";
import { IRect, IDot } from "../utils";
import { IFactory, IShapesMgr } from "../mgr";
export interface WhiteBoardOptions {
    onscreen: HTMLCanvasElement;
    offscreen: HTMLCanvasElement;
}
export interface IPointerEventHandler {
    (ev: PointerEvent): void;
}
export declare class WhiteBoard implements IObserver, IEmitter, IShapesMgr {
    private _factory;
    private _toolType;
    private _onscreen;
    private _offscreen;
    private _shapesMgr;
    private _mousedown;
    private _tools;
    private _tool;
    private _selects;
    private _eventsObserver;
    private _eventEmitter;
    private _operators;
    private _operator;
    constructor(factory: IFactory, options: WhiteBoardOptions);
    finds(ids: string[]): Shape[];
    find(id: string): Shape | undefined;
    toJson(): any;
    toJsonStr(): string;
    fromJson(jobj: any): void;
    fromJsonStr(json: string): void;
    shapes(): Shape<ShapeData>[];
    exists(...items: Shape<ShapeData>[]): number;
    hit(rect: IRect): Shape<ShapeData> | undefined;
    hits(rect: IRect): Shape<ShapeData>[];
    addEventListener<K extends keyof EventMap>(type: K, callback: (evt: EventMap[K]) => any, options?: Options): Listener;
    removeEventListener<K extends keyof EventMap>(type: K, callback: (evt: EventMap[K]) => any, options?: Options): void;
    dispatchEvent(e: BaseEvent): boolean;
    on<K extends keyof EventMap>(type: K, callback: (evt: EventMap[K]) => any, options?: Options): () => void;
    once<K extends keyof EventMap>(type: K, callback: (evt: EventMap[K]) => any, options?: Options): () => void;
    emit(e: BaseEvent): boolean;
    listenTo(target: EventTarget, type: string, callback: Callback | null, options?: boolean | AddEventListenerOptions): () => void;
    destory(): void;
    get factory(): IFactory;
    set factory(v: IFactory);
    get ctx(): CanvasRenderingContext2D | null;
    get octx(): CanvasRenderingContext2D | null;
    get onscreen(): HTMLCanvasElement;
    get offscreen(): HTMLCanvasElement;
    get toolType(): string;
    set toolType(v: string);
    setToolType(to: ToolType): void;
    get selects(): Shape<ShapeData>[];
    set selects(v: Shape<ShapeData>[]);
    add(...shapes: Shape[]): number;
    remove(...shapes: Shape[]): number;
    removeAll(): number;
    removeSelected(): void;
    selectAll(): void;
    deselect(): void;
    selectAt(rect: IRect): Shape[];
    selectNear(rect: IRect): Shape | undefined;
    getDot(ev: MouseEvent | PointerEvent): IDot;
    get tools(): {
        [x: string]: ITool | undefined;
    };
    get tool(): ITool;
    pointerdown: IPointerEventHandler;
    pointermove: IPointerEventHandler;
    pointerup: IPointerEventHandler;
    private _dirty;
    markDirty(rect: IRect): void;
    render(): void;
}
