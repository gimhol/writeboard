import { TextData } from "./Data";
import { Shape } from "../base";
import { IRect } from "../../utils/Rect";
import { TextSelection, ITextSelection } from "./TextSelection";
export interface ILineInfo extends TextMetrics {
    x: number;
    y: number;
    bl: number;
    str: string;
}
export declare class ShapeText extends Shape<TextData> {
    private _selection;
    private _lines;
    private _selectionRects;
    get text(): string;
    set text(v: string);
    get selection(): TextSelection;
    set selection(v: TextSelection);
    get selectionRects(): IRect[];
    constructor(data: TextData);
    merge(data: Partial<TextData>): void;
    private _cursorFlashingTimer;
    private _cursorVisible;
    private _setCursorVisible;
    private _setCursorFlashing;
    private _applyStyle;
    setText(v: string, dirty?: boolean): void;
    setSelection(v?: ITextSelection, dirty?: boolean): void;
    private _calculateLines;
    private _calculateSectionRects;
    render(ctx: CanvasRenderingContext2D): void;
}
