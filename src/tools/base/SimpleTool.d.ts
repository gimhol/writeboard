import { WhiteBoard } from "../../board/WhiteBoard";
import { IShapeGeoData } from "../../event/Events";
import { Shape } from "../../shape/base/Shape";
import type { ShapeType } from "../../shape/ShapeEnum";
import type { IDot } from "../../utils/Dot";
import { RectHelper } from "../../utils/RectHelper";
import type { ToolType } from "../ToolEnum";
import type { ITool } from "./Tool";
type FnKeys = 'Control' | 'Alt' | 'Shift';
export declare class SimpleTool implements ITool {
    get type(): string;
    private _type;
    private _shapeType;
    constructor(type: ToolType, shapeType: ShapeType);
    protected _keys: {
        [key in FnKeys]?: boolean;
    };
    protected keydown(e: KeyboardEvent): void;
    protected keyup(e: KeyboardEvent): void;
    holdingKey(...keys: FnKeys[]): boolean;
    start(): void;
    end(): void;
    render(): void;
    get board(): WhiteBoard | undefined;
    set board(v: WhiteBoard | undefined);
    pointerMove(dot: IDot): void;
    pointerDown(dot: IDot): void;
    pointerDraw(dot: IDot): void;
    pointerUp(dot: IDot): void;
    protected applyRect(): void;
    private updateGeo;
    protected _prevData: IShapeGeoData | undefined;
    protected _curShape: Shape | undefined;
    protected _board: WhiteBoard | undefined;
    protected _rect: RectHelper;
}
export {};
