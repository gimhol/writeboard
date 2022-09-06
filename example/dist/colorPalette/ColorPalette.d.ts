import { RGBA } from "./Color";
export declare class ColorPalette {
    private _colorCol;
    private _alphaRow;
    private _hbZone;
    private _finalZone;
    _onChanged: undefined | ((rgba: RGBA) => void);
    constructor(onscreen: HTMLCanvasElement);
}
