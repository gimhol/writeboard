import { ShapeData } from "../base";
import { IDot } from "../../utils/Dot";
export declare class PolygonData extends ShapeData {
    constructor();
    dots: IDot[];
    copyFrom(other: Partial<PolygonData>): this;
    copy(): PolygonData;
}
